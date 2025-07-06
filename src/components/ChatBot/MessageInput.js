'use client';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addMessage,
  setLoading,
  updateStreamingMessage,
  finishStreamingMessage,
  setStreamingMessageId
} from '@/store/slices/chatSlice';
import {PaperAirplaneIcon} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import userInfo from '@/setting/userInfo';

export default function MessageInput() {
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.chat);
  const {facts} = useSelector(state => state.facts);
  const [input, setInput] = useState('');
  const [selectedToken, setSelectedToken] = useState(userInfo.companies[0]?.token || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    dispatch(addMessage({text: userMessage, sender: 'user'}));

    // Set loading state
    dispatch(setLoading(true));

    try {
      // Call streaming API with token
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          facts: facts || [],
          token: selectedToken, // Include the selected token
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Create streaming bot message
      const streamingMessageId = Date.now().toString();
      dispatch(addMessage({
        id: streamingMessageId,
        text: '',
        sender: 'bot',
        isStreaming: true,
      }));
      dispatch(setStreamingMessageId(streamingMessageId));

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let citedFacts = [];

      if (reader) {
        try {
          while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.type === 'metadata') {
                    citedFacts = data.citedFacts || [];
                  } else if (data.type === 'content') {
                    dispatch(updateStreamingMessage({
                      id: streamingMessageId,
                      content: data.content
                    }));
                  } else if (data.type === 'done') {
                    dispatch(finishStreamingMessage({
                      id: streamingMessageId,
                      citedFacts: citedFacts
                    }));
                  } else if (data.type === 'error') {
                    throw new Error(data.error);
                  }
                } catch (parseError) {
                  // Ignore malformed JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }

    } catch (error) {
      console.error('Chat error:', error);

      // More specific error messages
      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      if (error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
        errorMessage = 'Authentication failed: Invalid token selected.';
      } else if (error.message.includes('Token is required')) {
        errorMessage = 'Authentication error: Token is required.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'Configuration error: Please check the API key setup.';
      } else if (error.message.includes('Rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }

      dispatch(addMessage({
        text: errorMessage,
        sender: 'bot',
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const factsCount = facts ? facts.length : 0;
  const selectedCompany = userInfo.companies.find(c => c.token === selectedToken);

  return (
    <div>
      {/* Company/Token Selector */}
      <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
        <label className="block text-xs font-medium mb-1">
          Test as Company:
        </label>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          {userInfo.companies.map((company) => (
            <option key={company.id} value={company.token}>
              {company.name}
            </option>
          ))}
        </select>
        {selectedCompany && (
          <div className="text-xs text-gray-500 mt-1">
            Token: {selectedCompany.token}
          </div>
        )}
      </div>

      {/* Show helpful hint when no facts exist */}
      {factsCount === 0 && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          💡 Add some facts above to get more specific answers!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            factsCount === 0
              ? "Ask me anything..."
              : "Ask me about your facts..."
          }
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-1"
        >
          <PaperAirplaneIcon className="w-4 h-4"/>
        </Button>
      </form>
    </div>
  );
}

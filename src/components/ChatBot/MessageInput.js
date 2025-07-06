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

export default function MessageInput() {
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.chat);
  const {facts} = useSelector(state => state.facts);
  const [input, setInput] = useState('');

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
      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          facts: facts || [],
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

      if (error.message.includes('API key')) {
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

  return (
    <div>
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

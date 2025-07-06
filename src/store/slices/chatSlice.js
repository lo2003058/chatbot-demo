import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isLoading: false,
    isOpen: false,
    streamingMessageId: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const message = {
        id: action.payload.id || Date.now().toString(),
        text: action.payload.text,
        sender: action.payload.sender, // 'user' or 'bot'
        timestamp: action.payload.timestamp || new Date().toISOString(),
        citedFacts: action.payload.citedFacts || [],
        isStreaming: action.payload.isStreaming || false,
      };
      state.messages.push(message);
    },
    updateStreamingMessage: (state, action) => {
      const {id, content} = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
      if (messageIndex !== -1) {
        state.messages[messageIndex].text += content;
      }
    },
    finishStreamingMessage: (state, action) => {
      const {id, citedFacts} = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
      if (messageIndex !== -1) {
        state.messages[messageIndex].isStreaming = false;
        if (citedFacts) {
          state.messages[messageIndex].citedFacts = citedFacts;
        }
      }
      state.streamingMessageId = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setStreamingMessageId: (state, action) => {
      state.streamingMessageId = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  updateStreamingMessage,
  finishStreamingMessage,
  setLoading,
  setStreamingMessageId,
  toggleChat,
  clearMessages
} = chatSlice.actions;
export default chatSlice.reducer;

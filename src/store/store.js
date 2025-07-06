import {configureStore} from '@reduxjs/toolkit';
import factsReducer from './slices/factsSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    facts: factsReducer,
    chat: chatReducer,
  },
});

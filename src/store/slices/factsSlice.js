import {createSlice} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';

const factsSlice = createSlice({
  name: 'facts',
  initialState: {
    facts: [],
    isEditing: false,
    editingId: null,
  },
  reducers: {
    addFact: (state, action) => {
      const newFact = {
        id: uuidv4(),
        title: action.payload.title,
        content: action.payload.content,
        createdAt: new Date().toISOString(),
      };
      state.facts.push(newFact);
    },
    updateFact: (state, action) => {
      const index = state.facts.findIndex(fact => fact.id === action.payload.id);
      if (index !== -1) {
        state.facts[index] = {...state.facts[index], ...action.payload};
      }
    },
    deleteFact: (state, action) => {
      state.facts = state.facts.filter(fact => fact.id !== action.payload);
    },
    setEditing: (state, action) => {
      state.isEditing = action.payload.isEditing;
      state.editingId = action.payload.id || null;
    },
    loadFacts: (state, action) => {
      state.facts = action.payload;
    },
  },
});

export const {addFact, updateFact, deleteFact, setEditing, loadFacts} = factsSlice.actions;
export default factsSlice.reducer;

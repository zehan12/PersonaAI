import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Persona, PersonalityTone } from "@/types/personas.types";

interface PersonaState {
  selectedPersonas: Persona[];
  personalityTone: PersonalityTone;
  searchQuery: string;
  selectedCategory: string;
  isPersonaSetupComplete: boolean;
}

const initialState: PersonaState = {
  selectedPersonas: [],
  personalityTone: "default",
  searchQuery: "",
  selectedCategory: "all",
  isPersonaSetupComplete: false,
};

const personaSlice = createSlice({
  name: "persona",
  initialState,
  reducers: {
    setSelectedPersonas: (state, action: PayloadAction<Persona[]>) => {
      state.selectedPersonas = action.payload;
    },
    addPersona: (state, action: PayloadAction<Persona>) => {
      const exists = state.selectedPersonas.find(
        (p) => p.id === action.payload.id
      );
      if (!exists) {
        state.selectedPersonas.push(action.payload);
      }
    },
    removePersona: (state, action: PayloadAction<string>) => {
      state.selectedPersonas = state.selectedPersonas.filter(
        (p) => p.id !== action.payload
      );
    },
    setPersonalityTone: (state, action: PayloadAction<PersonalityTone>) => {
      state.personalityTone = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setPersonaSetupComplete: (state, action: PayloadAction<boolean>) => {
      state.isPersonaSetupComplete = action.payload;
    },
    resetPersonaState: (state) => {
      state.selectedPersonas = [];
      state.personalityTone = "default";
      state.isPersonaSetupComplete = false;
    },
  },
});

export const {
  setSelectedPersonas,
  addPersona,
  removePersona,
  setPersonalityTone,
  setSearchQuery,
  setSelectedCategory,
  setPersonaSetupComplete,
  resetPersonaState,
} = personaSlice.actions;

export default personaSlice.reducer;

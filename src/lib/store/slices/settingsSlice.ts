import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  apiKey: string;
  isApiKeySet: boolean;
  temperature: number;
  maxTokens: number;
}

const initialState: SettingsState = {
  apiKey: "",
  isApiKeySet: false,
  temperature: 0.7,
  maxTokens: 200,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      state.isApiKeySet = !!action.payload;
    },
    clearApiKey: (state) => {
      state.apiKey = "";
      state.isApiKeySet = false;
    },
    setTemperature: (state, action: PayloadAction<number>) => {
      state.temperature = action.payload;
    },
    setMaxTokens: (state, action: PayloadAction<number>) => {
      state.maxTokens = action.payload;
    },
  },
});

export const { setApiKey, clearApiKey, setTemperature, setMaxTokens } =
  settingsSlice.actions;

export default settingsSlice.reducer;

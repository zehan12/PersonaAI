import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import personaReducer from "./slices/personaSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  chat: chatReducer,
  persona: personaReducer,
  settings: settingsReducer,
});

// Custom localStorage middleware
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // Save to localStorage after each action
  if (typeof window !== "undefined") {
    try {
      const state = store.getState();
      localStorage.setItem("ffp-chat-state", JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save state to localStorage:", error);
    }
  }

  return result;
};

// Load initial state from localStorage
const loadStateFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem("ffp-chat-state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error);
    return undefined;
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadStateFromLocalStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.timestamp"],
        ignoredStatePaths: ["chat.messages.timestamp"],
      },
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

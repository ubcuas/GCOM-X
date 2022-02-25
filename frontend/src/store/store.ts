import { createStore } from "redux";
import rootReducer from "./reducers";
import { THEMES } from "../utils/constants/THEMES";

const localStorageKey = "user_preferences";
const persistedTheme = localStorage.getItem(localStorageKey);

const initialState: any = {
    preferences: {
        selectedTheme: Object.keys(THEMES)[0] ?? "bumblebee"
    }
}

if (persistedTheme) {
    initialState.preferences = JSON.parse(persistedTheme)
} else {
    localStorage.setItem(localStorageKey, JSON.stringify(initialState.preferences));
}

const store = createStore(rootReducer, initialState);

store.subscribe(() => {
    const preferences = store.getState().preferences;
    if (!preferences) return;
    localStorage.setItem(localStorageKey, JSON.stringify(preferences));
});

export default store;
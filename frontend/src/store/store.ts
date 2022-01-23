import { createStore } from "redux";
import rootReducer from "./reducers";
import { THEMES } from "../utils/constants/THEMES";

const localStorageKey = "theme";
const persistedTheme = localStorage.getItem(localStorageKey);

const initialState: any = {
    preferences: {
        selectedTheme: Object.keys(THEMES)[0]
    },
    logs: []
}

if (persistedTheme) {
    initialState.preferences = JSON.parse(persistedTheme)
}

const store = createStore(rootReducer, initialState);

store.subscribe(() => {
    const preferences = store.getState().preferences;
    if (!preferences) return;
    localStorage.setItem(localStorageKey, JSON.stringify(preferences));
});

export default store;
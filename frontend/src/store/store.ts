import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';
import rootReducer from "./reducers/reducers";

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

/* eslint-disable no-underscore-dangle */
// const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const middlewares = [thunk];

if (true || process.env.NODE_ENV === `development`) {
    // TODO: add development to node_ENV
    // middlewares.push(logger);
}

const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer);
/* eslint-enable */

// const store = createStore(rootReducer, initialState);

store.subscribe(() => {
    const preferences = store.getState().preferences;
    if (!preferences) return;
    localStorage.setItem(localStorageKey, JSON.stringify(preferences));
});

export default store;
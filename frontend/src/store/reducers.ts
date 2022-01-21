import * as actions from "./actions";
import { combineReducers } from "redux";
import { THEMES } from "../utils/constants/THEMES";

const preferences = (state = { selectedTheme: Object.keys(THEMES)[0] }, action: any) => {
    switch (action.type) {
        case actions.SELECT_THEME:
            return { ...state, selectedTheme: action.selectedTheme };
        default:
            return state;
    }
};

const logger = (state = { logs: [] }, action: any) => {
    switch (action.type) {
        case actions.ADD_LOG:
            return { ...state, logs: [...state.logs, { ...action.log, time: new Date().toLocaleTimeString() }] };
        default:
            return state;
    }
};

export const rootReducer = combineReducers({ preferences, logger });
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
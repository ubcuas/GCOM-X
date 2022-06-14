import * as actions from "../actions";
import { combineReducers } from 'redux';
import AirCraftReducer from './reducer-aircraft';
import TeamsReducer from './reducer-teams';
import WinchStatusReducer from './reducer-winchstatus'
import MapPropReducer from './reducer-mapprops';
import MarkersReducer from './reducer-markers';
import ObstaclesReducer from './reducer-obstacles';
import MissionsReducer from './reducer-missions';
import CurMissionReducer from './reducer-currentmission';
import NewWaypointAltReducer from './reducer-newwp';
import FlyzoneReducer from './reducer-flyzone';
import { THEMES } from "../../utils/constants/THEMES";

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

export const rootReducer = combineReducers({
    preferences,
    logger,
    aircraft: AirCraftReducer,
    teams: TeamsReducer,
    winch: WinchStatusReducer,
    mapProps: MapPropReducer,
    markers: MarkersReducer,
    obstacles: ObstaclesReducer,
    missions: MissionsReducer,
    curMission: CurMissionReducer,
    newAlt: NewWaypointAltReducer,
    flyzone: FlyzoneReducer
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
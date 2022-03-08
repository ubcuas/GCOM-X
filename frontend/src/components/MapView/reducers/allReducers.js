import { combineReducers } from 'redux';
import AirCraftReducer from './reducer-aircraft';
import MapPropReducer from './reducer-mapprops';
import MarkersReducer from './reducer-markers';
import ObstaclesReducer from './reducer-obstacles';
import MissionsReducer from './reducer-missions';
import CurMissionReducer from './reducer-currentmission';
import NewWaypointAltReducer from './reducer-newwp';
import FlyzoneReducer from './reducer-flyzone';

const allReducers = combineReducers({
    aircraft: AirCraftReducer,
    mapProps: MapPropReducer,
    markers: MarkersReducer,
    obstacles: ObstaclesReducer,
    missions: MissionsReducer,
    curMission: CurMissionReducer,
    newAlt: NewWaypointAltReducer,
    flyzone: FlyzoneReducer
});

export default allReducers;

const defaultValue = [{
    "team_id": 2,
    "latitude": 38.147192,
    "longitude": -76.428595,
    "uas_heading": 50,
    "altitude_msl": 23,
}, {
    "team_id": 3,
    "latitude": 38.145595,
    "longitude": -76.434636,
    "uas_heading": 130,
    "altitude_msl": 23,
}];

export default function (flag = defaultValue, action) {
    switch (action.type) {
        case 'GET_TEAM_TELEM':
            return action.payload;
        default:
            return flag;
    }
}

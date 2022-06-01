import axios from "axios";

// const defaultValue = [{
//     "team_id": 2,
//     "latitude": 38.147192,
//     "longitude": -76.428595,
//     "uas_heading": 50,
//     "altitude_msl": 23,
// }, {
//     "team_id": 3,
//     "latitude": 38.145595,
//     "longitude": -76.434636,
//     "uas_heading": 130,
//     "altitude_msl": 23,
// }];

const defaultValue = {
    "teams": 
        [
            {"team_id": 2,
            "latitude": 38.147192,
            "longitude": -76.428595,
            "uas_heading": 50,
            "altitude_msl": 23},
            {"team_id": 3,
            "latitude": 38.145595,
            "longitude": -76.434636,
            "uas_heading": 130,
            "altitude_msl": 23}
        ]
    };

const GET_TEAM_TELEMETRY_API = "http://localhost:8080/api/interop/teams"

export const getTeamTelem = () => {
    return function (dispatch) {
        axios.get(GET_TEAM_TELEMETRY_API)
            .then(response => {
                if (response.data) {
                    dispatch({
                        type: 'GET_TEAM_TELEM',
                        payload: response.data['teams']
                    });
                } else {
                    dispatch({
                        type: 'GET_TEAM_TELEM',
                        payload: defaultValue['teams']
                    });
                }
            })
            .catch(() => {
                dispatch({
                    type: 'GET_TEAM_TELEM',
                    payload: defaultValue['teams']
                });
            })
    }
};

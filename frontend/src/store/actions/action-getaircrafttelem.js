import axios from "axios";

const defaultValue = {
    "team_id": 1,
    "latitude": 38.15103255191606,
    "longitude": -76.4377644832984,
    "uas_heading": 90,
    "altitude_msl": 23,
};

const GET_TELEMETRY_API = "http://localhost:8080/api/interop/telemetry"

export const getAircraftTelem = () => {
    return function (dispatch) {
        axios.get(GET_TELEMETRY_API)
            .then(response => {
                if (response.data) {
                    dispatch({
                        type: 'GET_TELEM',
                        payload: response.data
                    });
                } else {
                    dispatch({
                        type: 'GET_TELEM',
                        payload: defaultValue
                    });
                }
            })
            .catch(() => {
                dispatch({
                    type: 'GET_TELEM',
                    payload: defaultValue
                });
            })
    }
};

import axios from "axios";

const GET_MISSIONS_ENDPOINT = "http://localhost:8080/avoidance/api/missions/"
const EMPTY = { missions: [] };

export const loadMissions = () => {
    return function (dispatch) {
        axios.get(GET_MISSIONS_ENDPOINT)
            .then(response => {
                dispatch({
                    type: 'UPDATE_MISSIONS',
                    payload: response.data
                });
            })
            .catch(() => {
                dispatch({
                    type: 'UPDATE_MISSIONS',
                    payload: EMPTY
                });
            })
    }
};

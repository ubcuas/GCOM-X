import axios from "axios"

// See ACOM's vehicle.py for the latest definitions
export const winchStatus = {
    0: "Disconnected",
    1: "Standby",
    2: "In Progress",
    3: "Failed, Retrying",
    4: "Complete",
    5: "Emergency Reel"
};

const defaultValue = {
    "winch_status": 0
};

const GET_WINCH_STATUS_API = "http://localhost:8080/avoidance/api/winchstatus"

export const getWinchStatus = () => {
    return function (dispatch) {
        axios.get(GET_WINCH_STATUS_API)
            .then(response => {
                if (response.data) {
                    dispatch({
                        type: 'GET_WINCH_STATUS',
                        payload: response.data
                    });
                } else {
                    dispatch({
                        type: 'GET_WINCH_STATUS',
                        payload: defaultValue
                    });
                }
            })
            .catch(() => {
                dispatch({
                    type: 'GET_WINCH_STATUS',
                    payload: defaultValue
                });
            })
    }
};
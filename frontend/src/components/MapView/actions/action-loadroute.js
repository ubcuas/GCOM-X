import axios from "axios";

const GET_ROUTES_ENDPOINT = "/avoidance/api/route/";

export const loadRoutes = (id) => {
    return function (dispatch) {
        axios.get(GET_ROUTES_ENDPOINT + id)
            .then(response => {
                dispatch({
                    type: 'LOAD_MARKERS',
                    payload: response.data.waypoints
                });
                dispatch({
                    type: 'LOAD_OBSTACLES',
                    payload: response.data.obstacles
                });
                dispatch({
                    type: 'LOAD_FLYZONE',
                    payload: response.data.flyzone
                });
            })
            .catch((e) => {
                console.log('Failed to load routes, ' + e);
            })
    }
};

import axios from "axios";

const GET_ROUTES_ENDPOINT = "http://localhost:8080/avoidance/api/route/";
const GET_CURRENT_ROUTE_ENDPOINT = "http://localhost:8080/avoidance/api/current_route";

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

export const loadCurrentRoute = (mission) => {
    return function (dispatch) {
        axios.get(GET_CURRENT_ROUTE_ENDPOINT)
            .then(response => {
                dispatch({
                    type: 'LOAD_MARKERS',
                    payload: response.data.waypoints.map((wp, index) => {
                        return {
                            "order": index + 1,
                            "latitude": wp.lat,
                            "longitude": wp.lng,
                            "altitude": wp.alt,
                            "is_generated": false,
                            "wp_type": "auto_flight",
                            "delay": 0
                        }
                    })
                });
                // dispatch({
                //     type: 'LOAD_OBSTACLES',
                //     payload: response.data.obstacles
                // });
                // dispatch({
                //     type: 'LOAD_FLYZONE',
                //     payload: response.data.flyzone
                // });
            })
            .catch((e) => {
                console.log('Failed to load current route, ' + e);
            })
    }
}

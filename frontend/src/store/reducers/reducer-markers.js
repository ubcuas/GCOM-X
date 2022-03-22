const defaultMarkers = [
    {
        "order":1,
        "latitude":38.142544,
        "longitude":-76.434088,
        "altitude":60.96,
        "is_generated":false,
        "wp_type":"auto_flight"
    },
    {
        "order":2,
        "latitude":38.1423100837495,
        "longitude":-76.4311846091267,
        "altitude":35.0,
        "is_generated":true,
        "wp_type":"search_grid"
    },
    {
        "order":3,
        "latitude":38.14836,
        "longitude":-76.42798,
        "altitude":75.0,
        "is_generated":false,
        "wp_type":"auto_flight"
    }
];

const defaultMarkerState = {
    markers: defaultMarkers,
    selectedMarker: null
}

function recalculateOrder(markers) {
    return markers.map((marker, index) => {
        return {
            ...marker,
            order: index + 1
        }
    })
}

export default function (state = defaultMarkerState, action) {
    switch (action.type) {
        case 'ADD_MARKER': {
            // add a marker after the currently selected marker. if it is null, add to the end.
            
            // index to insert
            let index = state.selectedMarker ? state.selectedMarker : state.markers.length;

            // immutable array insertion
            let newMarkers = [
                ...state.markers.slice(0, index), // all elements before index
                action.payload, // insert the new marker at the index
                ...state.markers.slice(index) // all elements after index
            ];

            // recalculate order
            newMarkers = recalculateOrder(newMarkers);

            return {
                selectedMarker: index + 1, // update selected marker to the newly added marker
                markers: newMarkers
            };
        }
        case 'UPDATE_MARKER': {
            let {
                targetMarkerId,
                newlat,
                newlng,
                newalt
            } = action.payload;
            
            let newMarkers = state.markers.map((marker) => {
                if (marker.order === targetMarkerId) {
                  return {
                      ...marker,
                      latitude: newlat,
                      longitude: newlng,
                      altitude: newalt
                  }
                } else {
                    return marker;
                }
            });

            return {
                ...state,
                markers: newMarkers
            }
        }
        case 'DELETE_MARKER': {
            // immutable array deletion
            let newMarkers = state.markers.filter((item, index) => item.order !== action.payload);

            // recalculate order
            newMarkers = recalculateOrder(newMarkers);

            return {
                selectedMarker: Math.max(1, state.selectedMarker-1), // update selected marker to the marker before the one that was deleted
                markers: newMarkers
            };
        }
        case 'LOAD_MARKERS':
            return {
                ...state,
                markers: action.payload
            };
        case 'SELECT_MARKER':
            return {
                ...state,
                selectedMarker: action.payload
            };
        default:
            return state;
    }
}

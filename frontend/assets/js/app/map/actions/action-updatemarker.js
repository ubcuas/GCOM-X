export const updateMarker = (targetMarkerId, newlat, newlng) => {
    // update marker
    //
    return {
        type: 'UPDATE_MARKER',
        payload: {
            targetMarkerId,
            newlat,
            newlng
        },
    };
};

export const updateMarker = (targetMarkerId, newlat, newlng, newalt) => {
    // update marker
    //
    return {
        type: 'UPDATE_MARKER',
        payload: {
            targetMarkerId,
            newlat,
            newlng,
            newalt
        },
    };
};

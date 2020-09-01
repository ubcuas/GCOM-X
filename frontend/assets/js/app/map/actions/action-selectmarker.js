export const selectMarker = (targetMarkerId) => {

    return {
        type: 'SELECT_MARKER',
        payload: targetMarkerId,
    };
};

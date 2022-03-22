export const deleteMarker = (targetMarkerId) => {

    return {
        type: 'DELETE_MARKER',
        payload: targetMarkerId,
    };
};

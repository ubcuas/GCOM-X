export const updateMarker = (props, targetMarkerId, newlat, newlng) =>
{
    const newMarkers = props.markers.map((marker) => {
        return (marker.order === targetMarkerId) ?
        {
            order: marker.order,
            latitude: newlat,
            longitude: newlng,
            altitude: marker.altitude,
            is_generated: marker.is_generated,
            wp_type: marker.wp_type,
        } : marker;
    });
    // update marker
    return {
        type: 'UPDATE_MARKER',
        payload: newMarkers,
    };
};

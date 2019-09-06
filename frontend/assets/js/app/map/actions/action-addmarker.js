export const addMarker = (e, props, nextMarkerId, alt) =>
{
    console.log(e.latlng.lat,e.latlng.lng);
    // add marker
    return {
        type: 'ADD_MARKER',
        payload: [...props.markers, { order: nextMarkerId, latitude: e.latlng.lat, longitude: e.latlng.lng, altitude: alt, is_generated: true , wp_type: 'none'}],
    };
};

export const addMarker = (lat, lng, alt) =>
{
    console.log(lat, lng);
    // add marker
    return {
        type: 'ADD_MARKER',
        payload: {
            latitude: lat,
            longitude: lng,
            altitude: alt,
            is_generated: true,
            wp_type: 'none'
        }
    };
};

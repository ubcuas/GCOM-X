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

export default function (markers = defaultMarkers, action)
{
    switch (action.type)
    {
        case 'ADD_MARKER':
            return action.payload;
        case 'UPDATE_MARKER':
            return action.payload;
        case 'LOAD_MARKERS':
            return action.payload;
        default:
            return markers;
    }
}

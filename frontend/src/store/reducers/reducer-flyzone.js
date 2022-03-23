const defaultFlyzone = {
    "min": 0,
    "max": 228.6,
    "points": [
      {
        "order": 1,
        "latitude": 38.15412827054356,
        "longitude": -76.42982426748127,
        "altitude": null,
        "is_generated": false,
        "wp_type": "flyzone"
      },
      {
        "order": 2,
        "latitude": 38.13893032305061,
        "longitude": -76.44252733784535,
        "altitude": null,
        "is_generated": false,
        "wp_type": "flyzone"
      },
      {
        "order": 3,
        "latitude": 38.13771435047266,
        "longitude": -76.41591955532596,
        "altitude": null,
        "is_generated": false,
        "wp_type": "flyzone"
      }
    ]
  };

export default function (flyzone = defaultFlyzone, action)
{
    switch (action.type)
    {
        case 'LOAD_FLYZONE':
            return action.payload;
        default:
            return flyzone;
    }
}

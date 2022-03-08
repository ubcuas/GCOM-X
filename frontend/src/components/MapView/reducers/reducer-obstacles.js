const defaultObstacles = [
   [
      {
         "order": 1,
         "latitude": 38.148546732881066,
         "longitude": -76.4326142579021,
         "altitude": 35.0,
         "is_generated": true,
         "wp_type": "obstacle"
      },
      {
         "order": 2,
         "latitude": 38.14702941370004,
         "longitude": -76.43381589969329,
         "altitude": 75.0,
         "is_generated": false,
         "wp_type": "obstacle"
      },
      {
         "order": 3,
         "latitude": 38.14699569513757,
         "longitude": -76.43143407400004,
         "altitude": 75.0,
         "is_generated": false,
         "wp_type": "obstacle"
      },
      {
         "order": 4,
         "latitude": 38.14849615608351,
         "longitude": -76.43094054255006,
         "altitude": 75.0,
         "is_generated": false,
         "wp_type": "obstacle"
      }
   ],
   [
      {
         "order": 1,
         "latitude": 38.151448114086996,
         "longitude": -76.42867330961295,
         "altitude": 35.0,
         "is_generated": true,
         "wp_type": "obstacle"
      },
      {
         "order": 2,
         "latitude": 38.15060465941251,
         "longitude": -76.42956340990511,
         "altitude": 75.0,
         "is_generated": false,
         "wp_type": "obstacle"
      },
      {
         "order": 3,
         "latitude": 38.15047814037012,
         "longitude": -76.42789045031984,
         "altitude": 75.0,
         "is_generated": false,
         "wp_type": "obstacle"
      },
      {
         "order": 4,
         "latitude": 38.15115290606041,
         "longitude": -76.42672152343013,
         "altitude": 75.0,
         "is_generated": false,
         "wp_type": "obstacle"
      }
   ]
];

export default function (obstacles = defaultObstacles, action) {
   switch (action.type) {
      case 'LOAD_OBSTACLES':
         return action.payload;
      default:
         return obstacles;
   }
}

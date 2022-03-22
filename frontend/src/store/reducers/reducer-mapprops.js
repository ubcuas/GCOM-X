const defaultMapProps = {
    "latitude": 38.142544,
    "longitude": -76.434088,
    "zoom": 16,
};

export default function (mapProps = defaultMapProps, action)
{
    switch (action.type)
    {
        case 'UPDATE_MAPPROPS':
            return action.payload;
        default:
            return mapProps;
    }
}

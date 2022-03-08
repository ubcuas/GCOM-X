const defaultAltitude = 30;

export default function (altitude = defaultAltitude, action)
{
    switch (action.type)
    {
        case 'CHANGE_ALT':
            return action.payload;
        default:
            return altitude;
    }
}
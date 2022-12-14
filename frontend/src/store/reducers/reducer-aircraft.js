const defaultValue = {
    "team_id": 0,
    "latitude": 38.14103255191606,
    "longitude": -76.4277644832984,
    "uas_heading": 90,
    "altitude_msl": 23,
    "groundspeed_m_s": 10,
    "chan3_raw": 975,
};

export default function (flag = defaultValue, action) {
    switch (action.type) {
        case 'GET_TELEM':
            return action.payload;
        default:
            return flag;
    }
}

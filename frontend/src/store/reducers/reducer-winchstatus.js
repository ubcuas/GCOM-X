const defaultValue = {
    "winch_status": 0
};

export default function (flag = defaultValue, action) {
    switch (action.type) {
        case 'GET_WINCH_STATUS':
            return action.payload;
        default:
            return flag;
    }
}

const defaultMission = 0;

export default function (currentMission = defaultMission, action)
{
    switch (action.type)
    {
        case 'UPDATE_CURMISSION':
            return action.payload;
        default:
            return currentMission;
    }
}
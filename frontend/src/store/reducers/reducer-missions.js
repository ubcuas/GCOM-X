const defaultMissions = { missions: [] };

export default function (missions = defaultMissions, action)
{
    switch (action.type)
    {
        case 'UPDATE_MISSIONS':
            return action.payload;
        default:
            return missions;
    }
}
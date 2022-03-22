export const updateCurMission = (missionId) =>
{
    return {
        type: 'UPDATE_CURMISSION',
        payload: missionId
    }
}
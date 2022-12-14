enum MissionItem {
    HOME_POS = "homePos",
    RTL = "rtl",
    TAKEOFF_ALTITUDE = "takeoffAlt",
    WAYPOINTS = "wps"
}

type GPSCoordinate = {
    alt: number,
    lat: number,
    lng: number
}

type Mission = {
    [MissionItem.HOME_POS]: GPSCoordinate,
    [MissionItem.RTL]: boolean,
    [MissionItem.TAKEOFF_ALTITUDE]: number,
    [MissionItem.WAYPOINTS]: Array<GPSCoordinate>
}

const DEFAULT_MISSION: Mission = {
    homePos: {
        alt: 0,
        lat: 0,
        lng: 0
    },
    rtl: false,
    takeoffAlt: 0,
    wps: [{
        alt: 0,
        lat: 0,
        lng: 0
    }]
}

interface MissionInterface {
    mission: Mission
}

class UASMission implements MissionInterface {
    mission = DEFAULT_MISSION

    constructor(initMission: Mission = DEFAULT_MISSION) {
        this.mission = initMission
    }

    //TODO: add mission modification methods in here
}


export { MissionItem, UASMission };
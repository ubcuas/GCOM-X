

// https://mavlink.io/en/messages/common.html#MAV_AUTOPILOT
export enum MAV_AUTOPILOT {
    GENERIC = 0,
    RESERVED = 1,
    SLUGS = 2,
    ARDUPILOTMEGA = 3,
    OPENPILOT = 4,
    GENERIC_WAYPOINTS_ONLY = 5,
    GENERIC_WAYPOINTS_AND_SIMPLE_NAVIGATION_ONLY = 6,
    GENERIC_MISSION_FULL = 7,
    INVALID = 8,
    PPZ = 9,
    UDB = 10,
    FP = 11,
    PX4 = 12,
    SMACCMPILOT = 13,
    AUTOQUAD = 14,
    ARMAZILA = 15,
    AEROB = 16,
    ASLUAV = 17,
    SMARTAP = 18,
    AIRRAILS = 19,
    REFLEX = 20,
}

// https://mavlink.io/en/messages/common.html#MAV_TYPE
export enum MAV_TYPE {
    GENERIC = 0,
    FIXED_WING = 1,
    QUADROTOR = 2,
    COAXIAL = 3,
    HELICOPTER = 4,
    ANTTENNA_TRACKER = 5,
    GCS = 6,
    AIRSHIP = 7,
    FREE_BALLOON = 8,
    ROCKET = 9,
    GROUND_ROVER = 10,
    SURFACE_BOAT = 11,
    SUBMARINE = 12,
    HEXAROTOR = 13,
    OCTOROTOR = 14,
    TRICOPTER = 15,
    FLAPPING_WING = 16,
    KITE = 17,
    ONBOARD_CONTROLLER = 18,
    VTOL_TAILSITTER_DUOROTOR = 19,
    VTOL_TAILSITTER_QUADROTOR = 20,
    VTOL_TILTROTOR = 21,
    VTOL_FIXEDROTOR = 22,
    VTOL_TAILSITTER = 23,
    VTOL_RESERVED4 = 24,
    VTOL_RESERVED5 = 25,
    GIMBAL = 26,
    ADSB = 27,
    PARAFOIL = 28,
    DODECAROTOR = 29,
    CAMERA = 30,
    CHARGING_STATION = 31,
    FLARM = 32,
    SERVO = 33,
    ODID = 34,
    DECAROTOR = 35,
    BATTERY = 36,
    PARACHUTE = 37,
    LOG = 38,
    OSD = 39,
    IMU = 40,
    GPS = 41,
    WINCH = 42,
}

// https://mavlink.io/en/messages/common.html#MAV_STATE
export enum MAV_STATE {
    UNINIT = 0,
    BOOT = 1,
    CALIBRATING = 2,
    STANDBY = 3,
    ACTIVE = 4,
    CRITICAL = 5,
    EMERGENCY = 6,
    POWEROFF = 7,
    FLIGHT_TERMINATION = 8,
}

// https://mavlink.io/en/messages/common.html#MAV_MODE_FLAG
export enum MAV_MODE_FLAG {
    CUSTOM_MODE_ENABLED = 1,
    TEST_ENABLED = 2,
    AUTO_ENABLED = 4,
    GUIDED_ENABLED = 8,
    STABILIZE_ENABLED = 16,
    HIL_ENABLED = 32,
    MANUAL_INPUT_ENABLED = 64,
    SAFETY_ARMED = 128,
}

// https://mavlink.io/en/messages/common.html#HEARTBEAT
export interface MavLinkHeartbeat {
    type: MAV_TYPE;
    autopilot: MAV_AUTOPILOT;
    base_mode: number;
    custom_mode: number;
    system_status: MAV_STATE;
    mavlink_version: number;
}

export const DefaultMavLinkHeartbeat: MavLinkHeartbeat = {
    type: MAV_TYPE.GENERIC,
    autopilot: MAV_AUTOPILOT.GENERIC,
    base_mode: 0,
    custom_mode: 0,
    system_status: MAV_STATE.UNINIT,
    mavlink_version: 3,
}
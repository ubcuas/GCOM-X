import { TelemetryHolder } from './telemetry.interface';
import { MissionItem, UASMission } from './mission.interface';

class UASAircraft {
    mission = new UASMission();
    telemetry = null;

    constructor() {
        // this.mission = null;
        // this.mission.getWaypoints()
    }

    setMission() {

    }

    getMission() {

    }

    updateTelemetry() {

    }
}

export { UASAircraft };
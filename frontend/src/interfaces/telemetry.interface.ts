/*

This file contains the definitions of interfaces used by logging-related components
See [Confluence page] for more details: https://placeholder.com

*/

export enum UASTelemetryKey {
    GPS_POSITION = "gps_position",
    SPEED = "speed",
    ALTITUDE_MSL = "altitude_msl",
    RUNTIME = "runtime",
    VIBRATION = "vibration",
    BATTERY_CAPACITY = "battery_capacity",
    BATTERY_VOLTAGE = "battery_voltage",
    HEADING = "heading",
    TEMPERATURE = "temperature",
    STORAGE = "storage",
    NETWORK_SPEED = "network_speed",
    GENERIC = "generic"
}

export interface UASTelemetryInterface {
    telemetryKey: UASTelemetryKey,
    unit: string,
    value: string,
    timestamp: Date
}

export class UASTelemetry implements UASTelemetryInterface {
    telemetryKey: UASTelemetryKey = UASTelemetryKey.GENERIC;
    unit: string = "";
    value: string = "";
    timestamp: Date = new Date();

    constructor(telemetryKey: UASTelemetryKey, value: string, unit = "") {
        this.telemetryKey = telemetryKey;
        this.unit = unit;
        this.value = value;
    }
}
/*

This file contains the definitions of interfaces used by logging-related components
See [Confluence page] for more details: https://placeholder.com

*/

export enum UniversalLogOrigin {
    GCOM = "GCOM",
    ACOM = "ACOM",
    KRAKEN = "KRKN",
    STALKER = "STLK",
    SKYPASTA = "SPST",
    SUNFLOWER = "SUNF",
    ACTIVE_AIRCRAFT_AVOIDANCE = "AAA",
    VULCAN = "VULC",
    UNKNOWN = "UNKN"
}

export enum UniversalLogType {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    SUCCESS = "success",
    UNKNOWN = "unknown"
}

/**
 * System logs fetched from Kraken
 * @typedef  {Object} UniversalLog
 * @property {UniversalLogOrigin} origin
 * @property {UniversalLogType} type
 * @property {string} content
 * @property {Date} timestamp
 */

export interface UniversalLog {
    origin: UniversalLogOrigin,
    type: UniversalLogType,
    content: string,
    timestamp: Date
}

export class UASUniversalLog implements UniversalLog {
    origin: UniversalLogOrigin = UniversalLogOrigin.UNKNOWN;
    type: UniversalLogType = UniversalLogType.UNKNOWN;
    content: string = "";
    timestamp: Date = new Date();

    constructor(origin: UniversalLogOrigin, type: UniversalLogType, content: string) {
        this.origin = origin;
        this.type = type;
        this.content = content;
    }
}
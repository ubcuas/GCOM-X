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
    VULCAN = "VULC"
}

export enum UniversalLogType {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    SUCCESS = "success"
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
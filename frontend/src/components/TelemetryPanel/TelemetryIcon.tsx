import * as React from "react";

//Icons representing telemetry
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import VibrationIcon from '@mui/icons-material/Vibration';
import SpeedIcon from '@mui/icons-material/Speed';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Battery90Icon from '@mui/icons-material/Battery90';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import TimerIcon from '@mui/icons-material/Timer';
import ExploreIcon from '@mui/icons-material/Explore';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import HeightIcon from '@mui/icons-material/Height';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';

//default for telemetry with missing icon in the map
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

import { UASTelemetryKey } from '../../interfaces/telemetry.interface';

//TODO: do better...
const TKIconMap: any = {}

TKIconMap[UASTelemetryKey.GPS_POSITION] = <GpsFixedIcon />;
TKIconMap[UASTelemetryKey.SPEED] = <SpeedIcon />;
TKIconMap[UASTelemetryKey.ALTITUDE_MSL] = <HeightIcon />;
TKIconMap[UASTelemetryKey.RUNTIME] = <TimerIcon />;
TKIconMap[UASTelemetryKey.VIBRATION] = <VibrationIcon />;
TKIconMap[UASTelemetryKey.BATTERY_CAPACITY] = <Battery90Icon />;
TKIconMap[UASTelemetryKey.HEADING] = <ExploreIcon />;
TKIconMap[UASTelemetryKey.BATTERY_VOLTAGE] = <BatteryChargingFullIcon />;
TKIconMap[UASTelemetryKey.TEMPERATURE] = <DeviceThermostatIcon />;
TKIconMap[UASTelemetryKey.STORAGE] = <SdStorageIcon />;
TKIconMap[UASTelemetryKey.NETWORK_SPEED] = <NetworkCheckIcon />;
TKIconMap[UASTelemetryKey.TEAM_ID] = <GroupsIcon />;
TKIconMap[UASTelemetryKey.GENERIC] = <HelpCenterIcon />;
TKIconMap[UASTelemetryKey.CHANNEL] = <SettingsInputAntennaIcon />;


export const TelemetryIcon = ({ telemetryKey = UASTelemetryKey.GENERIC }) => {
    try {
        let telemetryIcon = TKIconMap[telemetryKey]
        return telemetryIcon ? telemetryIcon : <HelpCenterIcon />
    } catch (err) {
        //TODO: use the universal logging thing for this
    }
}

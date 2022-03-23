import * as React from "react";
import MapView from "../../components/MapView";
import LogsPanel from "../../components/LogsPanel";
import TelemetryPanel from "../../components/TelemetryPanel";

const MapPage = () => {
    return <>
        <>
            <LogsPanel />
            <MapView visibility={true} />
        </>
        <TelemetryPanel />
    </>
}

export default MapPage
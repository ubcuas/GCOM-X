import * as React from "react";
import MapView from "../../components/MapView";
import LogsPanel from "../../components/LogsPanel";
import TelemetryPanel from "../../components/TelemetryPanel";
import MissionPanel from "../../components/MissionPanel";
import { Grid, Box, Paper } from "@mui/material";

const MapPage = () => {
    return <>
        <>
            <LogsPanel />
            <MapView visibility={true} />
        </>
        <Box sx={{ flexGrow: 1 }} style={{ padding: 0, position: "fixed", width: "100%", bottom: 0, left: 0, zIndex: 1000 }}>
            <Paper style={{ textAlign: "center", padding: 10 }}>
                <Grid container spacing={1} alignItems="center" justifyContent="center">
                    <TelemetryPanel />
                    <MissionPanel />
                </Grid>
            </Paper>
        </Box>

    </>
}

export default MapPage
import { Container, Grid, Paper, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';

import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import UploadIcon from "@mui/icons-material/Upload"
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { TelemetryIcon } from "./TelemetryIcon";

import { useState } from "react";
import Settings from "@mui/icons-material/Settings";
import { UASTelemetry, UASTelemetryKey } from "../../interfaces/telemetry.interface";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


//TODO: fetch these from somewhere
let TelemetryData: UASTelemetry[] = [
    new UASTelemetry(UASTelemetryKey.GPS_POSITION, "43.231342343, -123.34234324"),
    new UASTelemetry(UASTelemetryKey.ALTITUDE_MSL, "153", "m"),
    new UASTelemetry(UASTelemetryKey.RUNTIME, "00:03:15"),
    new UASTelemetry(UASTelemetryKey.VIBRATION, "1.35", "g"),
    new UASTelemetry(UASTelemetryKey.BATTERY_CAPACITY, "87.93", "%"),
    new UASTelemetry(UASTelemetryKey.HEADING, "153.5", "°"),
    new UASTelemetry(UASTelemetryKey.TEMPERATURE, "11.7", "°C"),
    new UASTelemetry(UASTelemetryKey.SPEED, "30.4", "m/s"),
    new UASTelemetry(UASTelemetryKey.STORAGE, "45.6", "%"),
    new UASTelemetry(UASTelemetryKey.NETWORK_SPEED, "153.5", "Mbps"),
    new UASTelemetry(UASTelemetryKey.BATTERY_VOLTAGE, "24.9", "V")
]

function calculateTelemContainerWidth(t: UASTelemetry): number {
    let l = t.value.length + t.unit.length;
    return (l > 40) ? 6 : (l > 20) ? 4 : (l > 12) ? 3 : 2;
}

const Telemetry = () => {
    const [allMisions, setAllMissions] = useState(["USC Task 2", "AUVSI Task 1", "AUVSI Task 2"]);
    const [mission, setMission] = useState(allMisions[0])

    return <Box sx={{ flexGrow: 1 }} style={{ padding: 0, position: "fixed", width: "100%", bottom: 0, left: 0, zIndex: 1000 }}>
        <Paper style={{ textAlign: "center", padding: 10 }}>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <Typography fontSize={20} fontWeight={700}>System Telemetry</Typography>
                    </Grid>
                    <Grid item container xs={12} spacing={1} justifyContent="center" alignItems="center">
                        {TelemetryData.map((telemetry) => {
                            return <Grid item container xs={calculateTelemContainerWidth(telemetry)} alignItems="center" justifyContent="center">
                                <Grid item container xs={12}>
                                    <Grid item xs={2} alignItems="center" justifyContent="center">
                                        <TelemetryIcon telemetryKey={telemetry.telemetryKey} />
                                    </Grid>
                                    <Grid item xs={10} alignItems="center" justifyContent="center">
                                        <Typography fontWeight={100}>{telemetry.value} {telemetry.unit}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        })}
                    </Grid>
                </Grid>
                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <Typography fontSize={20} fontWeight={700}>Mission Control</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="theme-select-label">Mission</InputLabel>
                            <Select
                                fullWidth
                                labelId="theme-select-label"
                                id="theme-select"
                                style={{ height: 35 }}
                                value={mission}
                                label="Theme"
                                onChange={(evt) => {
                                    setMission(evt.target.value)
                                }}
                            >
                                {allMisions.map(item => {
                                    return <MenuItem value={item}>{item}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item container xs={12} alignItems="center" spacing={1}>
                        <Grid item xs={2}><Button fullWidth variant="contained" startIcon={<UploadIcon />}>Upload</Button></Grid>
                        <Grid item xs={2}><Button disabled fullWidth variant="contained" startIcon={<DeleteIcon />}>Clear</Button></Grid>
                        <Grid item xs={2}><Button disabled fullWidth variant="contained" startIcon={<PlayCircleIcon />}>Start</Button></Grid>
                        <Grid item xs={2}><Button disabled fullWidth variant="contained" startIcon={<PauseCircleIcon />}>Pause</Button></Grid>
                        <Grid item xs={2}><Button disabled fullWidth variant="contained" startIcon={<StopCircleIcon />}>Stop</Button></Grid>
                        <Grid item xs={2}><Button disabled fullWidth variant="contained" startIcon={<RestartAltIcon />}>Restart</Button></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    </Box>
}

export default Telemetry;
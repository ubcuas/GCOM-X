import { Container, Grid, Paper, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';

import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import UploadIcon from "@mui/icons-material/Upload"
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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

import { useState } from "react";
import Settings from "@mui/icons-material/Settings";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const TelemWidth = 2;

const TelemetryData = [
    {
        icon: <GpsFixedIcon />,
        value: "49.252219, -123.238290",
        unit: "",
        width: 4
    },
    {
        icon: <HeightIcon />,
        value: "153",
        unit: "m"
    },
    {
        icon: <TimerIcon />,
        value: "00:03:15",
        unit: "",
        width: 2
    },
    {
        icon: <VibrationIcon />,
        value: "1.35",
        unit: "g"
    },
    {
        icon: <Battery90Icon />,
        value: "87.93",
        unit: "%"
    },
    {
        icon: <ExploreIcon />,
        value: "153.5",
        unit: "°"
    },
    {
        icon: <DeviceThermostatIcon />,
        value: "11.7",
        unit: "°C"
    },
    {
        icon: <SpeedIcon />,
        value: "30.4",
        unit: "m/s"
    },
    {
        icon: <SdStorageIcon />,
        value: "45.6",
        unit: "%"
    },
    {
        icon: <NetworkCheckIcon />,
        value: "62",
        unit: "Mbps"
    },
    {
        icon: <BatteryChargingFullIcon />,
        value: "24.90",
        unit: "V"
    }
]

const Telemetry = () => {
    const [allMisions, setAllMissions] = useState(["USC Task 2", "AUVSI Task 1", "AUVSI Task 2"]);
    const [mission, setMission] = useState(allMisions[0])

    return <Box sx={{ flexGrow: 1 }} style={{ padding: 0, position: "fixed", width: "100%", bottom: 0, left: 0, zIndex: 1000 }}>
        <Paper style={{ textAlign: "center", padding: 10 }}>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="p" fontSize={20} fontWeight={700}>System Telemetry</Typography>
                    </Grid>
                    <Grid item container xs={12} spacing={1} justifyContent="center" alignItems="center">
                        {TelemetryData.map((telemetry) => {
                            return <Grid item container xs={telemetry.width ? telemetry.width : TelemWidth} alignItems="center" justifyContent="center">
                                <Grid item container xs={12}>
                                    <Grid item xs={2} alignItems="center" justifyContent="center">
                                        {telemetry.icon}
                                    </Grid>
                                    <Grid item xs={10} alignItems="center" justifyContent="center">
                                        <Typography variant="p" fontWeight={100}>{telemetry.value} {telemetry.unit}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        })}
                    </Grid>
                </Grid>
                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="p" fontSize={20} fontWeight={700}>Mission Control</Typography>
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
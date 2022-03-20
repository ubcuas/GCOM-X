import * as React from 'react';
import { useState, useEffect } from "react";

import { getAircraftTelem } from '../MapView/actions/action-getaircrafttelem';

import { useSelector, useDispatch } from 'react-redux';

import { Container, Grid, Paper, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';

import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import UploadIcon from "@mui/icons-material/Upload"
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RefreshIcon from '@mui/icons-material/Refresh';

import { TelemetryIcon } from "./TelemetryIcon";
import { UASTelemetry, UASTelemetryKey } from "../../interfaces/telemetry.interface";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function calculateTelemContainerWidth(t: UASTelemetry): number {
    let l = t.value.length + t.unit.length;
    return (l > 40) ? 6 : (l > 20) ? 4 : (l > 12) ? 3 : 2;
}

const TelemetryPanel = () => {
    const [allMisions, setAllMissions] = useState(["Select Mission", "USC Task 2", "AUVSI Survey", "AUVSI Waypoints"]);
    const [mission, setMission] = useState(allMisions[0]);
    const [canSelectMission, setCanSelectMission] = useState(false);
    const [canUploadMission, setCanUploadMission] = useState(false);
    const [canStart, setCanStart] = useState(false);
    const [canUseControls, setCanUseControls] = useState(false);

    const dispatch = useDispatch();
    const aircraft = useSelector(state => state.aircraft);

    // useEffect(() => {
    //     console.log("aircraft updated", aircraft)
    // }, [aircraft]);

    // setInterval(() => {
    //     try {
    //         // dispatch((getAircraftTelem())())
    //         // dispatch('GET_TELEM')
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, 100)

    return <Box sx={{ flexGrow: 1 }} style={{ padding: 0, position: "fixed", width: "100%", bottom: 0, left: 0, zIndex: 1000 }}>
        <Paper style={{ textAlign: "center", padding: 10 }}>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={12}>
                        <Typography fontSize={20} fontWeight={700}>System Telemetry</Typography>
                    </Grid>
                    <Grid item container xs={12} spacing={1} justifyContent="center" alignItems="center">
                        {(aircraft ? Object.keys(aircraft) : []).map((aircraftTelemetryKey) => {
                            return <Grid item container xs={4} alignItems="center" justifyContent="center">
                                <Grid item container xs={12}>
                                    <Grid item xs={2} alignItems="center" justifyContent="center">
                                        <TelemetryIcon telemetryKey={UASTelemetryKey.GENERIC} />
                                    </Grid>
                                    <Grid item xs={10} alignItems="center" justifyContent="center">
                                        <Typography fontWeight={100}>{aircraft[aircraftTelemetryKey]} {"N/A"}</Typography>
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
                    <Grid item xs={1}>
                        <IconButton style={{ height: 35 }}
                            onClick={() => {
                                setCanSelectMission(true)
                            }}>
                            <RefreshIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={11}>
                        <FormControl fullWidth>
                            <InputLabel id="theme-select-label">Mission</InputLabel>
                            <Select
                                disabled={!canSelectMission}
                                fullWidth
                                labelId="theme-select-label"
                                id="theme-select"
                                style={{ height: 35 }}
                                value={mission}
                                label="Mission"
                                onChange={(evt) => {
                                    setMission(evt.target.value)
                                    setCanUploadMission(true)
                                    setCanStart(false)
                                    setCanUseControls(false)
                                }}
                            >
                                {allMisions.map(item => {
                                    return <MenuItem value={item}>{item}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item container xs={12} alignItems="center" spacing={1}>
                        <Grid item xs={2}><Button disabled={!canUploadMission} fullWidth variant="contained" startIcon={<UploadIcon />}
                            onClick={() => {
                                setCanStart(true)
                                setCanUploadMission(false)
                                setCanSelectMission(false)
                            }}>Upload</Button></Grid>
                        <Grid item xs={2}><Button disabled={!canStart} fullWidth variant="contained" startIcon={<DeleteIcon />}
                            onClick={() => {
                                setCanSelectMission(true)
                                setCanUploadMission(false)
                                setCanStart(false)
                            }}>Clear</Button></Grid>
                        <Grid item xs={2}><Button disabled={!canStart} fullWidth variant="contained" startIcon={<PlayCircleIcon />}
                            onClick={() => {
                                setCanUseControls(true)
                                setCanStart(false)
                                setCanUploadMission(false)
                            }}>Start</Button></Grid>
                        <Grid item xs={2}><Button disabled={!canUseControls} fullWidth variant="contained" startIcon={<PauseCircleIcon />}
                            onClick={() => {
                                setCanStart(true)
                                setCanUploadMission(false)
                                setCanUseControls(false)
                            }}>Pause</Button></Grid>
                        <Grid item xs={2}><Button disabled={!canUseControls} fullWidth variant="contained" startIcon={<StopCircleIcon />}
                            onClick={() => {
                                setCanStart(true)
                                setCanUploadMission(false)
                                setCanUseControls(false)
                            }}>Stop</Button></Grid>
                        <Grid item xs={2}><Button disabled={!canUseControls} fullWidth variant="contained" startIcon={<RestartAltIcon />}
                            onClick={() => {
                                setCanStart(true)
                                setCanUploadMission(false)
                                setCanUseControls(false)
                            }}>Restart</Button></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    </Box>
}

export default TelemetryPanel;
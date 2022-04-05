import * as React from 'react';
import { useState, useEffect } from "react";

import { Grid, Typography, IconButton, FormControl, InputLabel, Select, Button, MenuItem, FormLabel, CircularProgress } from "@mui/material"

import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import UploadIcon from "@mui/icons-material/Upload"
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import FlightIcon from '@mui/icons-material/Flight';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const getInteropMissions = () => {
    // fetch("http://localhost:8080/api/interop/missions")
}

const getCurrentAircraftMission = () => {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:5000/aircraft/mission").then(res => {
            if (res.ok) {
                res.json().then(mission => {
                    resolve(mission)
                })
            } else {
                reject()
            }
        }).catch(reject)
    })
}

const MissionPanel = () => {
    const [allMisions, setAllMissions] = useState(["Select Mission", "USC Task 2", "AUVSI Survey", "AUVSI Waypoints"]);
    const [mission, setMission] = useState(allMisions[0]);
    const [canSelectMission, setCanSelectMission] = useState(true);
    const [canUploadMission, setCanUploadMission] = useState(false);
    const [canStart, setCanStart] = useState(false);
    const [isFetchingMission, setIsFetchingMission] = useState(false);
    const [canUseControls, setCanUseControls] = useState(false);

    const syncAircraftMission = () => {
        setIsFetchingMission(true)
        getCurrentAircraftMission().then((mission) => {
            setIsFetchingMission(false)

        }).catch(err => {
            setIsFetchingMission(false)
            // some error handling here
        })
    }

    return <Grid item container xs={6} spacing={1}>
        <Grid item xs={12}>
            <Typography fontSize={20} fontWeight={700}>Mission Control</Typography>
        </Grid>
        <Grid item xs={1}>
            <IconButton style={{ height: 35 }}
                onClick={() => {
                    // sextCanSelectMission(true)
                    //TODO: fetch interop missions here
                }}>
                <RefreshIcon />
            </IconButton>
        </Grid>
        <Grid item xs={5}>
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
        <Grid item xs={3}>
            <Button
                fullWidth
                variant="contained"
                component="label"
                startIcon={<DriveFolderUploadIcon />}
            >
                Custom
                <input
                    type="file"
                    hidden
                />
            </Button>
        </Grid>
        <Grid item xs={3}>
            <Button
                fullWidth
                variant="contained"
                startIcon={isFetchingMission ? <CircularProgress color="inherit" /> : <FlightIcon />}
                onClick={syncAircraftMission}
            >
                Synchronize
            </Button>
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
}

export default MissionPanel
import * as React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadMissions } from '../../store/actions/action-loadmissions';
import { loadRoutes } from '../../store/actions/action-loadroute';
import { updateCurMission } from '../../store/actions/action-updatecurmission';
import { updateNewAlt } from '../../store/actions/action-updatenewwp';
import { updateMapProps } from '../../store/actions/action-updatemapprops'
import axios from "axios";

import UnitConverter from '../../utils/UnitConverter'
const uc = new UnitConverter()

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

const MissionPanel = (props) => {
    const [allMisions, setAllMissions] = useState([]);
    const [mission, setMission] = useState(allMisions[0]);
    const [canSelectMission, setCanSelectMission] = useState(false);
    const [canUploadMission, setCanUploadMission] = useState(false);
    const [canStart, setCanStart] = useState(false);
    const [isFetchingMission, setIsFetchingMission] = useState(false);
    const [canUseControls, setCanUseControls] = useState(false);

    useEffect(() => {
        props.loadMissions();
    }, [])

    const syncAircraftMission = () => {
        setIsFetchingMission(true)
        getCurrentAircraftMission().then((mission) => {
            setIsFetchingMission(false)

        }).catch(err => {
            setIsFetchingMission(false)
            // some error handling here
        })
    }

    const handleMissionChange = (evt) => {
        setMission(evt.target.value)
        setCanUploadMission(true)
        setCanStart(false)
        setCanUseControls(false)

        const missionId = evt.target.value;
        props.loadRoutes(missionId);
        props.updateCurMission(missionId);

        // recenter the new mission
        if (props.markers.length > 0) {
            props.updateMapProps({ latitude: props.markers[0].latitude, longitude: props.markers[0].longitude, zoom: 16 });
        }
    }

    const uploadRoute = () => {
        const UPLOAD_ENDPOINT = "http://localhost:8080/avoidance/api/upload_to_acom/";
        axios.post(UPLOAD_ENDPOINT + props.currentMission + "/", { waypoints: props.markers })
            .then(response => {
                alert('The mission was successfully uploaded.');
                setCanStart(true);
                setCanUploadMission(false);
                setCanSelectMission(false);
            }).catch(() => {
                alert('There was an error uploading mission.');
            });
    }

    const loadRoutes = () => {
        setCanSelectMission(true)
        setCanUploadMission(false)
        setCanStart(false)

        props.loadRoutes(props.currentMission);
    }

    return <Grid item container xs={6} spacing={1}>
        <Grid item xs={12}>
            <Typography fontSize={20} fontWeight={700}>Mission Control</Typography>
        </Grid>
        <Grid item xs={1}>
            <IconButton style={{ height: 35 }}
                onClick={() => {
                    props.loadMissions()
                    setCanSelectMission(true)
                }}>
                <RefreshIcon />
            </IconButton>
        </Grid>
        <Grid item xs={5}>
            <FormControl fullWidth size="small">
                <InputLabel id="theme-select-label">Mission</InputLabel>
                <Select
                    disabled={!canSelectMission}
                    fullWidth
                    labelId="theme-select-label"
                    id="theme-select"
                    value={mission}
                    label="Mission"
                    onChange={handleMissionChange}
                >
                    {props.missions.missions.map(mission => {
                        return <MenuItem value={mission}>{mission}</MenuItem>
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
                startIcon={isFetchingMission ? <CircularProgress size={20} color="inherit" /> : <FlightIcon />}
                onClick={syncAircraftMission}
            >
                Synchronize
            </Button>
        </Grid>
        <Grid item container xs={12} alignItems="center" spacing={1}>
            <Grid item xs={2}>
                <Button disabled={!canUploadMission} fullWidth variant="contained" startIcon={<UploadIcon />}
                onClick={uploadRoute}>
                Upload
                </Button>
            </Grid>
            <Grid item xs={2}>
                <Button disabled={!canStart} fullWidth variant="contained" startIcon={<DeleteIcon />}
                onClick={loadRoutes}>
                Clear
                </Button>
            </Grid>
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

function mapStateToProps(state) {
    return {
        selectedMarker: state.markers.selectedMarker,
        markers: state.markers.markers,
        missions: state.missions,
        currentMission: state.curMission,
        newAltitude: state.newAlt
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadMissions,
        loadRoutes,
        updateCurMission,
        updateNewAlt,
        updateMapProps,
    }, dispatch);
}


const waypointPropType = PropTypes.shape({
    id: PropTypes.any,
    latlng: PropTypes.array,
});

MissionPanel.propTypes = {
    markers: PropTypes.arrayOf(waypointPropType).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MissionPanel);
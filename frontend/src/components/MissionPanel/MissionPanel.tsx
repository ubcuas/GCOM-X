import * as React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadMissions } from '../../store/actions/action-loadmissions';
import { loadRoutes, loadCurrentRoute } from '../../store/actions/action-loadroute';
import { updateCurMission } from '../../store/actions/action-updatecurmission';
import { updateNewAlt } from '../../store/actions/action-updatenewwp';
import { updateMapProps } from '../../store/actions/action-updatemapprops'
import axios from "axios";

import UnitConverter from '../../utils/UnitConverter'
const uc = new UnitConverter()

import { Grid, Typography, IconButton, FormControl, InputLabel, Select, Button, MenuItem, FormLabel, CircularProgress } from "@mui/material"

import UploadIcon from "@mui/icons-material/Upload"
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FlightIcon from '@mui/icons-material/Flight';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

const GCOM_WINCH_COMMAND_ENDPOINT = "http://localhost:8080/avoidance/api/winch/command"

const MissionPanel = (props) => {
    const [allMissionIds, setAllMissionIds] = useState([]);
    const [activeMissionId, setActiveMissionId] = useState(-1);
    const [canRefreshMission, setCanRefreshMission] = useState(true);
    const [canSelectMission, setCanSelectMission] = useState(false);
    const [canUploadMission, setCanUploadMission] = useState(false);
    const [canStart, setCanStart] = useState(false);
    const [canWinch, setCanWinch] = useState(true)
    const [isFetchingMission, setIsFetchingMission] = useState(false);

    useEffect(() => {
        props.loadMissions();
    }, [])

    useEffect(() => {
        setAllMissionIds(props.missions.missions);
    }, [props.missions])

    const syncAircraftMission = () => {
        props.loadCurrentRoute()
        props.updateCurMission(0)
    }

    const handleMissionChange = (evt) => {
        let selectedMissionId = evt.target.value;
        if (selectedMissionId === -1 || selectedMissionId === activeMissionId) {
            return;
        }

        setActiveMissionId(evt.target.value)
        setCanUploadMission(true)
        setCanStart(false)

        props.loadRoutes(selectedMissionId);
        props.updateCurMission(selectedMissionId);

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
                setCanRefreshMission(false)
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
                disabled={!canRefreshMission}
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
                    value={activeMissionId}
                    label="Mission"
                    onChange={handleMissionChange}
                >
                    <MenuItem value={-1}>No Mission Selected</MenuItem>
                    {allMissionIds.map(missionId => {
                        return <MenuItem value={missionId}>Mission {missionId}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={3}>
            <Button
                disabled={!canSelectMission}
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
            <Grid item xs={4}>
                <Button disabled={!canUploadMission} fullWidth variant="contained" startIcon={<UploadIcon />}
                    onClick={uploadRoute}>
                    Upload
                </Button>
            </Grid>
            {/* TODO: Clear mission from aircraft using this button */}
            <Grid item xs={3}>
                <Button disabled={!canStart} fullWidth variant="contained" startIcon={<DeleteIcon />}
                    onClick={() => {
                        setCanRefreshMission(true)
                        setCanSelectMission(true)
                        setCanUploadMission(true)
                        setCanStart(false)
                    }}>
                    Clear
                </Button>
            </Grid>
            <Grid item xs={5}><Button disabled={!canWinch} fullWidth variant="contained" startIcon={<CrisisAlertIcon />}
                onClick={() => {
                    fetch(GCOM_WINCH_COMMAND_ENDPOINT, {method: 'POST'}).then(response => response.json())
                    .then(data => console.log(data));
                }}>Emergency Winch Reel</Button></Grid>
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
        loadCurrentRoute,
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
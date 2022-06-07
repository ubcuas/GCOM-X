import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import Status from '../Status';

import { Grid, Button, Typography, Stack } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const TelemetryStatus = Object.freeze({
    ERROR: -1,
    STOPPED: 0,
    SENDING: 1,
});

const ConnectionStatus = Object.freeze({
    ERROR: -1,
    DISCONNECTED: 0,
    CONNECTED: 1,
    CONNECTED_SENDING_DATA: 2,
    CONNECTED_SENDING_DATA_FAILED: 3,
});

const INTEROP_LOGIN_ENDPOINT = 'http://localhost:8080/api/interop/login';
const INTEROP_MISSION_ENDPOINT = 'http://localhost:8080/api/interop/mission';
const INTEROP_STATUS_ENDPOINT = 'http://localhost:8080/api/interop/status';
const TELEMETRY_ENDPOINT = 'http://localhost:8080/api/interop/telemstatus';
const TEAM_TELEMETRY_ENDPOINT = 'http://localhost:8080/api/interop/teamtelemstatus';
const INTEROP_UBC_ID_ENDPOINT = 'http://localhost:8080/api/interop/ubcid';

const Interop = () => {
    const [telemetryStatus, setTelemetryStatus] = useState(ConnectionStatus.DISCONNECTED);
    const [teamTelemetryStatus, setTeamTelemetryStatus] = useState(TelemetryStatus.STOPPED);
    const [ubcID, setUbcID] = useState(0);
    const [needsRelogin, setNeedsRelogin] = useState(false);
    const [currentMissionID, setCurrentMissionID] = useState(-1);
    const location = useLocation();
    const navigate = useNavigate();

    // refresh once when created
    useEffect(() => {
        refresh();
    }, []);

    // update page if pathname has changed
    useEffect(() => {
        updatePage();
    }, [location.pathname]);

    async function updatePage() {
        let status = await getConnectionStatus();
        if (location.pathname !== '/interop' &&
            (status.status === ConnectionStatus.DISCONNECTED ||
                status.status === ConnectionStatus.ERROR))
            navigate('/interop');
        else if (!needsRelogin &&
            location.pathname === '/interop' &&
            status.status !== ConnectionStatus.DISCONNECTED &&
            status.status !== ConnectionStatus.ERROR)
            navigate('/interop/status');

        setCurrentMissionID(status.missionID);
    }

    async function getConnectionStatus() {
        try {
            let res = await axios.get(INTEROP_STATUS_ENDPOINT)
            return {
                status: res.data.status,
                missionID: res.data.mission_id,
            }
        } catch (err) {
            return {
                status: ConnectionStatus.ERROR,
                missionID: null,
            }
        }
    }

    async function getTelemetryStatus() {
        try {
            let res = await axios.get(TELEMETRY_ENDPOINT)
            return res.data.status;
        } catch (err) {
            return TelemetryStatus.ERROR;
        }
    }

    async function getTeamTelemetryStatus() {
        try {
            let res = await axios.get(TEAM_TELEMETRY_ENDPOINT)
            return res.data.status;
        } catch (err) {
            return TelemetryStatus.ERROR;
        }
    }

    async function getUbcID() {
        try {
            let res = await axios.get(INTEROP_UBC_ID_ENDPOINT)
            return res.data.ubc_id
        } catch (err) {
            return -1;
        }
    }

    async function updateTelemetry() {
        let telemetryStatus = await getTelemetryStatus();
        setTelemetryStatus(Number(telemetryStatus));
    }

    async function updateTeamTelemetry() {
        let teamTelemetryStatus = await getTeamTelemetryStatus();
        setTeamTelemetryStatus(Number(teamTelemetryStatus));
    }

    async function updateUbcID() {
        let ubcID = await getUbcID();
        setUbcID(Number(ubcID));
    }

    function refresh() {
        updatePage();
        updateTelemetry();
        updateTeamTelemetry();
        updateUbcID();
    }

    async function login(params) {
        try {
            let response = await axios.post(INTEROP_LOGIN_ENDPOINT, params)
            navigate('/interop/status');
            setNeedsRelogin(false);
            setCurrentMissionID(response.data.mission_id);
        } catch (err) {
            alert(err);
        }
    }

    function relogin() {
        setNeedsRelogin(true);
        navigate('/interop');
    }

    async function grabInteropMission(id) {
        try {
            let response = await axios.post(INTEROP_MISSION_ENDPOINT, { mission_id: id })
            setCurrentMissionID(response.data.mission_id);
        } catch (err) {
            alert(err);
        }
    }

    async function postUbcID(id) {
        try {
            let response = await axios.post(INTEROP_UBC_ID_ENDPOINT, { ubc_id: id })
            setUbcID(response.data.ubc_id);
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <Stack direction="column" alignItems="center" gap={0}>
                        <Typography fontSize={32} fontWeight={700} style={{ margin: 20 }}>Interop</Typography>
                        {Number(telemetryStatus) == 1 ?
                            <><Stack direction="row" alignItems="center" gap={1}>
                                <CheckCircleIcon />
                                <Typography variant="h6">Receiving Telemetry</Typography>
                            </Stack></> :
                            <><Stack direction="row" alignItems="center" gap={1}>
                                <CancelIcon />
                                <Typography variant="h6">Missing Telemetry</Typography>
                            </Stack></>}
                        {Number(teamTelemetryStatus) == 1 ?
                            <><Stack direction="row" alignItems="center" gap={1}>
                                <CheckCircleIcon />
                                <Typography variant="h6">Receiving Team Telemetry</Typography>
                            </Stack></> :
                            <><Stack direction="row" alignItems="center" gap={1}>
                                <CancelIcon />
                                <Typography variant="h6">Missing Team Telemetry</Typography>
                            </Stack></>}
                        </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Button
                    size="small"
                    variant="contained"
                    className="btn btn-primary"
                    onClick={refresh}
                >
                    Refresh
                    </Button>
                </Grid>
            </Grid>
                       
            <br />

            <Routes>
                <Route
                    path="/"
                    element={<Login login={login} />}
                />
                <Route
                    path="/status"
                    element={<Status
                        grabInteropMission={grabInteropMission}
                        telemetryStatus={telemetryStatus}
                        teamTelemetryStatus={teamTelemetryStatus}
                        currentMissionID={currentMissionID}
                        ubcID={ubcID}
                        postUbcID={postUbcID}
                        relogin={relogin}
                    />}
                />
            </Routes>
        </div>
    );
}

export default Interop;

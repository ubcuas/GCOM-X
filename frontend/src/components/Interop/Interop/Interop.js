import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import Status from '../Status';
import './style.scss';

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

const Interop = () => {
    const [telemetryStatus, setTelemetryStatus] = useState(ConnectionStatus.DISCONNECTED);
    const [teamTelemetryStatus, setTeamTelemetryStatus] = useState(ConnectionStatus.DISCONNECTED);
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

    async function updateTelemetry() {
        let telemetryStatus = await getTelemetryStatus();
        setTelemetryStatus(Number(telemetryStatus));
    }

    async function updateTeamTelemetry() {
        let teamTelemetryStatus = await getTeamTelemetryStatus();
        setTeamTelemetryStatus(Number(teamTelemetryStatus));
    }

    function refresh() {
        updatePage();
        updateTelemetry();
        updateTeamTelemetry();
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
            let response = await axios.post(INTEROP_MISSION_ENDPOINT, {mission_id: id})
            setCurrentMissionID(response.data.mission_id);
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div className="interop">
            <div className="heading">
                <h1>Interop</h1>
                <button
                    className="btn btn-primary"
                    onClick={refresh}
                >
                    Refresh
                </button>
            </div>
            <br />

            <Routes>
                <Route
                    path="/interop"
                    exact
                    render={() => (
                        <Login
                            login={login}
                        />
                    )}
                />
                <Route
                    path="/interop/status"
                    exact
                    render={() => (
                        <Status
                            grabInteropMission={grabInteropMission}
                            telemetryStatus={telemetryStatus}
                            teamTelemetryStatus={teamTelemetryStatus}
                            currentMissionID={currentMissionID}
                            relogin={relogin}
                        />
                    )}
                />
            </Routes>
        </div>
    );
}

export default Interop;

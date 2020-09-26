import React, { useState, useEffect } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import PropTypes from 'prop-types';
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

const INTEROP_LOGIN_ENDPOINT = 'api/interop/login';
const INTEROP_MISSION_ENDPOINT = 'api/interop/mission';
const INTEROP_STATUS_ENDPOINT = 'api/interop/status';
const TELEMETRY_ENDPOINT = 'api/interop/telemetrythread';

const Interop = (props) => {
    const [telemetryStatus, setTelemetryStatus] = useState(ConnectionStatus.DISCONNECTED);
    const [needsRelogin, setNeedsRelogin] = useState(false);
    const [currentMissionID, setCurrentMissionID] = useState(-1);

    // refresh once when created
    useEffect(() => {
        refresh();
    }, []);

    // update page if pathname has changed
    useEffect(() => {
        updatePage();
    }, [props.location.pathname]);

    async function updatePage() {
        let status = await getConnectionStatus();
        if (props.location.pathname !== '/' &&
            (status.status === ConnectionStatus.DISCONNECTED ||
            status.status === ConnectionStatus.ERROR))
            props.history.push('/');
        else if (!needsRelogin &&
                props.location.pathname === '/' &&
                status.status !== ConnectionStatus.DISCONNECTED &&
                status.status !== ConnectionStatus.ERROR)
            props.history.push('/status');

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

    async function updateTelemetry() {
        let telemetryStatus = await getTelemetryStatus();
        setTelemetryStatus(Number(telemetryStatus));
    }

    function refresh() {
        updatePage();
        updateTelemetry();
    }

    async function login(params) {
        try {
            let response = await axios.post(INTEROP_LOGIN_ENDPOINT, params)
            props.history.push('/status');
            setNeedsRelogin(false);
            setCurrentMissionID(response.data.mission_id);
        } catch (err) {
            alert(err);
        }
    }

    function relogin() {
        setNeedsRelogin(true);
        props.history.push('/');
    }

    async function grabInteropMission(id) {
        try {
            let response = await axios.post(INTEROP_MISSION_ENDPOINT, {mission_id: id})
            setCurrentMissionID(response.data.mission_id);
        } catch (err) {
            alert(err);
        }
    }

    function sendTelemetry() {
        if (telemetryStatus !== TelemetryStatus.SENDING)
        {
            axios.post(TELEMETRY_ENDPOINT, {})
            .then(() =>
            {
                setTelemetryStatus(TelemetryStatus.SENDING);
            })
            .catch(e => alert(e));
        }
        else
        {
            axios.delete(TELEMETRY_ENDPOINT, {})
            .then(() =>
            {
                setTelemetryStatus(TelemetryStatus.STOPPED);
            })
            .catch(e => alert(e));
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

            <Switch>
                <Route
                    path="/"
                    exact
                    render={() => (
                        <Login
                            login={login}
                        />
                    )}
                />
                <Route
                    path="/status"
                    exact
                    render={() => (
                        <Status
                            sendTelemetry={sendTelemetry}
                            grabInteropMission={grabInteropMission}
                            telemetryStatus={telemetryStatus}
                            currentMissionID={currentMissionID}
                            relogin={relogin}
                        />
                    )}
                />
            </Switch>
        </div>
    );
}

Interop.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
};

export default withRouter(Interop);

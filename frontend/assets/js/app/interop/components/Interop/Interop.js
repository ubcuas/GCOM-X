import React, { Component } from 'react';
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

class Interop extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            telemetryStatus: ConnectionStatus.DISCONNECTED,
            relogin: false,
            currentMissionID: -1
        };
    }

    componentDidMount()
    {
        this.refresh();
    }

    componentDidUpdate(prevProps)
    {
        if (this.props.location.pathname !== prevProps.location.pathname)
            this.updatePage();
    }

    static getConnectionStatus()
    {
        return axios.get(INTEROP_STATUS_ENDPOINT)
        .then(r => ({
            status: r.data.status,
            missionID: r.data.mission_id,
        }))
        .catch(() => ({
            status: ConnectionStatus.ERROR,
            missionID: null,
        }));
    }

    static getTelemetryStatus()
    {
        return axios.get(TELEMETRY_ENDPOINT)
        .then(r => r.data.status)
        .catch(() => TelemetryStatus.ERROR);
    }

    updatePage()
    {
        // Prevent going to the status page if user has not logged on
        Interop.getConnectionStatus().then((status) =>
        {
            if (this.props.location.pathname !== '/' &&
                (status.status === ConnectionStatus.DISCONNECTED ||
                status.status === ConnectionStatus.ERROR))
                this.props.history.push('/');
            else if (!this.state.relogin &&
                    this.props.location.pathname === '/' &&
                    status.status !== ConnectionStatus.DISCONNECTED &&
                    status.status !== ConnectionStatus.ERROR)
                this.props.history.push('/status');

            this.setState({
                currentMissionID: status.missionID,
            });
        });
    }

    updateTelemetry()
    {
        Interop.getTelemetryStatus().then((telemetryStatus) =>
        {
            this.setState({
                telemetryStatus: Number(telemetryStatus),
            });
        });
    }

    refresh()
    {
        this.updatePage();
        this.updateTelemetry();
    }

    login(params)
    {
        axios.post(INTEROP_LOGIN_ENDPOINT, params)
        .then((response) =>
        {
            this.props.history.push('/status');
            this.setState({
                relogin: false,
                currentMissionID: response.data.mission_id,
            });
        })
        .catch(e => alert(e));
    }

    relogin()
    {
        this.setState({
            relogin: true,
        });
        this.props.history.push('/');
    }

    grabInteropMission(id)
    {
        axios.post(INTEROP_MISSION_ENDPOINT, {mission_id: id})
        .then(response =>
        {
            this.setState({
                currentMissionID: response.data.mission_id
            });
        })
        .catch(e => alert(e));
    }

    sendTelemetry()
    {
        if (this.state.telemetryStatus !== TelemetryStatus.SENDING)
        {
            axios.post(TELEMETRY_ENDPOINT, {})
            .then(() =>
            {
                this.setState({
                    telemetryStatus: TelemetryStatus.SENDING,
                });
            })
            .catch(e => alert(e));
        }
        else
        {
            axios.delete(TELEMETRY_ENDPOINT, {})
            .then(() =>
            {
                this.setState({
                    telemetryStatus: TelemetryStatus.STOPPED,
                });
            })
            .catch(e => alert(e));
        }
    }

    render()
    {
        const { telemetryStatus, currentMissionID } = this.state;
        return (
            <div className="interop">
                <div className="heading">
                    <h1>Interop</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => this.refresh()}
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
                                login={params => this.login(params)}
                            />
                        )}
                    />
                    <Route
                        path="/status"
                        exact
                        render={() => (
                            <Status
                                sendTelemetry={() => this.sendTelemetry()}
                                grabInteropMission={(id) => this.grabInteropMission(id)}
                                telemetryStatus={telemetryStatus}
                                currentMissionID={currentMissionID}
                                relogin={() => this.relogin()}
                            />
                        )}
                    />
                </Switch>
            </div>
        );
    }
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

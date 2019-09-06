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

const IMAGE_DOWNLOAD_ENDPOINT = '/api/imp/image-download/';
const SKYAYE_HEARTBEAT_ENDPOINT = '/api/imp/skyaye-heartbeat/';
const INTEROP_HOME_ENDPOINT = 'api/interop/home';
const TELEMETRY_ENDPOINT = 'api/interop/telemetrythread';

class Interop extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            telemetryStatus: ConnectionStatus.DISCONNECTED,
            relogin: false,
            downloadingStatus: false,
            skyayeHeartbeat: {
                camera: null,
                telemetry: null,
                monitor: null,
            },
            currentMissionID: null,
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
        return axios.get(INTEROP_HOME_ENDPOINT)
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

    static getDownloadingStatus()
    {
        return axios.get(IMAGE_DOWNLOAD_ENDPOINT)
        .then(r => r.data.status || false)
        .catch(() => false);
    }

    static getHeartbeatStatus()
    {
        return axios.get(SKYAYE_HEARTBEAT_ENDPOINT)
        .then(r => r.data)
        .catch(() => ({
            camera: 'Error',
            telemetry: 'Error',
            monitor: 'Error',
        }));
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

    updateDownloading()
    {
        Interop.getDownloadingStatus().then((status) =>
        {
            this.setState({
                downloadingStatus: status,
            });
        });
    }

    updateSkyayeHeartbeat()
    {
        Interop.getHeartbeatStatus().then((status) =>
        {
            this.setState({
                skyayeHeartbeat: status,
            });
        });
    }

    refresh()
    {
        this.updatePage();
        this.updateTelemetry();
        // this.updateDownloading();
        // this.updateSkyayeHeartbeat();
    }

    login(params)
    {
        axios.post(INTEROP_HOME_ENDPOINT, params)
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

    downloadImages()
    {
        if (!this.state.downloadingStatus)
        {
            axios.post(IMAGE_DOWNLOAD_ENDPOINT)
            .then((r) =>
            {
                this.setState({
                    downloadingStatus: r.data.status,
                });
            })
            .catch(e => alert(e));
        }
        else
        {
            axios.delete(IMAGE_DOWNLOAD_ENDPOINT)
            .then((r) =>
            {
                this.setState({
                    downloadingStatus: r.data.status,
                });
            })
            .catch(e => alert(e));
        }
    }

    render()
    {
        const { telemetryStatus, currentMissionID,
                downloadingStatus, skyayeHeartbeat } = this.state;
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
                                telemetryStatus={telemetryStatus}
                                currentMissionID={currentMissionID}
                                // downloadImages={() => this.downloadImages()}
                                // downloadingStatus={downloadingStatus}
                                // updateSkyayeHeartbeat={() => this.updateSkyayeHeartbeat()}
                                // skyayeHeartbeat={skyayeHeartbeat}
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

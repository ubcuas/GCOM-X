import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import downloadFile from 'js-file-download';
import { TelemetryStatus, AAAStatus } from '../Interop';
import './style.scss';

const WAYPOINT_FILE_ENDPOINT = '/avoidance/file/route/';

class Status extends Component
{
    static telemetryStatusToText(status)
    {
        switch (status)
        {
            case TelemetryStatus.STOPPED:
                return 'Stopped';
            case TelemetryStatus.SENDING:
                return 'Sending';
            case TelemetryStatus.ERROR:
                return 'Error';
            default:
                return '';
        }
    }

    static aaaStatusToText(status)
    {
        switch (status)
        {
            case AAAStatus.STOPPED:
                return 'Stopped';
            case AAAStatus.SENDING:
                return 'Avoiding';
            case AAAStatus.ERROR:
                return 'Error';
            default:
                return '';
        }
    }

    constructor(props)
    {
        super(props);

        this.state = {
            newMissionID: 1
        };
    }

    componentDidMount()
    {
    }

    downloadWaypointFile()
    {
        axios.get(WAYPOINT_FILE_ENDPOINT + this.props.currentMissionID)
        .then(response =>
            downloadFile(response.data, `waypoints-mission-${this.props.currentMissionID}.txt`),
        )
        .catch(e => alert(e));
    }

    render()
    {
        const { sendTelemetry, sendAAA, telemetryStatus, relogin, currentMissionID, grabInteropMission } = this.props;
        return (
            <div className="status">
                <button
                    className="btn btn-warning relogin"
                    onClick={() => relogin()}
                >
                    Relogin
                </button>
                <button
                    className="btn btn-success flush-right"
                    onClick={() => this.downloadWaypointFile()}
                >
                    Download waypoint file
                </button>
                <br />

                <h5 className="label">Mission ID</h5>
                <div className="card card-flush-right"><h5>
                    { currentMissionID }
                </h5></div>
                <input
                    type="number"
                    className="form-control card card-flush-right"
                    value={ this.state.newMissionID }
                    onChange={e => this.setState({newMissionID: e.target.value})}
                />
                <button
                    className="btn btn-success flush-right"
                    onClick={() => grabInteropMission(this.state.newMissionID)}
                >
                    Grab Interop mission
                </button>

                <h5>Telemetry Status</h5>
                <div className="card status-card"><h5>
                    { Status.telemetryStatusToText(telemetryStatus) }
                </h5></div>
                <button
                    className="btn btn-primary flush-right"
                    onClick={() => sendTelemetry()}
                >
                    Toggle Telemetry
                </button>

                <h5>AAA Status</h5>
                <div className="card status-card"><h5>
                    { Status.aaaStatusToText(telemetryStatus) }
                </h5></div>
                <button
                    className="btn btn-primary flush-right"
                    onClick={() => sendAAA()}
                >
                    Toggle Avoidance
                </button>
            </div>
        );
    }
}

Status.propTypes = {
    sendTelemetry: PropTypes.func.isRequired,
    sendAAA: PropTypes.func.isRequired,
    telemetryStatus: PropTypes.number.isRequired,
    aaaStatus: PropTypes.number.isRequired,
    relogin: PropTypes.func.isRequired,
    currentMissionID: PropTypes.number.isRequired,
};

export default Status;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import downloadFile from 'js-file-download';
import { TelemetryStatus } from '../Interop';
import './style.scss';

const WAYPOINT_FILE_ENDPOINT = '/avoidance/file/route/';
const POLL_INTERVAL = 5000;

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

    constructor(props)
    {
        super(props);

        this.state = {
            timeout: null,
        };
    }

    componentDidMount()
    {
        // this.pollHeartbeat();
    }

    pollHeartbeat()
    {
        if (this.state.timeout)
            clearInterval(this.state.timeout);

        const poll = () =>
        {
            this.props.updateSkyayeHeartbeat();

            this.setState({
                timeout: setTimeout(poll, POLL_INTERVAL),
            });
        };

        poll();
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
        const { sendTelemetry, telemetryStatus, relogin, currentMissionID,
                downloadingStatus, downloadImages, skyayeHeartbeat } = this.props;
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

                {/* <h3 className="center">Skyaye Status</h3>

                <h5>Image Downloading</h5>
                <div className="card status-card"><h5>
                    { String(downloadingStatus) }
                </h5></div>
                <button
                    className="btn btn-primary flush-right"
                    onClick={() => downloadImages()}
                >
                    Toggle image download
                </button>
                <br />

                <h5 className="label">Camera</h5>
                <div className="card card-flush-right"><h5>
                    { String(skyayeHeartbeat.camera) }
                </h5></div>
                <h5 className="label">Telemetry</h5>
                <div className="card card-flush-right"><h5>
                    { String(skyayeHeartbeat.telemetry) }
                </h5></div>
                <h5 className="label">Monitor</h5>
                <div className="card card-flush-right"><h5>
                    { String(skyayeHeartbeat.monitor) }
                </h5></div> */}
            </div>
        );
    }
}

Status.propTypes = {
    sendTelemetry: PropTypes.func.isRequired,
    telemetryStatus: PropTypes.number.isRequired,
    relogin: PropTypes.func.isRequired,
    currentMissionID: PropTypes.number.isRequired,
    // downloadingStatus: PropTypes.bool.isRequired,
    // downloadImages: PropTypes.func.isRequired,
    // updateSkyayeHeartbeat: PropTypes.func.isRequired,
    // skyayeHeartbeat: PropTypes.shape({
    //     camera: PropTypes.string,
    //     telemetry: PropTypes.string,
    //     monitor: PropTypes.string,
    // }).isRequired,
};

export default Status;

import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import downloadFile from 'js-file-download';
import { TelemetryStatus } from '../Interop';
import './style.scss';

const WAYPOINT_FILE_ENDPOINT = '/avoidance/file/route/';

const Status = ({ sendTelemetry, telemetryStatus, relogin, currentMissionID, grabInteropMission }) => {
    const [newMissionID, setNewMissionID] = useState(1);

    function telemetryStatusToText(status) {
        switch (status) {
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

    function downloadWaypointFile() {
        axios.get(WAYPOINT_FILE_ENDPOINT + currentMissionID)
        .then(response =>
            downloadFile(response.data, `waypoints-mission-${currentMissionID}.txt`),
        )
        .catch(e => alert(e));
    }

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
                onClick={downloadWaypointFile}
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
                value={ newMissionID }
                onChange={e => setNewMissionID(e.target.value)}
            />
            <button
                className="btn btn-success flush-right"
                onClick={() => grabInteropMission(newMissionID)}
            >
                Grab Interop mission
            </button>

            <h5>Telemetry Status</h5>
            <div className="card status-card"><h5>
                { telemetryStatusToText(telemetryStatus) }
            </h5></div>
            <button
                className="btn btn-primary flush-right"
                onClick={() => sendTelemetry()}
            >
                Toggle Telemetry
            </button>
        </div>
    );
}

Status.propTypes = {
    sendTelemetry: PropTypes.func.isRequired,
    telemetryStatus: PropTypes.number.isRequired,
    relogin: PropTypes.func.isRequired,
    currentMissionID: PropTypes.number.isRequired,
};

export default Status;

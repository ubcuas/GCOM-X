import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import downloadFile from 'js-file-download';
import { TelemetryStatus } from "../Interop";
import { Grid, Button, Typography, Stack, Paper, TextField } from '@mui/material';

const WAYPOINT_FILE_ENDPOINT = 'http://localhost:8080/avoidance/file/route/';

const Status = ({telemetryStatus, teamTelemetryStatus, relogin, currentMissionID, ubcID, grabInteropMission, postUbcID }) => {
    const [newMissionID, setNewMissionID] = useState(1);
    const [newUbcID, setNewUbcID] = useState(ubcID);

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
        <Grid container justifyContent="center" alignItems="center" rowSpacing={2} columnSpacing={1} style={{ width: "33%", margin: "0 auto" }}>
            <Grid item xs={3}>
                <Button
                    variant="contained"
                    onClick={() => relogin()}
                >
                    Relogin
                </Button>
            </Grid>
            <Grid item xs={5}>
                <Button
                    variant="outlined"
                    onClick={downloadWaypointFile}
                >
                    Download waypoint file
                </Button>
            </Grid>
            <Paper style={{width: "80%", height: "100%", "marginTop": 20, "paddingTop": 22, "paddingBottom": 10 }}>
                <Grid container item rowSpacing ={3}>
                    <Grid item xs={5}>
                        <Stack alignItems="center" gap={1}>
                            <Typography variant="h6">Mission ID:</Typography>
                            <Typography variant="h6"> { currentMissionID } </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={7}>
                        <Stack alignItems="center" gap={1}>
                            <TextField
                                variant="outlined"
                                label="Set Mission ID"
                                size="small"
                                type="number"
                                value={ newMissionID }
                                onChange={e => setNewMissionID(e.target.value)}
                            />
                            <Button
                                variant="text"
                                onClick={() => grabInteropMission(newMissionID)}
                            >
                                Grab Interop mission
                            </Button>
                        </Stack>
                    </Grid> 
                </Grid>
            </Paper>
            <Paper style={{width: "80%", height: "100%", "paddingTop": 22, "paddingBottom": 10, "marginTop": 10 }}>
                <Grid container item rowSpacing ={3}>
                    <Grid item xs={5}>
                        <Stack alignItems="center" gap={1}>
                            <Typography variant="h6">UBC UAS ID:</Typography>
                            <Typography variant="h6"> { ubcID } </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={7}>
                        <Stack alignItems="center" gap={1}>
                            <TextField
                                variant="outlined"
                                label="Set Correct UBC UAS ID"
                                size="small"
                                type="number"
                                value={ newUbcID }
                                onChange={e => setNewUbcID(e.target.value)}
                            />
                            <Button
                                variant="text"
                                onClick={() => postUbcID(newUbcID)}
                            >
                                Update UBC UAS ID
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
            <Grid item xs={5}>
                <Stack alignItems="center" gap={1}>
                    <Typography variant="h7">Telemetry Status:</Typography>
                    <Typography variant="h6">{ telemetryStatusToText(telemetryStatus) }</Typography>
                </Stack>
            </Grid>
            <Grid item xs={7}>
                <Stack alignItems="center" gap={1}>
                    <Typography variant="h7">Other Team Telemetry Status:</Typography>
                    <Typography variant="h6">{ telemetryStatusToText(teamTelemetryStatus) }</Typography>
                </Stack>
            </Grid>
        </Grid>                     
    );
}

Status.propTypes = {
    sendTelemetry: PropTypes.func.isRequired,
    telemetryStatus: PropTypes.number.isRequired,
    relogin: PropTypes.func.isRequired,
    currentMissionID: PropTypes.number.isRequired,
};

export default Status;

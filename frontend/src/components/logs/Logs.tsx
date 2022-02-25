import * as React from 'react';

import { Alert, Container, Box, Checkbox, Typography, Button, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DataObjectIcon from '@mui/icons-material/DataObject';
import ReactVirtualizedTable from "./VirtualizedTable";
import { UASUniversalLog, UniversalLogOrigin, UniversalLogType } from '../../interfaces/logging.interface';

const Logs = () => {
    let [autoscroll, setAutoscroll] = useState(true);
    // let logs = useSelector((state) => state.logger.logs);
    let logs: UASUniversalLog[] = [
        new UASUniversalLog(UniversalLogOrigin.GCOM, UniversalLogType.SUCCESS, "Started Successfully"),
        new UASUniversalLog(UniversalLogOrigin.GCOM, UniversalLogType.ERROR, "Interop connection refused"),
        new UASUniversalLog(UniversalLogOrigin.ACTIVE_AIRCRAFT_AVOIDANCE, UniversalLogType.INFO, "Waiting for mission upload..."),
        new UASUniversalLog(UniversalLogOrigin.SUNFLOWER, UniversalLogType.INFO, "GPS waiting for satellite fix"),
        new UASUniversalLog(UniversalLogOrigin.SKYPASTA, UniversalLogType.WARNING, "Missing ENV variable: SPINNAKER_OPERATION_MODE"),
        new UASUniversalLog(UniversalLogOrigin.ACOM, UniversalLogType.SUCCESS, "EKF3 IMU1 tilt alignment complete"),
        new UASUniversalLog(UniversalLogOrigin.STALKER, UniversalLogType.INFO, "Gimbal connection pending..."),
        new UASUniversalLog(UniversalLogOrigin.STALKER, UniversalLogType.SUCCESS, "Gimbal connection complete"),
        new UASUniversalLog(UniversalLogOrigin.SUNFLOWER, UniversalLogType.SUCCESS, "GPS satellite fix acquired"),
        new UASUniversalLog(UniversalLogOrigin.KRAKEN, UniversalLogType.INFO, "8 clients connected"),
        new UASUniversalLog(UniversalLogOrigin.SKYPASTA, UniversalLogType.WARNING, "Low memory [45%]")
    ];
    let logContainerRef = useRef<any>(null);

    useEffect(() => {
        if (logContainerRef.current !== null) {
            if (autoscroll) {
                let current = logContainerRef.current
                current.scrollTop = current.scrollHeight + 100
            }
        }
    }, [logs, autoscroll])

    return <Box style={{ width: 400, float: "left", textAlign: "center" }}>
        <Typography fontWeight={800} fontSize={20} style={{ padding: 20 }}>System Logs</Typography>
        <Grid container>
            <Grid item xs={6}>
                <Checkbox value={autoscroll} onChange={(evt) => {
                    setAutoscroll(evt.target.checked)
                }} /> Autoscroll
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" startIcon={<DataObjectIcon />}>Download</Button>
            </Grid>
        </Grid>
        <Box style={{ maxHeight: "calc(100vh - 300px)", padding: 0 }} ref={logContainerRef}>
            <ReactVirtualizedTable rows={logs} />
        </Box>
    </Box>
}

export default Logs;
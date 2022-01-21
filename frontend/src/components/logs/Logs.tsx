import { Alert, Container, Box, Checkbox, Typography, Button, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DataObjectIcon from '@mui/icons-material/DataObject';
import ReactVirtualizedTable from "./VirtualizedTable";
import { UniversalLog, UniversalLogOrigin, UniversalLogType } from '../../interfaces/logging.interface';

const Logs = () => {
    let [autoscroll, setAutoscroll] = useState(true);
    // let logs = useSelector((state) => state.logger.logs);
    let logs: UniversalLog[] = [
        {
            origin: UniversalLogOrigin.GCOM,
            type: UniversalLogType.SUCCESS,
            content: "Started Successfully",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.GCOM,
            type: UniversalLogType.ERROR,
            content: "Interop connection refused",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.ACTIVE_AIRCRAFT_AVOIDANCE,
            type: UniversalLogType.INFO,
            content: "Waiting for mission upload...",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.SUNFLOWER,
            type: UniversalLogType.INFO,
            content: "GPS waiting for satellite fix",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.SKYPASTA,
            type: UniversalLogType.WARNING,
            content: "Missing ENV variable: SPINNAKER_OPERATION_MODE",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.ACOM,
            type: UniversalLogType.SUCCESS,
            content: "EKF3 IMU1 tilt alignment complete",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.STALKER,
            type: UniversalLogType.INFO,
            content: "Gimbal connection pending...",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.STALKER,
            type: UniversalLogType.SUCCESS,
            content: "Gimbal connection complete",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.SUNFLOWER,
            type: UniversalLogType.SUCCESS,
            content: "GPS satellite fix acquired",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.KRAKEN,
            type: UniversalLogType.INFO,
            content: "8 clients connected",
            timestamp: new Date()
        },
        {
            origin: UniversalLogOrigin.SKYPASTA,
            type: UniversalLogType.WARNING,
            content: "Low memory [45%]",
            timestamp: new Date()
        }
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
            {/* {logs.length > 0 ? (logs.map((log) => {
                return <Alert severity={log.type}>{log.content}</Alert>
            })) : null} */}
            <ReactVirtualizedTable rows={logs} />
        </Box>
    </Box>
}

export default Logs;
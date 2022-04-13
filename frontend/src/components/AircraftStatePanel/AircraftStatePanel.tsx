import * as React from 'react';
import { useState, useEffect } from 'react';

import { Grid, Switch } from '@mui/material';
import { MavLinkHeartbeat } from '../../interfaces/heartbeat.interface';

const AircraftStatePanel = (props) => {
    const [fetchingEnabled, setFetchingEnabled] = useState(false);
    const [latestHeartbeat, setLatestHeartbeat] = useState<MavLinkHeartbeat | undefined>(undefined);
    const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<Date | undefined>(undefined);

    useEffect(() => {
        let getAircraftHeartbeatInterval = setInterval(() => {
            if (fetchingEnabled) { getAircraftHeartbeat(); };
        }, 1000);
        return () => clearInterval(getAircraftHeartbeatInterval)
    }, [fetchingEnabled])

    const getAircraftHeartbeat = () => {
        fetch("http://localhost:8080/avoidance/api/acom_heartbeat/").then(res => {
            if (res.ok) {
                res.json().then(data => {
                    setLatestHeartbeat(data);
                    setLastSuccessfulFetch(new Date());
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return <div style={{ display: props.visible ? "block" : "none", padding: 10 }}>
        <Grid container>
            <Grid item xs={12}>
                <h3>Aircraft Heartbeat <Switch checked={fetchingEnabled} onChange={() => setFetchingEnabled(!fetchingEnabled)} /></h3>
            </Grid>
            <Grid item xs={12}>
                Last successful fetch: {lastSuccessfulFetch ? lastSuccessfulFetch.toLocaleString() : "Never"}
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    MAV_TYPE
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? latestHeartbeat.type : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    AUTOPILOT
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? latestHeartbeat.autopilot : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    BASE_MODE
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? latestHeartbeat.base_mode : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    CUSTOM_MODE
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? latestHeartbeat.custom_mode : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    SYSTEM_STATUS
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? latestHeartbeat.system_status : 'No heartbeat received'}
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        MAVLINK_VERSION
                    </Grid>
                    <Grid item xs={6}>
                        {latestHeartbeat ? latestHeartbeat.mavlink_version : 'No heartbeat received'}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div >;
}

export default AircraftStatePanel
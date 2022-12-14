import * as React from 'react';
import { useState, useEffect } from 'react';

import { Grid, Switch, Button } from '@mui/material';
import { MavLinkHeartbeat, MAV_AUTOPILOT, MAV_MODE_FLAG, MAV_STATE, MAV_TYPE } from '../../interfaces/heartbeat.interface';

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

    const getEnumKey = (enumObj: any, enumValue: any) => {
        for (let key in enumObj) {
            if (enumObj[key] === enumValue) {
                return key;
            }
        }
    }

    const parseBaseMode = (baseMode: number) => {
        let bitmap = (baseMode >>> 0).toString(2).split("").reverse();
        let modes = bitmap.map((bit, index) => bit === "1" ? 2 ** index : 0).filter(mode => mode !== 0);
        let modeKeys = Object.entries(MAV_MODE_FLAG).filter(([key, value]) => modes.includes(+value)).map(([key, value]) => key);
        return modeKeys;
    }

    const armAircraft = () => {
        fetch("http://localhost:8080/avoidance/api/acom_arm/", {
            method: "PUT",
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    // do something with arm data
                })
            }
        })
    }

    const disarmAircraft = () => {
        fetch("http://localhost:8080/avoidance/api/acom_disarm/", {
            method: "PUT",
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    // do something with arm data
                })
            }
        })
    }

    const setAircraftModeManual = () => {
        fetch("http://localhost:8080/avoidance/api/acom_setmode_manual/", {
            method: "PUT",
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    // do something with arm data
                })
            }
        })
    }

    const setAircraftModeAuto = () => {
        fetch("http://localhost:8080/avoidance/api/acom_setmode_auto/", {
            method: "PUT",
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    // do something with arm data
                })
            }
        })
    }

    const setAircraftModeRTL = () => {
        fetch("http://localhost:8080/avoidance/api/acom_setmode_rtl/", {
            method: "PUT",
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    // do something with arm data
                })
            }
        })
    }

    const setAircraftModeGuided = () => {
        fetch("http://localhost:8080/avoidance/api/acom_setmode_guided/", {
            method: "PUT",
            body: JSON.stringify({})
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    // do something with arm data
                })
            }
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
                    <b>MAV_TYPE</b>
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? getEnumKey(MAV_TYPE, latestHeartbeat.type) : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    <b>AUTOPILOT</b>
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? getEnumKey(MAV_AUTOPILOT, latestHeartbeat.autopilot) : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    <b>CUSTOM_MODE</b>
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? latestHeartbeat.custom_mode : 'No heartbeat received'}
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={6}>
                    <b>SYSTEM_STATUS</b>
                </Grid>
                <Grid item xs={6}>
                    {latestHeartbeat ? getEnumKey(MAV_STATE, latestHeartbeat.system_status) : 'No heartbeat received'}
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={6}>
                        <b>MAVLINK_VERSION</b>
                    </Grid>
                    <Grid item xs={6}>
                        {latestHeartbeat ? latestHeartbeat.mavlink_version : 'No heartbeat received'}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container xs={12} spacing={1}>
                <Grid item xs={12}>
                    <h3>MODE ACTIONS</h3>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" fullWidth onClick={armAircraft}>ARM</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" fullWidth onClick={disarmAircraft}>DISARM</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" fullWidth onClick={setAircraftModeAuto}>AUTO</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" fullWidth onClick={setAircraftModeManual}>MANUAL</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" fullWidth onClick={setAircraftModeRTL}>RTL</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" fullWidth onClick={setAircraftModeGuided}>GUIDED</Button>
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={12}>
                    <h3>BASE_MODE List</h3>
                </Grid>

                <Grid item xs={12}>
                    <ul>
                        {latestHeartbeat ? parseBaseMode(latestHeartbeat.base_mode).map((x) => <li>{x}</li>) : 'No heartbeat received'}
                    </ul>
                </Grid>
            </Grid>
        </Grid>
    </div >;
}

export default AircraftStatePanel
import * as React from 'react';
import { useState, useEffect } from "react";

import IntervalTimer from 'react-interval-timer';

import { getAircraftTelem } from '../../store/actions/action-getaircrafttelem';
import { getTeamTelem } from '../../store/actions/action-getteamtelem';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Paper, Typography, Switch } from "@mui/material";
import { styled } from '@mui/material/styles';

import { TelemetryIcon } from "./TelemetryIcon";
import { UASTelemetry, UASTelemetryKey } from "../../interfaces/telemetry.interface";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function calculateTelemContainerWidth(t: UASTelemetry): number {
    let l = t.value.length + t.unit.length;
    return (l > 40) ? 6 : (l > 20) ? 4 : (l > 12) ? 3 : 2;
}
// TODO: write a type for this, then replace any with correct type
const toTelemetryArray = (aircraft: any) => {
    let telemArray = []
    if (aircraft['latitude'] && aircraft['longitude']) {
        telemArray.push(new UASTelemetry(UASTelemetryKey.GPS_POSITION, `${aircraft['latitude'].toFixed(8)}, ${aircraft['longitude'].toFixed(8)}`, ""))
    }
    if (aircraft['altitude_msl']) {
        telemArray.push(new UASTelemetry(UASTelemetryKey.ALTITUDE_MSL, `${aircraft['altitude_msl'].toFixed(2)}`, "m"))
    }
    if (aircraft['uas_heading']) {
        telemArray.push(new UASTelemetry(UASTelemetryKey.HEADING, `${aircraft['uas_heading'].toFixed(2)}`, "°"))
    }
    if (aircraft['team_id']) {
        telemArray.push(new UASTelemetry(UASTelemetryKey.TEAM_ID, `${aircraft['team_id'].toFixed(0)}`, ""))
    }
    return telemArray
}

const TelemetryPanel = (props: any) => {
    const [updatingTelemetry, setUpdatingTelemetry] = useState(false);

    const aircraft = props.aircraft;

    // let sampleAircraft: Object = {}
    // sampleAircraft[UASTelemetryKey.GPS_POSITION] = new UASTelemetry(UASTelemetryKey.GPS_POSITION, "43.231342343, -123.34234324")

    //     new UASTelemetry(UASTelemetryKey.GPS_POSITION, "43.231342343, -123.34234324"),
    //     new UASTelemetry(UASTelemetryKey.ALTITUDE_MSL, "153", "m"),
    //     new UASTelemetry(UASTelemetryKey.RUNTIME, "00:03:15"),
    //     new UASTelemetry(UASTelemetryKey.VIBRATION, "1.35", "g"),
    //     new UASTelemetry(UASTelemetryKey.BATTERY_CAPACITY, "87.93", "%"),
    //     new UASTelemetry(UASTelemetryKey.HEADING, "153.5", "°"),
    //     new UASTelemetry(UASTelemetryKey.TEMPERATURE, "11.7", "°C"),
    //     new UASTelemetry(UASTelemetryKey.SPEED, "30.4", "m/s"),
    //     new UASTelemetry(UASTelemetryKey.STORAGE, "45.6", "%"),
    //     new UASTelemetry(UASTelemetryKey.NETWORK_SPEED, "153.5", "Mbps"),
    //     new UASTelemetry(UASTelemetryKey.BATTERY_VOLTAGE, "24.9", "V")
    // ]

    // useEffect(() => {
    //     console.log("aircraft updated", aircraft)
    // }, [aircraft]);

    return <>
        <IntervalTimer
            timeout={100}
            callback={() => {
                props.getAircraftTelem()
                props.getTeamTelem()
            }
            }
            enabled={updatingTelemetry}
            repeat={true}
        />
        <Grid item container xs={6} spacing={1}>
            <Grid item xs={12}>
                <Typography fontSize={20} fontWeight={700}>System Telemetry <Switch onChange={(_, value) => {
                    setUpdatingTelemetry(value)
                }}></Switch></Typography>
            </Grid>
            <Grid item container xs={12} spacing={1} justifyContent="center" alignItems="center">
                {(aircraft ? toTelemetryArray(aircraft) : []).map((telemetryInstance) => {
                    return <Grid item container xs={calculateTelemContainerWidth(telemetryInstance)} alignItems="center" justifyContent="center">
                        <Grid item container xs={12}>
                            <Grid item xs={2} alignItems="center" justifyContent="center">
                                <TelemetryIcon telemetryKey={telemetryInstance.telemetryKey} />
                            </Grid>
                            <Grid item xs={10} alignItems="center" justifyContent="center">
                                <Typography fontWeight={100}>{telemetryInstance.value} {telemetryInstance.unit}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                })}
            </Grid>
        </Grid>
    </>
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAircraftTelem,
        getTeamTelem
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        aircraft: state.aircraft,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TelemetryPanel);
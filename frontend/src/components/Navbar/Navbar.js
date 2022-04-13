import * as React from 'react';
import { Box, Toolbar, IconButton, Container, AppBar, Drawer, Button, Tooltip, MenuItem, InputLabel, FormControl, Select, Typography } from '@mui/material';

import { makeStyles, useTheme } from "@mui/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import DnsIcon from '@mui/icons-material/Dns';
import MapIcon from '@mui/icons-material/Map';
import CameraIcon from '@mui/icons-material/Camera';
import HomeIcon from "@mui/icons-material/Home";

import { Link } from 'react-router-dom';

import UASLogo from '../../assets/img/uas_arrow.png'

import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SELECT_THEME } from "../../store/actions";
import { ADD_LOG } from '../../store/actions';
import { THEMES } from '../../utils/constants/THEMES';

import { capitalizeFirstLetter } from '../../utils/helpers/strings';

const useStyles = makeStyles((theme) => {
    return ({
        navbar: {
            zIndex: "6000 !important"
        }
    })
});


const Navbar = () => {
    const selectedTheme = useSelector((state) => state.preferences.selectedTheme);
    const dispatch = useDispatch();
    const [preferencesOpen, setPreferencesOpen] = useState(false);

    const theme = useTheme();
    const classes = useStyles(theme);

    // const randomLog = () => {
    //     const logTypes = ["info", "warning", "success", "error"]
    //     const logOrigins = ["SKPT", "GCOM", "ACOM", "STLK", "WALD", "ODLC"]
    //     const logContent = ["Telemetry Received.", "Connecting...", "Connection Error", "Transfer Complete", "Capturing Data..."]
    //     const randomItem = (items) => {
    //         return items[Math.floor(Math.random() * items.length)];
    //     }
    //     return {
    //         origin: randomItem(logOrigins),
    //         type: randomItem(logTypes),
    //         content: randomItem(logContent)
    //     }
    // }

    // setInterval(() => {
    //     dispatch({
    //         type: ADD_LOG,
    //         log: randomLog()
    //     })
    // }, 2000)

    return (
        <AppBar position="relative" color="default" style={{ height: 64 }} elevation={2} className={classes.navbar} classes={{
            root: classes.navbar
        }}>
            <Container maxWidth="xxl" color="inherit">
                <Toolbar disableGutters style={{ zIndex: 3000 }}>
                    <Tooltip title="View GitLab Repository">
                        <IconButton color="primary" href="https://gitlab.com/ubcuas" target="_blank" style={{ marginRight: 25 }}>
                            <img src={UASLogo} style={{ height: 40 }} />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        <Tooltip title="Open Mission Map">
                            <Link to="/map" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" style={{ marginRight: 10, borderRadius: 100, padding: "5px 20px" }} startIcon={<MapIcon />}>MAP</Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Open Interop Client">
                            <Link to="/interop" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" style={{ marginRight: 10, borderRadius: 100, padding: "5px 20px" }} startIcon={<DnsIcon />}>INTEROP</Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Open ODCL Panel">
                            <Link to="/odcl" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" style={{ marginRight: 10, borderRadius: 100, padding: "5px 20px" }} startIcon={<CameraIcon />}>ODCL</Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Open Home Page">
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" style={{ marginRight: 10, borderRadius: 100, padding: "5px 20px" }} startIcon={<HomeIcon />}>Home</Button>
                            </Link>
                        </Tooltip>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open Settings">
                            <IconButton onClick={() => setPreferencesOpen(true)} sx={{ p: 0 }}>
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
                <Drawer
                    anchor="right"
                    open={preferencesOpen}
                    onClose={() => setPreferencesOpen(false)}
                >
                    <Container style={{ marginTop: 30, width: 300 }}>
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 30 }} align="center">
                            Settings
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="theme-select-label">Theme</InputLabel>
                            <Select
                                labelId="theme-select-label"
                                id="theme-select"
                                value={selectedTheme}
                                label="Theme"
                                onChange={(evt) => {
                                    dispatch({ type: SELECT_THEME, selectedTheme: evt.target.value });
                                }}
                            >
                                {Object.keys(THEMES).map(themeName => {
                                    return <MenuItem value={themeName}>{capitalizeFirstLetter(themeName)}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Container>
                </Drawer>
            </Container>
        </AppBar>
    );
};
export default Navbar;
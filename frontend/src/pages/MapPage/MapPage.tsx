import * as React from "react";
import { useState } from "react";

import MapView from "../../components/MapView";
import LogsPanel from "../../components/LogsPanel";
import AircraftStatePanel from "../../components/AircraftStatePanel";
import TelemetryPanel from "../../components/TelemetryPanel";
import MissionPanel from "../../components/MissionPanel";

import { Grid, Box, Paper, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Tooltip } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const useStyles = makeStyles((theme) => {
    return ({
        drawer: {
            width: 57
        },
        drawerPaper: {
            zIndex: 600,
            width: 57,
            overflow: "hidden"
        },
        drawerPanel: {
            width: 400
        },
        drawerPanelPaper: {
            width: 400,
            zIndex: 300,
            opacity: 0.8,
            marginLeft: 57,
        }
    });
});

const MapPage = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [open, setOpen] = useState(false);
    const [currentOpen, setCurrentOpen] = useState("");

    const handleToggle = (panelName) => {
        if (currentOpen === panelName) {
            setOpen(false);
            setCurrentOpen("");
        } else {
            setOpen(true);
            setCurrentOpen(panelName);
        }
    }

    return <>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <Toolbar />
            <List>
                <Tooltip title="View System Logs" placement="right">
                    <ListItem button onClick={_ => handleToggle("logs")}>
                        <ListItemIcon>
                            <ManageSearchIcon />
                        </ListItemIcon>
                    </ListItem>
                </Tooltip>
                <Tooltip title="View Aircraft State" placement="right">
                    <ListItem button onClick={_ => handleToggle("aircraft_state")}>
                        <ListItemIcon>
                            <FlightTakeoffIcon />
                        </ListItemIcon>
                    </ListItem>
                </Tooltip>
            </List>
        </Drawer>
        <Drawer variant="persistent"
            open={open}
            className={classes.drawerPanel}
            classes={{
                paper: classes.drawerPanelPaper
            }}>
            <Toolbar />
            <LogsPanel visible={currentOpen == "logs"} />
            <AircraftStatePanel visible={currentOpen == "aircraft_state"} />
        </Drawer>
        {/* <Popover className={classes.drawerPanel} open={open} anchorOrigin={{
            horizontal: 'right',
            vertical: 'top'
        }}>
            <h3>content here</h3>
        </Popover> */}

        {/* <LogsPanel /> */}
        <MapView visibility={true} />

        <Box sx={{ flexGrow: 1 }} style={{ padding: 0, position: "fixed", width: "100%", bottom: 0, left: 0, zIndex: 3000 }}>
            <Paper style={{ textAlign: "center", padding: 10 }}>
                <Grid container spacing={1} alignItems="center" justifyContent="center">
                    <TelemetryPanel />
                    <MissionPanel />
                </Grid>
            </Paper>
        </Box>
    </>
}

export default MapPage
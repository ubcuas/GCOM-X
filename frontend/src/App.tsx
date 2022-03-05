import * as React from "react";
import { Fragment } from "react";

import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import { RootState } from "./store/reducers";

import { CssBaseline, Grid, Theme } from "@mui/material";
import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import Navbar from "./components/navbar/Navbar";
import Map from "./components/map/Map";
import Telemetry from "./components/telemetry/Telemetry";
import Logs from "./components/logs/Logs";

import { THEMES } from './utils/constants/THEMES';
import { NoEncryption } from "@mui/icons-material";

const ThemedApp = () => {

  const selectedTheme: string = useSelector((state: RootState) => state.preferences.selectedTheme);
  const theme: any = THEMES[selectedTheme as keyof typeof THEMES];

  // const theme = THEMES["bumblebee"]

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            display: 'none',
          }
        }}/>
      <CssBaseline />
      <Navbar />
      <Fragment>
        <Logs />
        <Map />
      </Fragment>
      <Telemetry />
    </ThemeProvider>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}

export default App;
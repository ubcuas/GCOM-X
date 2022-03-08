import * as React from "react";
import { Fragment } from "react";

import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import { RootState } from "./store/reducers";

import { CssBaseline } from "@mui/material";
import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import Navbar from "./components/Navbar";
import MapView from "./components/MapView";
import TelemetryPanel from "./components/TelemetryPanel";
import LogsPanel from "./components/LogsPanel";

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
        }} />
      <CssBaseline />
      <Navbar />
      <Fragment>
        <LogsPanel />
        <MapView visibility={true} />
      </Fragment>
      <TelemetryPanel />
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
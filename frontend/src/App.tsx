import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import { CssBaseline, Grid, Theme } from "@mui/material";
import { THEMES } from './utils/constants/THEMES';
import Navbar from "./components/navbar/Navbar";
import Map from "./components/map/Map";
import Telemetry from "./components/telemetry/Telemetry";
import { Fragment } from "react";
import Logs from "./components/logs/Logs";
import { RootState } from "./store/reducers";

import { ThemeProvider } from '@mui/material/styles';

const ThemedApp = () => {

  const selectedTheme: string = useSelector((state: RootState) => state.preferences.selectedTheme);
  const theme: any = THEMES[selectedTheme as keyof typeof THEMES];

  // const theme = THEMES["bumblebee"]

  return (
    <ThemeProvider theme={theme}>
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
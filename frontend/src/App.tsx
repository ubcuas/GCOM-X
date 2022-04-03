import * as React from "react";
import { Fragment } from "react";

import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import { RootState } from "./store/reducers/reducers";

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import ODCLPage from "./pages/ODCLPage";
import InteropPage from "./pages/InteropPage";

import { CssBaseline } from "@mui/material";
import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import Navbar from "./components/Navbar";

import { THEMES } from './utils/constants/THEMES';

const ThemedApp = () => {

  const selectedTheme: string = useSelector((state: RootState) => state.preferences.selectedTheme);
  const theme: any = THEMES[selectedTheme as keyof typeof THEMES];

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="interop/*" element={<InteropPage />} />
        <Route path="odcl" element={<ODCLPage />} />
        <Route
          path="*"
          element={
            <main style={{ textAlign: "center", padding: "1rem", fontSize: 45 }}>
              <p>There's nothing here! (404)</p>
            </main>
          }
        />
      </Routes>
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
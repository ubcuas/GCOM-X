import React from "react";
import { default as SurveyOptiComponent } from "./components";
import { AppProvider } from "./contex";

const SurveyOpti = () => {
  return (
    <AppProvider>
      <SurveyOptiComponent />
    </AppProvider>
  );
};

export default SurveyOpti;

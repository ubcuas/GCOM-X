// Import icon
// Access findShortestPath API
// Fix Map bugs (grey panels, working on Safari but not Chrome)

import React from "react";
import MarkerList from "../MarkerList";
import MapPanel from "../MapPanel";
import "./style.scss";

const SurveyOpti = () => {
  return (
    <section className="survey-opti">
      <MarkerList />
      <MapPanel />
    </section>
  );
};

export default SurveyOpti;

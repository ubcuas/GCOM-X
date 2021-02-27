import React from "react";
import { HashRouter } from "react-router-dom";
import Imp from "../imp";
import Interop from "../interop";
import Map from "../map";
import SurveyOpti from "../surveyopti";
import { hot } from "react-hot-loader/root";
import "./style.scss";

const Component = Object.freeze({
  INTEROP: 0,
  MAP: 1,
  IMP: 2,
  SURVEY_OPTI: 3,
});

class GCOMX extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      component: Component.INTEROP,
    };
  }
  render() {
    return (
      <div className="main">
        <div>
          <ul className="nav nav-tabs header">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => this.setState({ component: Component.INTEROP })}
              >
                Interop
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => this.setState({ component: Component.MAP })}
              >
                Map
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => this.setState({ component: Component.IMP })}
              >
                Imp
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() =>
                  this.setState({ component: Component.SURVEY_OPTI })
                }
              >
                Survey
              </button>
            </li>
          </ul>
        </div>
        <div
          className="component"
          style={{
            display:
              this.state.component === Component.MAP ? "inherit" : "none",
          }}
        >
          <Map visibility={this.state.component === Component.MAP} />
        </div>
        <div
          className="component"
          style={{
            display:
              this.state.component === Component.INTEROP ? "inherit" : "none",
          }}
        >
          <HashRouter>
            <Interop />
          </HashRouter>
        </div>
        <div
          className="component"
          style={{
            display:
              this.state.component === Component.IMP ? "inherit" : "none",
          }}
        >
          <Imp />
        </div>
        <div
          className="component"
          style={{
            display:
              this.state.component === Component.SURVEY_OPTI
                ? "inherit"
                : "none",
          }}
        >
          <SurveyOpti />
        </div>
      </div>
    );
  }
}

export default hot(GCOMX);

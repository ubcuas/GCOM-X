import React from 'react';
import { HashRouter } from 'react-router-dom';
import Imp from '../imp';
import Interop from '../interop';
import Map from '../map';
import './style.scss';

const Component = Object.freeze({
    INTEROP: 0,
    MAP: 1,
    IMP: 2,
});

class GCOMX extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            component: Component.INTEROP,
        };
    }
    render()
    {
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
                    </ul>
                </div>
                <div
                    className="component"
                    style={{
                        visibility: this.state.component === Component.MAP ? 'visible' : 'hidden',
                        height: this.state.component === Component.MAP ? '100%' : '0',
                    }}
                >
                    <Map visibility={this.state.component === Component.MAP} />
                </div>
                <div
                    className="component"
                    style={{
                        visibility: this.state.component === Component.INTEROP ? 'visible' : 'hidden',
                        height: this.state.component === Component.INTEROP ? '100%' : '0',
                    }}
                >
                    <HashRouter>
                        <Interop />
                    </HashRouter>
                </div>
                <div
                    className="component"
                    style={{
                        visibility: this.state.component === Component.IMP ? 'visible' : 'hidden',
                        height: this.state.component === Component.IMP ? '100%' : '0',
                    }}
                >
                    <Imp />
                </div>
            </div>
        );
    }
}

export default GCOMX;

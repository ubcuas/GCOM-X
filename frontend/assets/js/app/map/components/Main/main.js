import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import MapPanel from '../MapPanel';
import BottomPanel from '../BottomPanel';
import LeftPanel from '../LeftPanel';
import allReducers from '../../reducers/allReducers';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { logger } from 'redux-logger';
import './style.scss';

library.add(faSyncAlt);

/* eslint-disable no-underscore-dangle */
// const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const middlewares = [thunk];
 
if (true || process.env.NODE_ENV === `development`) { 
    // TODO: add development to node_ENV
    middlewares.push(logger);
}
 
const store = compose(applyMiddleware(...middlewares))(createStore)(allReducers);
/* eslint-enable */

/*
 * Main view for map
 */

class Main extends React.Component
{
    render()
    {
        return (
            <Provider store={store}>
                <div className="full-height container-fluid">
                    <MapPanel visibility={this.props.visibility} />
                    {/* <LeftPanel />
                    <BottomPanel /> */}
                </div>
            </Provider>
        );
    }
}

export default Main;

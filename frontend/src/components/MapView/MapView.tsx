import React from 'react';

import MapPanel from './MapPanel';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';


import './style.scss';

library.add(faSyncAlt);

const MapView = ({ visibility }) => {
    return (
        <div className="full-height container-fluid">
            <MapPanel visibility={visibility} />
        </div>
    );
}

export default MapView;

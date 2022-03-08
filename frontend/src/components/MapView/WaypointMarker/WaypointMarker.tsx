import React from 'react';
import { bindActionCreators } from 'redux';
import { updateMarker } from '../actions/action-updatemarker';
import { useDispatch } from 'react-redux';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { selectMarker } from '../actions/action-selectmarker';

const WaypointMarker = ({ marker, icon }) => {
    const dispatch = useDispatch();

    const handleMoveEnd = (e) => {
        // dispatch(updateMarker(marker.order, e.target.getLatLng().lat, e.target.getLatLng().lng, marker.altitude));
    };

    const handleClick = (e) => {
        // dispatch(selectMarker(marker.order));
    }

    return (
        <Marker
            position={[marker.latitude, marker.longitude]}
            id={marker.order}
            draggable={marker.is_generated}
            onMoveend={handleMoveEnd}
            onclick={handleClick}
            icon={icon}
        />
    )
};

export default WaypointMarker;
import React from 'react';
import { bindActionCreators } from 'redux';
import { updateMarker } from '../../actions/action-updatemarker';
import { useDispatch } from 'react-redux';
import { Marker, Popup } from 'react-leaflet';

const WaypointMarker = ({ marker, icon }) => {
    const dispatch = useDispatch();

    const handleMoveEnd = (e) => {
        dispatch(updateMarker(e.target.options.id, e.target.getLatLng().lat, e.target.getLatLng().lng));
    };

    return (
        <Marker
            position={[marker.latitude, marker.longitude]}
            id={marker.order}
            draggable={marker.is_generated}
            onMoveend={handleMoveEnd}
            icon={icon}
        >
            <Popup>
                <span>{marker.wp_type}</span>
            </Popup>
        </Marker>
    )
};

export default WaypointMarker;
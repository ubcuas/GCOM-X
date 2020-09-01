/* eslint-disable no-underscore-dangle */
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer, LayersControl, Polyline, Circle, Polygon, MapControl } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addMarker } from '../../actions/action-addmarker';

import WaypointMarker from '../WaypointMarker';

import WaypointEditor from '../WaypointEditor';
import BottomPanel from '../BottomPanel';
import LeftPanel from '../LeftPanel';

// icons
import './style.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet.offline';

const markerIcon = '/static/images/marker-icon.png';
const markerIcon2x = '/static/images/marker-icon@2x.png';
const markerIconShadow = '/static/images/marker-shadow.png';
const aircraftImg = '/static/images/droneicon.png';
const grayIcon = '/static/images/graymarker-icon.png';
const grayIcon2x = '/static/images/graymarker-icon@2x.png';
const autoIcon = '/static/images/auto_flight.png';
const autoIcon2x = '/static/images/auto_flight@2x.png';
const searchIcon = '/static/images/search_grid.png';
const searchIcon2x = '/static/images/search_grid@2x.png';
const axisIcon = '/static/images/off_axis.png';
const axisIcon2x = '/static/images/off_axis@2x.png';
const downloadIcon = '/static/images/save.png';

const { BaseLayer } = LayersControl;

const regularBlueIcon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerIconShadow,
    iconSize: new L.Point(25, 41),
    iconAnchor: [12.5, 41],
});

const autoBlueIcon = L.icon({
    iconRetinaUrl: autoIcon2x,
    iconUrl: autoIcon,
    shadowUrl: markerIconShadow,
    iconSize: new L.Point(25, 41),
    iconAnchor: [12.5, 41],
});

const searchBlueIcon = L.icon({
    iconRetinaUrl: searchIcon2x,
    iconUrl: searchIcon,
    shadowUrl: markerIconShadow,
    iconSize: new L.Point(25, 41),
    iconAnchor: [12.5, 41],
});

const axisBlueIcon = L.icon({
    iconRetinaUrl: axisIcon2x,
    iconUrl: axisIcon,
    shadowUrl: markerIconShadow,
    iconSize: new L.Point(25, 41),
    iconAnchor: [12.5, 41],
});

const defaultIcon = L.icon({
    iconRetinaUrl: grayIcon2x,
    iconUrl: grayIcon,
    shadowUrl: markerIconShadow,
    iconSize: new L.Point(25, 41),
    iconAnchor: [12.5, 41],
});

function flattenWaypointsToCoords(waypoints)
{
    return waypoints.map(marker => [marker.latitude, marker.longitude]);
}

function flattenCoordinateObjects(obstacleObjs)
{
    return obstacleObjs.map(obstacle => L.latLng(obstacle.latitude, obstacle.longitude));
}


/*
 *  Offline layer implementation
 */
class OfflineTileLayer extends TileLayer
{
    createLeafletElement() {
        return new L.tileLayer.offline('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                minZoom: 5,
                maxZoom: 20,
                crossOrigin: true,
            }
        );
    }
}

const otl = new L.tileLayer.offline('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    minZoom: 5,
    maxZoom: 20,
    crossOrigin: true,
});

/*
 *  Offline Control implementation
 */
class OfflineControl extends MapControl
{
    createLeafletElement() {
        return new L.control.savetiles(otl, {
            position: 'bottomright',
            saveText: '<img src="'+downloadIcon+'"/>',
            rmText: '✖',
            zoomlevels: [13,18],
            maxZoom: 20,
            saveWhatYouSee: false,
            bounds: null,
            confirm: function(layer, successCallback) {
                if (window.confirm("Save " + layer._tilesforSave.length)) {
                    successCallback();
                }
            },
            confirmRemoval: function(layer, successCallback) {
                if (window.confirm("Remove all " + layer.storagesize + " tiles?")) {
                    successCallback();
                }
            },
        });
    }
}

/*
 * Top Level Component for MapPanel Module
 */
const MapPanel = ({ visibility }) => {
    console.log('rerender')
    const dispatch = useDispatch();

    const aircraft = useSelector(state => state.aircraft);
    const mapProps = useSelector(state => state.mapProps);
    const { markers, selectedMarker } = useSelector(state => state.markers);
    const obstacles = useSelector(state => state.obstacles);
    const newAltitude = useSelector(state => state.newAlt);
    const flyzone = useSelector(state => state.flyzone);

    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map && visibility) {
            map.leafletElement.invalidateSize()
        }
    }, [visibility]);

    function getNextMarkerId() {
        if (markers.length)
            return markers.length + 1;
        return 1;
    }

    function switchMarker(marker) {
        if (marker.order === selectedMarker) {
            return regularBlueIcon;
        }

        if (!marker.is_generated)
            return defaultIcon;

        switch(marker.wp_type) {
            case "search_grid":
                return searchBlueIcon;
            case "auto_flight":
                return autoBlueIcon;
            case "off_axis":
                return axisBlueIcon;
            default:
                return defaultIcon;
        }
    }

    // constants
    const aircraftIcon = L.icon({
        iconUrl: aircraftImg,
        iconSize: [50, 50],
    });

    // render aircraft
    const aircraftMarker = aircraft => (
        <Marker position={[aircraft.latitude, aircraft.longitude]} key="aircraft" icon={aircraftIcon} draggable={true} />
    );

    // render waypoints
    const waypoints = markers.map(marker => (
        <WaypointMarker
            key={marker.order}
            marker={marker}
            icon={switchMarker(marker)}
        />
    ));

    // render waypointCircles
    const waypointsCircles = markers.map((marker, index) => (
            <Circle
                radius={2}  // 100 feet radius (30.48m)
                center={[marker.latitude, marker.longitude]}
                color="blue"
                key={index}
                stroke={!marker.is_generated}
                fill={!marker.is_generated}
            />
    ));

    // render obstacles
    const obstaclePolygons = obstacles.map((obstacle, index) => (
        <Polygon
            positions={flattenCoordinateObjects(obstacle)}
            key={index}
            color="yellow"
        />
    ));

    // render fly zone
    const flyzonePolygon = (
        <Polygon
            positions={flattenCoordinateObjects(flyzone.points)}
            color="red"
        />
    );

    // render polylines
    const polyLines = points => (
        <Polyline positions={points} />
    );

    const consoleLogGPS = (e) => {
        const latlon = e.latlng;
        console.log(latlon.lat, latlon.lng);
    };

    const onClick = (e) => {
        dispatch(addMarker(getNextMarkerId(), e.latlng.lat, e.latlng.lng, newAltitude));
    };

    const onRightClick = (e) => {
        consoleLogGPS(e);
    };

    const position = [mapProps.latitude, mapProps.longitude];

    return (
        // map layer
        <>
            <div class="draggable-container">
                <WaypointEditor />
                <LeftPanel />
                <BottomPanel />
            </div>
            <Map
                className="map leaflet-container"
                center={position}
                zoom={mapProps.zoom}
                onClick={onClick}
                onContextMenu={onRightClick}
                attributionControl={false}
                zoomControl={false}
                ref={(ref) => setMap(ref)}
            >
                {/* Leaflet layers */}
                <OfflineTileLayer
                    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                <OfflineControl></OfflineControl>

                {/* Render aircraft */}
                {aircraftMarker(aircraft)}

                {/* Render the markers, obstacles and polylines */}
                {waypoints}
                {waypointsCircles}
                {obstaclePolygons}
                {flyzonePolygon}
                {polyLines(flattenWaypointsToCoords(markers))}
                
            </Map>
        </>
    );
}

// const waypointPropType = PropTypes.shape({
//     id: PropTypes.any,
//     latlng: PropTypes.array,
// });

// const mapPropPropType = PropTypes.shape({
//     lat: PropTypes.number,
//     lng: PropTypes.number,
//     zoom: PropTypes.number,
// });

// const aircraftPropType = PropTypes.shape({
//     marker: waypointPropType,
// });

// MapPanel.propTypes = {
//     aircraft: aircraftPropType.isRequired,
//     markers: PropTypes.arrayOf(waypointPropType).isRequired,
//     mapProps: mapPropPropType.isRequired,
//     addMarker: PropTypes.func.isRequired,
// };

export default MapPanel;

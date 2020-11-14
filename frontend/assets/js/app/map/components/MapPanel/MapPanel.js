/* eslint-disable no-underscore-dangle */
import React, {useEffect, useState } from 'react';
import { Map, Marker, LayersControl, Polyline, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker } from '../../actions/action-addmarker';

import WaypointMarker from '../WaypointMarker';

import WaypointEditor from '../WaypointEditor';
import BottomPanel from '../BottomPanel';
import LeftPanel from '../LeftPanel';

import OfflineControl from './OfflineControl';
import OfflineTileLayer from './OfflineTileLayer';

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

const numberedIcon = (num, colour="#ffffff") => (
    L.divIcon({
        className: '',
        html: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"<style type="text/css">.st0{fill:' + colour + ';}</style><path fill="' + colour + '" class="st0" d="M256,0C145.39,0,55.73,89.66,55.73,200.27c0,48.39,17.16,92.77,45.73,127.39h-0.81L256,512l154.54-184.34c28.57-34.62,45.73-79,45.73-127.39C456.27,89.66,366.61,0,256,0z"/><text style="font-size:200px" dominant-baseline="middle" text-anchor="middle" x="50%" y="40%">' + num + '</text></svg>',
        iconSize: new L.Point(41, 41),
        iconAnchor: [20.5, 41],
}));

function flattenWaypointsToCoords(waypoints)
{
    return waypoints.map(marker => [marker.latitude, marker.longitude]);
}

function flattenCoordinateObjects(obstacleObjs)
{
    return obstacleObjs.map(obstacle => L.latLng(obstacle.latitude, obstacle.longitude));
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

    const offlineTileLayer = new L.tileLayer.offline('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 5,
        maxZoom: 20,
        crossOrigin: true,
    });

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
            return numberedIcon(marker.order, "#00a2ff");
        }

        if (!marker.is_generated)
            return numberedIcon(marker.order, "#cccccc");

        switch(marker.wp_type) {
            case "search_grid":
                return searchBlueIcon;
            case "auto_flight":
                return autoBlueIcon;
            case "off_axis":
                return axisBlueIcon;
            default:
                return numberedIcon(marker.order, "#cccccc");
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
    };

    const onRightClick = (e) => {
        dispatch(addMarker(e.latlng.lat, e.latlng.lng, newAltitude));
    };

    const position = [mapProps.latitude, mapProps.longitude];

    return (
        // map layer
        <>
            <div className="draggable-container">
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
                    tileLayer={offlineTileLayer}
                />

                <OfflineControl
                    tileLayer={offlineTileLayer}
                />

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

export default MapPanel;

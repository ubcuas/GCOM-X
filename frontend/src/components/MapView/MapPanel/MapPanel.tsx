import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Polygon } from 'react-leaflet'
// import { navIcon } from './navIcon';

import WaypointMarker from '../WaypointMarker/WaypointMarker';
import { Icon, divIcon } from 'leaflet'
import './MapPanel.css';
import { LAYOUT } from "../../../utils/constants/LAYOUT.js"

import WaypointEditor from '../WaypointEditor';
import BottomPanel from '../BottomPanel';
import LeftPanel from '../LeftPanel';

import { useDispatch, useSelector } from 'react-redux';
import { addMarker } from '../../../store/actions/action-addmarker';

// import OfflineControl from './OfflineControl';
// import OfflineTileLayer from './OfflineTileLayer';

import aircraftIcon from '../../../assets/img/navigation@2x.png';
import planeIcon from '../../../assets/img/plane.png';
import circleIcon from '../../../assets/img/circle@2x.png';
import markerIcon from '../../../assets/img/marker-icon.png';
import markerIcon2x from '../../../assets/img/marker-icon@2x.png';
import markerIconShadow from '../../../assets/img/marker-shadow.png';
import grayIcon from '../../../assets/img/graymarker-icon.png';
import grayIcon2x from '../../../assets/img/graymarker-icon@2x.png';
import autoIcon from '../../../assets/img/auto_flight.png';
import autoIcon2x from '../../../assets/img/auto_flight@2x.png';
import searchIcon from '../../../assets/img/search_grid.png';
import searchIcon2x from '../../../assets/img/search_grid@2x.png';
import axisIcon from '../../../assets/img/off_axis.png';
import axisIcon2x from '../../../assets/img/off_axis@2x.png';

const makeMarkerIcon = (iconRetinaUrl, iconUrl) => L.icon({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: markerIconShadow,
    iconSize: new L.Point(25, 41),
    iconAnchor: [12.5, 41],
});

const regularBlueIcon = makeMarkerIcon(markerIcon2x, markerIcon);
const autoBlueIcon = makeMarkerIcon(autoIcon2x, autoIcon);
const searchBlueIcon = makeMarkerIcon(searchIcon2x, searchIcon);
const axisBlueIcon = makeMarkerIcon(axisIcon2x, axisIcon);
const defaultIcon = makeMarkerIcon(grayIcon2x, grayIcon);

const aircraftIconWithHeading = (heading) => {
    let aircraftIconSize = 30; //in pixels
    return L.divIcon({
        iconSize: [aircraftIconSize, aircraftIconSize],
        iconAnchor: [aircraftIconSize / 2, aircraftIconSize / 2],
        className: '',
        html: `<img class="leaflet-marker-icon leaflet-zoom-animated" src=${aircraftIcon} style="width: ${aircraftIconSize}px; height: ${aircraftIconSize}px; transform-origin: ${aircraftIconSize / 2}px ${aircraftIconSize / 2}px; transform: rotate(${heading}deg);" />`
    });
}


const planeIconWithHeading = (heading) => {
    let aircraftIconSize = 30; //in pixels
    return divIcon({
        iconSize: [aircraftIconSize, aircraftIconSize],
        iconAnchor: [aircraftIconSize / 2, aircraftIconSize / 2],
        className: '',
        html: `<img class="leaflet-marker-icon leaflet-zoom-animated" src=${planeIcon} style="width: ${aircraftIconSize}px; height: ${aircraftIconSize}px; transform-origin: ${aircraftIconSize / 2}px ${aircraftIconSize / 2}px; transform: rotate(${heading}deg);" />`
    });
}

function flattenWaypointsToCoords(waypoints) {
    return waypoints.map(marker => [marker.latitude, marker.longitude]);
}

function flattenCoordinateObjects(obstacleObjs) {
    return obstacleObjs.map(obstacle => L.latLng(obstacle.latitude, obstacle.longitude));
}

const numberedIcon = (num, colour = "#ffffff") => (
    divIcon({
        className: '',
        html: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"<style type="text/css">.st0{fill:' + colour + ';}</style><path fill="' + colour + '" class="st0" d="M256,0C145.39,0,55.73,89.66,55.73,200.27c0,48.39,17.16,92.77,45.73,127.39h-0.81L256,512l154.54-184.34c28.57-34.62,45.73-79,45.73-127.39C456.27,89.66,366.61,0,256,0z"/><text style="font-size:200px" dominant-baseline="middle" text-anchor="middle" x="50%" y="40%">' + num + '</text></svg>',
        iconSize: new L.Point(41, 41),
        iconAnchor: [20.5, 41],
    }));

const MapPanel = ({ visibility }) => {
    const DEFAULT_PROVIDER = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    // Dark tiles: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"

    const dispatch = useDispatch();

    const aircraft = useSelector(state => state.aircraft);
    const teams = useSelector(state => state.teams);
    const mapProps = useSelector(state => state.mapProps);
    const { markers, selectedMarker } = useSelector(state => state.markers);
    const obstacles = useSelector(state => state.obstacles);
    const newAltitude = useSelector(state => state.newAlt);
    const flyzone = useSelector(state => state.flyzone);

    const [map, setMap] = useState(null);

    // const offlineTileLayer = new L.tileLayer.offline('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //     minZoom: 5,
    //     maxZoom: 20,
    //     crossOrigin: true,
    // });

    useEffect(() => {
        if (map && visibility) {
            map.leafletElement.invalidateSize()
        }
    }, [visibility]);

    function switchMarker(marker) {
        if (marker.order === selectedMarker) {
            return numberedIcon(marker.order, "#00a2ff");
        }

        if (!marker.is_generated)
            return numberedIcon(marker.order, "#cccccc");

        switch (marker.wp_type) {
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

    // render aircraft
    const aircraftMarker = aircraft => (
        <>
            <Marker position={[aircraft.latitude, aircraft.longitude]} icon={new Icon({ iconUrl: circleIcon, iconSize: [46, 46], iconAnchor: [23, 23] })}></Marker>
            <Marker position={[aircraft.latitude, aircraft.longitude]} icon={aircraftIconWithHeading(aircraft.uas_heading)} />
        </>
    );

    const teamMarkers = (teams) => {
        if (teams.length > 0) {
            return teams.map(team => {
                const teamText = divIcon({ iconAnchor: [-15, -15], html: `<div style="color:black;background:white;width:46px;padding:5px;text-align:center;font-weight:600;border-radius:0px 100px 100px 100px;position:relative;"># ${team.team_id}</div>` });
                return <>
                    <Marker position={[team.latitude - 0.000015, team.longitude]} icon={teamText} />
                    <Marker position={[team.latitude, team.longitude]} icon={new Icon({ iconUrl: circleIcon, iconSize: [46, 46], iconAnchor: [23, 23] })}></Marker>
                    <Marker position={[team.latitude, team.longitude]} icon={planeIconWithHeading(team.uas_heading)} />
                </>
            })
        }
    }

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

    const onClick = (e) => {
    };

    const onRightClick = (e) => {
        dispatch(addMarker(e.latlng.lat, e.latlng.lng, newAltitude));
    };

    const position = [mapProps.latitude, mapProps.longitude];

    return <>
        {/* TODO: Add functionality from these into new GCOM UI */}
        {/* <div className="draggable-container">
            <WaypointEditor />
            <BottomPanel />
        </div> */}

        <MapContainer
            className="map leaflet-container"
            center={position}
            zoom={mapProps.zoom}
            onClick={onClick}
            onContextMenu={onRightClick}
            attributionControl={false}
            zoomControl={false}
            ref={(ref) => setMap(ref)}
            style={{ height: `calc(100vh - 64px)`, width: `100vw` }}>
            <TileLayer
                url={DEFAULT_PROVIDER}
            />

            {/* <OfflineTileLayer
                tileLayer={offlineTileLayer}
            />

            <OfflineControl
                tileLayer={offlineTileLayer}
            /> */}

            {waypoints}
            {waypointsCircles}
            {obstaclePolygons}
            {flyzonePolygon}
            {polyLines(flattenWaypointsToCoords(markers))}
            {aircraftMarker(aircraft)}
            {teamMarkers(teams)}

        </MapContainer>
    </>
}

export default MapPanel;
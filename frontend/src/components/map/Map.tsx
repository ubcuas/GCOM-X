import * as React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Polygon } from 'react-leaflet'
// import { navIcon } from './navIcon';
import droneIcon from "../../assets/img/droneicon.png"
import WaypointMarker from './WaypointMarker';
import { Icon } from 'leaflet'
import './Map.css';
import { LAYOUT } from "../../utils/constants/LAYOUT.js"

import markerIcon from '../../assets/img/marker-icon.png';
import markerIcon2x from '../../assets/img/marker-icon@2x.png';
import markerIconShadow from '../../assets/img/marker-shadow.png';
import aircraftImg from '../../assets/img/droneicon.png';
import grayIcon from '../../assets/img/graymarker-icon.png';
import grayIcon2x from '../../assets/img/graymarker-icon@2x.png';
import autoIcon from '../../assets/img/auto_flight.png';
import autoIcon2x from '../../assets/img/auto_flight@2x.png';
import searchIcon from '../../assets/img/search_grid.png';
import searchIcon2x from '../../assets/img/search_grid@2x.png';
import axisIcon from '../../assets/img/off_axis.png';
import axisIcon2x from '../../assets/img/off_axis@2x.png';

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

function flattenWaypointsToCoords(waypoints) {
    return waypoints.map(marker => [marker.latitude, marker.longitude]);
}

function flattenCoordinateObjects(obstacleObjs) {
    return obstacleObjs.map(obstacle => L.latLng(obstacle.latitude, obstacle.longitude));
}

const obstacles = [
    [
        {
            "order": 1,
            "latitude": 38.148546732881066,
            "longitude": -76.4326142579021,
            "altitude": 35.0,
            "is_generated": true,
            "wp_type": "obstacle"
        },
        {
            "order": 2,
            "latitude": 38.14702941370004,
            "longitude": -76.43381589969329,
            "altitude": 75.0,
            "is_generated": false,
            "wp_type": "obstacle"
        },
        {
            "order": 3,
            "latitude": 38.14699569513757,
            "longitude": -76.43143407400004,
            "altitude": 75.0,
            "is_generated": false,
            "wp_type": "obstacle"
        },
        {
            "order": 4,
            "latitude": 38.14849615608351,
            "longitude": -76.43094054255006,
            "altitude": 75.0,
            "is_generated": false,
            "wp_type": "obstacle"
        }
    ],
    [
        {
            "order": 1,
            "latitude": 38.151448114086996,
            "longitude": -76.42867330961295,
            "altitude": 35.0,
            "is_generated": true,
            "wp_type": "obstacle"
        },
        {
            "order": 2,
            "latitude": 38.15060465941251,
            "longitude": -76.42956340990511,
            "altitude": 75.0,
            "is_generated": false,
            "wp_type": "obstacle"
        },
        {
            "order": 3,
            "latitude": 38.15047814037012,
            "longitude": -76.42789045031984,
            "altitude": 75.0,
            "is_generated": false,
            "wp_type": "obstacle"
        },
        {
            "order": 4,
            "latitude": 38.15115290606041,
            "longitude": -76.42672152343013,
            "altitude": 75.0,
            "is_generated": false,
            "wp_type": "obstacle"
        }
    ]
];

const markers = [
    {
        "order": 1,
        "latitude": 38.142544,
        "longitude": -76.434088,
        "altitude": 60.96,
        "is_generated": false,
        "wp_type": "auto_flight"
    },
    {
        "order": 2,
        "latitude": 38.1423100837495,
        "longitude": -76.4311846091267,
        "altitude": 35.0,
        "is_generated": true,
        "wp_type": "search_grid"
    },
    {
        "order": 3,
        "latitude": 38.14836,
        "longitude": -76.42798,
        "altitude": 75.0,
        "is_generated": false,
        "wp_type": "auto_flight"
    }
];

const selectedMarker = null;

const flyzone = {
    "min": 0,
    "max": 228.6,
    "points": [
        {
            "order": 1,
            "latitude": 38.15412827054356,
            "longitude": -76.42982426748127,
            "altitude": null,
            "is_generated": false,
            "wp_type": "flyzone"
        },
        {
            "order": 2,
            "latitude": 38.13893032305061,
            "longitude": -76.44252733784535,
            "altitude": null,
            "is_generated": false,
            "wp_type": "flyzone"
        },
        {
            "order": 3,
            "latitude": 38.13771435047266,
            "longitude": -76.41591955532596,
            "altitude": null,
            "is_generated": false,
            "wp_type": "flyzone"
        }
    ]
};

const aircraft = {
    "latitude": 38.14103255191606,
    "longitude": -76.4277644832984,
    "uas_heading": 90,
    "altitude_msl": 23,
};

const numberedIcon = (num, colour = "#ffffff") => (
    L.divIcon({
        className: '',
        html: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"<style type="text/css">.st0{fill:' + colour + ';}</style><path fill="' + colour + '" class="st0" d="M256,0C145.39,0,55.73,89.66,55.73,200.27c0,48.39,17.16,92.77,45.73,127.39h-0.81L256,512l154.54-184.34c28.57-34.62,45.73-79,45.73-127.39C456.27,89.66,366.61,0,256,0z"/><text style="font-size:200px" dominant-baseline="middle" text-anchor="middle" x="50%" y="40%">' + num + '</text></svg>',
        iconSize: new L.Point(41, 41),
        iconAnchor: [20.5, 41],
    }));

const Map = () => {
    const DEFAULT_PROVIDER = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    // Dark tiles: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"


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
        <Marker position={[38.147, -76.427956]} icon={new Icon({ iconUrl: droneIcon, iconSize: [40, 40], iconAnchor: [20, 20] })}></Marker>
        // <Marker position={[aircraft.latitude, aircraft.longitude]} key="aircraft" icon={aircraftIcon} draggable={true} />
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

    return <MapContainer center={[38.147, -76.427956]} zoom={16} scrollWheelZoom={true} style={{ height: `calc(100vh - 64px)`, width: `calc(100vw - ${LAYOUT.sidebar_width})` }}>
        <TileLayer
            url={DEFAULT_PROVIDER}
        />
        {aircraftMarker(aircraft)}
        {waypoints}
        {waypointsCircles}
        {obstaclePolygons}
        {flyzonePolygon}
        {polyLines(flattenWaypointsToCoords(markers))}
    </MapContainer>
}

export default Map;
import * as React from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import { navIcon } from './navIcon';
import droneIcon from "../../assets/img/droneicon.png"
import { Icon } from 'leaflet'
import './Map.css';

const Map = () => {
    const DEFAULT_PROVIDER = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    // Dark tiles: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"

    return <MapContainer center={[38.147, -76.427956]} zoom={16} scrollWheelZoom={true} style={{ height: "calc(100vh - 64px)", width: "calc(100vw - 400px)" }}>
        <TileLayer
            url={DEFAULT_PROVIDER}
        />
        <Marker position={[38.147, -76.427956]} icon={new Icon({ iconUrl: droneIcon, iconSize: [40, 40], iconAnchor: [20, 20] })}>
        </Marker>
    </MapContainer>
}

export default Map;
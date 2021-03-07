import React, { useState } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L, { marker } from "leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";
import "./style.scss";
import { useGlobalContext } from "../../contex";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapPanel = () => {
  const { markers, setMarkers } = useGlobalContext();

  const addMarker = (e) => {
    const newMarkers = [...markers, { id: markers.length, position: e.latlng }];
    console.log(newMarkers);
    setMarkers(newMarkers);
  };

  return (
    <section className="map-panel">
      <Map
        style={{ height: "90vh", flex: 1 }}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        onContextMenu={addMarker}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers &&
          markers.map(({ id, position }) => (
            <Marker key={id} position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}
      </Map>
    </section>
  );
};

export default MapPanel;

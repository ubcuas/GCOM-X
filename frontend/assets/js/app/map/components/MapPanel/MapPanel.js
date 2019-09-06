/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer, LayersControl, Polyline, Circle, Polygon, MapControl } from 'react-leaflet';
import L from 'leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addMarker } from '../../actions/action-addmarker';
import { updateMarker } from '../../actions/action-updatemarker';

// icons
import './style.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet.offline';

const markerIcon = 'leaflet/dist/images/marker-icon.png';
const markerIcon2x = 'leaflet/dist/images/marker-icon@2x.png';
const markerIconShadow = 'leaflet/dist/images/marker-shadow.png';
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
class MapPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = null;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.visibility && this.props.visibility) {
            this.map.leafletElement.invalidateSize()
        }
    }

    getNextMarkerId()
    {
        if (this.props.markers.length)
            return this.props.markers.length + 1;
        return 1;
    }

    switchMarker(marker)
    {
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

    render()
    {
        // constants
        const aircraftIcon = L.icon({
            iconUrl: aircraftImg,
            iconSize: [50, 50],
        });

        // render aircraft
        const aircraftMarker = aircraft => (
            <Marker position={[aircraft.latitude, aircraft.longitude]} key="aircraft" icon={aircraftIcon} draggable={true} />
        );

        const updateMarker = (e) =>
        {
            console.log(e.target.options.id);
            this.props.updateMarker(this.props, e.target.options.id, e.target.getLatLng().lat, e.target.getLatLng().lng);
        };

        // render waypoints
        const waypoints = this.props.markers.map(marker => (
            <Marker
                position={[marker.latitude, marker.longitude]}
                id={marker.order}
                key={marker.order}
                draggable={marker.is_generated}
                onMoveend={updateMarker}
                icon={this.switchMarker(marker)}
            >
                <Popup>
                    <span>{marker.wp_type}</span>
                </Popup>
            </Marker>
        ));

        // render waypointCircles
        const waypointsCircles = this.props.markers.map((marker, index) => (
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
        const obstacles = this.props.obstacles.map((obstacle, index) => (
            <Polygon
                positions={flattenCoordinateObjects(obstacle)}
                key={index}
                color="yellow"
            />
        ));

        // render fly zone
        const flyzone = (
            <Polygon
                positions={flattenCoordinateObjects(this.props.flyzone.points)}
                color="red"
            />
        );

        // render polylines
        const polyLines = points => (
            <Polyline positions={points} />
        );

        const consoleLogGPS = (e) =>
        {
            const latlon = e.latlng;
            console.log(latlon.lat, latlon.lng);
        };

        const onClick = (e) =>
        {
            this.props.addMarker(e, this.props, this.getNextMarkerId(), this.props.newAltitude);
        };

        const onRightClick = (e) =>
        {
            consoleLogGPS(e);
        };

        const position = [this.props.mapProps.latitude, this.props.mapProps.longitude];

        return (
            // map layer
            <Map
                className="map leaflet-container"
                center={position}
                zoom={this.props.mapProps.zoom}
                onClick={onRightClick}
                onContextMenu={onClick}
                attributionControl={false}
                zoomControl={false}
                ref={(map) =>
                {
                    this.map = map;
                }}
            >
                {/* Leaflet layers */}
                <OfflineTileLayer
                    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                <OfflineControl></OfflineControl>

                {/* Render aircraft */}
                {aircraftMarker(this.props.aircraft)}

                {/* Render the markers, obstacles and polylines */}
                {waypoints}
                {waypointsCircles}
                {obstacles}
                {flyzone}
                {polyLines(flattenWaypointsToCoords(this.props.markers))}
            </Map>
        );
    }
}

const waypointPropType = PropTypes.shape({
    id: PropTypes.any,
    latlng: PropTypes.array,
});

const mapPropPropType = PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    zoom: PropTypes.number,
});

const aircraftPropType = PropTypes.shape({
    marker: waypointPropType,
});

MapPanel.propTypes = {
    aircraft: aircraftPropType.isRequired,
    markers: PropTypes.arrayOf(waypointPropType).isRequired,
    mapProps: mapPropPropType.isRequired,
    addMarker: PropTypes.func.isRequired,
};

function mapStateToProps(state)
{
    return {
        aircraft: state.aircraft,
        mapProps: state.mapProps,
        markers: state.markers,
        obstacles: state.obstacles,
        newAltitude: state.newAlt,
        flyzone: state.flyzone
    };
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        addMarker,
        updateMarker,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapPanel);

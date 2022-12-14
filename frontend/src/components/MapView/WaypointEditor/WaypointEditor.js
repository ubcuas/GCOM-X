import React, { useEffect, useState } from 'react';
import { updateMarker, deleteMarker } from '../../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import DraggableContainer from '../../common/DraggableContainer';

import { Container, Row, Col, Button } from 'react-bootstrap';

import './style.scss';

const WaypointEditor = () => {
    const dispatch = useDispatch();

    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);

    const selectedMarker = useSelector((state) => {
        if (state.markers.selectedMarker) {
            return state.markers.markers[state.markers.selectedMarker - 1];
        } else {
            return null;
        }
    })

    useEffect(() => {
        // update state when selected marker has been changed
        if (selectedMarker) {
            setLatitude(selectedMarker.latitude);
            setLongitude(selectedMarker.longitude);
            setAltitude(selectedMarker.altitude);
        }
    }, selectedMarker);


    const title = !selectedMarker ? 'Edit Waypoint' : `Editing Waypoint ${selectedMarker.order}`;

    function handleClickReset() {
        setLatitude(selectedMarker.latitude);
        setLongitude(selectedMarker.longitude);
        setAltitude(selectedMarker.altitude);
    }

    function handleClickUpdate() {
        dispatch(updateMarker(selectedMarker.order, latitude, longitude, altitude));
    }

    function handleClickDelete() {
        dispatch(deleteMarker(selectedMarker.order));
    }

    return (
        <DraggableContainer
            title={title}
            width={250}
            top={'30%'}
            right={0}
        >
            {selectedMarker ?
                <Container id="waypoint-editor">
                    <Row>
                        <Col xs={12}>
                            <label htmlFor="lat">Latitude (°)</label>
                            <input
                                type="number"
                                value={latitude}
                                onChange={(e) => { setLatitude(parseInt(e.target.value)) }}
                                className="form-control"
                                id="waypoint-editor-lat"
                                placeholder="Latitude"
                            />
                        </Col>
                        <Col xs={12}>
                            <label htmlFor="lat">Longitude (°)</label>
                            <input
                                type="number"
                                value={longitude}
                                onChange={(e) => { setLongitude(parseInt(e.target.value)) }}
                                className="form-control"
                                id="waypoint-editor-lng"
                                placeholder="Longitude"
                            />
                        </Col>
                        <Col xs={12}>
                            <label htmlFor="lat">Altitude AGL (m)</label>
                            <input
                                type="number"
                                value={altitude}
                                onChange={(e) => { setAltitude(parseInt(e.target.value)) }}
                                className="form-control"
                                id="waypoint-editor-alt"
                                placeholder="Altitude"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col><Button onClick={handleClickUpdate} variant="primary" block>Update</Button></Col>
                        <Col><Button onClick={handleClickReset} variant="secondary" block>Reset</Button></Col>
                    </Row>
                    <Row className="mt-2">
                        <Col><Button onClick={handleClickDelete} variant="danger" block>Delete</Button></Col>
                    </Row>
                </Container>
                :
                <p>Please select a marker by left clicking one.</p>
            }
        </DraggableContainer>
    )
};

export default WaypointEditor;
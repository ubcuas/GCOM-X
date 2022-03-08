import React, { useState } from 'react';
import Draggable from 'react-draggable';

import {Collapse, Button} from 'react-bootstrap';

import './style.scss';

const DraggableContainer = ({ children, title, width, top, left, bottom, right }) => {
    const [open, setOpen] = useState(true);
    const [position, setPosition] = useState({x: null, y: null});

    function handleStart(e, data) {
        setPosition({
            x: data.x,
            y: data.y
        })
    }

    function handleStop(e, data) {
        if(position.x != data.x || position.y != data.y) {
            // element has moved, so this is a drag
        } else {
            // element not moved, so this is a click
            setOpen(!open); // open the collapsable container
        }
    }

    return (
        <Draggable
            handle=".handle"
            position={null}
            onStart={handleStart}
            onStop={handleStop}
            scale={1}
            bounds="parent"
        >
            <div
                style={{
                    width,
                    top,
                    left,
                    bottom,
                    right
                }}
                className="draggable"
            >
                <Button
                    className="handle"
                    variant="secondary"
                    block
                >
                    {title}
                </Button>
                <Collapse in={open}>
                    <div className="content">
                        {children}
                    </div>
                </Collapse >
            </div>
        </Draggable>
    )
};

export default DraggableContainer;
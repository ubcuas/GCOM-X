import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, ImageOverlay, FeatureGroup, LayerGroup } from 'react-leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import KeyHandler, { KEYDOWN, KEYUP } from 'react-key-handler';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ObjectStatus } from '../Imp';
import './style.scss';

/*
 * Displays a zoomable and pannable image in the middle of the screen
 */
class MidPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            image: {
                path: '',
                bounds: [[0, 0], [0, 0]],
            },
            drawRectangle: null,
            /* Error message if image fails to load */
            imageError: null,
            /* Saves the last object deleted using ctrl/command-z */
            undoneObjectLayer: null,
            show: false,
        };
    }

    componentDidMount()
    {
        this.setupDraw();
    }

    componentDidUpdate(prevProps)
    {
        const { currentImage, objectStatus } = this.props;

        if (prevProps.objectStatus !== objectStatus)
            this.handleObjectStatus(prevProps.objectStatus, objectStatus);

        /* If the map has not been created yet, or no image has been given, return */
        if (!currentImage)
            return;

        this.updateImageFilters();
        /* If the image has not changed, return */
        if (prevProps.currentImage === currentImage)
            return;

        this.updateImage();
    }

    /**
     * Setup ability to draw object rectangles on the map
     */
    setupDraw()
    {
        this.setState({
            drawRectangle: new L.Draw.Rectangle(this.map.leafletElement),
        });
    }

    //---------------------------------------------------------------------------------------------
    // Key Handlers
    //---------------------------------------------------------------------------------------------

    /**
     * Handler for keypresses
     * @param {String} key key name to handle
     */
    handleKeyPress(key)
    {
        switch (key)
        {
            case 'ctrl+z':
            case 'meta+z': {
                if (this.props.objectStatus !== ObjectStatus.CREATING &&
                    this.props.objectStatus !== ObjectStatus.COMBINING)
                    return;

                this.props.cancelObject();
                break;
            }
            case 'ctrl+y':
            case 'meta+shift+z': {
                if (this.props.objectStatus !== ObjectStatus.CANCELLED)
                    return;

                this.props.redoObject();
                this.state.drawRectangle.disable();
                break;
            }
            default:
                break;
        }
    }

    /**
     * Handler for keydown (holding down key)
     * @param {String} key key name to handle
     */
    handleKeyDown(key)
    {
        switch (key)
        {
            case 'meta':
            case 'ctrl': {
                const { objectStatus, currentImage } = this.props;
                /* Not allowed to create object if object is already being created or
                * an existing object is being viewed
                */
                if (objectStatus === ObjectStatus.CREATING ||
                    objectStatus === ObjectStatus.LOADED ||
                    objectStatus === ObjectStatus.COMBINING)
                    return;

                /* If no image has been loaded, return */
                if (!currentImage)
                    return;

                /* Start object draw */
                this.state.drawRectangle.enable();
                break;
            }
            case 'shift': {
                /* Add image filter */
                this.props.invertFilter(1);
                break;
            }
            default:
                break;
        }
    }

    /**
     * Handler for keyup (key release)
     * @param {String} key key name to handle
     */
    handleKeyUp(key)
    {
        switch (key)
        {
            case 'meta':
            case 'ctrl': {
                /* Stop object draw */
                this.state.drawRectangle.disable();
                break;
            }
            case 'shift': {
                /* Remove image filter */
                this.props.invertFilter(0);
                break;
            }
            default:
                break;
        }
    }

    /**
     * Calculate object percentage offset and pixel location
     * @param {L.Layer} objectLayer new object layer created
     * @returns {Object} {
     *      percentageOffset: {
     *          x: offset of object from middle in percent
     *          y: offset of object from middle in percent, where up is positive
     *      },
     *      pixelLocation: {
     *          x: x coordinate of top left corner of object rect in percent
     *          y: y coordinate of top left corner of object rect in percent
     *          w: width of object rect in percent
     *          h: height of object rect in percent
     *      },
     * }
     */
    calculateObjectLocation(objectLayer)
    {
        const { image } = this.state;

        const objectCorners = objectLayer.getLatLngs()[0];

        this.objectLayerGroup.leafletElement.addLayer(objectLayer);

        /* Calculate the center of the object rect relative to the top left corner of the image
        * This coordinate is a percentage of the image size
        * ie. center of image would be at 0.5, 0.5
        */
        const objectCenter = {
            x: (objectCorners[1].lng + ((objectCorners[2].lng - objectCorners[1].lng) / 2)) /
                image.bounds[1][1],
            y: (objectCorners[0].lat + ((objectCorners[1].lat - objectCorners[0].lat) / 2)) /
                image.bounds[0][0],
        };

        /* Calculate the offset of the object center relative to the image center in percent */
        const percentageOffset = {
            x: objectCenter.x - 0.5,
            y: -(objectCenter.y - 0.5),
        };

        /* Calculate the object rect width and height in percent */
        const objectRect = {
            w: (objectCorners[2].lng - objectCorners[1].lng) / image.bounds[1][1],
            h: -(objectCorners[1].lat - objectCorners[0].lat) / image.bounds[0][0],
        };

        /* Calculate the width, height, and top left corner of the object rect in percent */
        const pixelLocation = {
            x: objectCenter.x - (objectRect.w / 2),
            y: objectCenter.y - (objectRect.h / 2),
            w: objectRect.w,
            h: objectRect.h,
        };

        return {
            percentageOffset,
            pixelLocation,
        };
    }

    /**
     * Draw rectangle onCreated handler which creates the object
     * @param {Event} e event that holds the new object layer
     */
    handleDrawCreated(e)
    {
        const { percentageOffset, pixelLocation } = this.calculateObjectLocation(e.layer);

        this.setState({
            undoneObjectLayer: null,
        });

        this.props.createObject(percentageOffset, pixelLocation);
    }

    /**
     * Handler for changes in object status
     * Adds/remove object layers when objects are undone/redone
     * @param {ObjectStatus} prevObjectStatus status before change
     * @param {ObjectStatus} currentObjectStatus status after change
     */
    handleObjectStatus(prevObjectStatus, currentObjectStatus)
    {
        const { undoneObjectLayer } = this.state;

        /* Object has been cancelled */
        if ((prevObjectStatus === ObjectStatus.CREATING ||
             prevObjectStatus === ObjectStatus.COMBINING) &&
            currentObjectStatus === ObjectStatus.CANCELLED)
        {
            const objectLayerGroupLength = this.objectLayerGroup.leafletElement.getLayers().length;
            if (!objectLayerGroupLength)
                return;

            const lastObject = this.objectLayerGroup.leafletElement
                               .getLayers()[objectLayerGroupLength - 1];
            this.objectLayerGroup.leafletElement.removeLayer(lastObject);

            this.setState({
                undoneObjectLayer: lastObject,
            });
        }
        /* Object has been redone */
        else if (prevObjectStatus === ObjectStatus.CANCELLED &&
                 currentObjectStatus === ObjectStatus.CREATING)
        {
            if (!undoneObjectLayer)
                return;

            this.objectLayerGroup.leafletElement.addLayer(undoneObjectLayer);

            this.setState({
                undoneObjectLayer: null,
            });
        }
    }

    //---------------------------------------------------------------------------------------------
    // Image Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Checks if image is valid and returns a promise with either the image data
     * or the path of the image that failed
     * @returns {Promise} resolve: image data - image width, height, path
     *                    reject: image path
     * @async
     */
    loadImage()
    {
        const { imageEndpoint, currentImage } = this.props;
        const image = new Image();

        return new Promise((resolve, reject) =>
        {
            image.onload = () =>
            {
                const imageData = {
                    width: image.width,
                    height: image.height,
                    path: imageEndpoint + currentImage,
                };
                resolve(imageData);
            };
            image.onerror = error => reject(error.target.src);
            image.src = imageEndpoint + currentImage;
        });
    }

    /**
     * Overlays the given image on the map and scales it to fit the viewport
     * @param {Object} imageData width, height, path
     */
    overlayImage(imageData)
    {
        /* Calculate the ratio of the image to the viewPort in terms
         * of width or height, whichever is larger
         */
        const ratio = Math.max(imageData.width / this.viewPort.clientWidth,
                               imageData.height / this.viewPort.clientHeight);
        /* Calculate the zoom level that the full sized image should be at
         * Initial zoom is 1 and each increment is twice the size of the previous
         * Ex: if ratio is 2 (image is twice the size of viewport),
         *     then zoomLevel is 1 + log2(2) = 2, image should be full sized at zoom 2
         */
        const zoomLevel = 1 + Math.log2(ratio);

        /* Calculate bounds of image based on width and height and convert to lat/lon */
        const southWest = this.map.leafletElement.unproject([0, imageData.height], zoomLevel);
        const northEast = this.map.leafletElement.unproject([imageData.width, 0], zoomLevel);

        this.setState({
            imageError: null,
            image: {
                path: imageData.path,
                bounds: [[southWest.lat, southWest.lng], [northEast.lat, northEast.lng]],
            },
        });

        this.map.leafletElement.setZoom(1);
    }

    /**
     * Updates the image in the viewport or shows an error message
     */
    updateImage()
    {
        /* Remove all objects on previous image */
        this.objectLayerGroup.leafletElement.clearLayers();

        /* If image is valid, overlay image on map
         * If image cannot be loaded, ie. does not exist or is not an image,
         * display error message and remove previous image
         */
        this.loadImage()
        .then((imageData) =>
        {
            this.overlayImage(imageData);
        })
        .catch((errorSrc) =>
        {
            this.setState({
                imageError: `Error: could not load ${errorSrc}`,
                image: {
                    path: '',
                    bounds: [[0, 0], [0, 0]],
                },
            });
        });
    }

    updateImageFilters()
    {
        const { brightness, saturation, contrast, invert } = this.props.imageFilter;
        this.imageOverlay.leafletElement.getElement().style.filter =
            `brightness(${brightness}%)
             saturate(${saturation}%)
             contrast(${contrast}%)
             invert(${invert})`;
    }

    render()
    {
        const { image, imageError } = this.state;

        return (
            <div>
                <KeyboardEventHandler
                    handleKeys={['ctrl+z', 'ctrl+y', 'meta+z', 'meta+shift+z']}
                    onKeyEvent={key => this.handleKeyPress(key)}
                    handleFocusableElements
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="Control"
                    onKeyHandle={() => this.handleKeyDown('ctrl')}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Control"
                    onKeyHandle={() => this.handleKeyUp('ctrl')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="Meta"
                    onKeyHandle={() => this.handleKeyDown('meta')}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Meta"
                    onKeyHandle={() => this.handleKeyUp('meta')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="Shift"
                    onKeyHandle={() => this.handleKeyDown('shift')}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Shift"
                    onKeyHandle={() => this.handleKeyUp('shift')}
                />
                <div
                    className="midPanel col-md-6 col-sm-6"
                    ref={(div) =>
                    {
                        this.viewPort = div;
                    }}
                >
                    <div className="imageError">{imageError}</div>

                    <Map
                        minZoom={1}
                        maxZoom={5}
                        center={[0, 0]}
                        zoom={1}
                        zoomSnap={0.5} /* zoom has to be a multiple of this number */
                        boxZoom={false} /* disables zoom by shift */
                        zoomControl={false} /* + or - controls */
                        attributionControl={false} /* if true} displays leaflet link */
                        /* (0-1) describes ability for user to push/pull image past bounds
                        * 1 stops image from moving past bounds
                        */
                        maxBoundsViscosity={1.0}
                        crs={L.CRS.Simple} /* maps pixels to lat/lon in a 1:1 ratio */
                        maxBounds={image.bounds}
                        ref={(map) =>
                        {
                            this.map = map;
                        }}
                    >
                        <ImageOverlay
                            bounds={image.bounds}
                            url={image.path}
                            ref={(imageOverlay) =>
                            {
                                this.imageOverlay = imageOverlay;
                            }}
                        />
                        <LayerGroup
                            ref={(objectLayerGroup) =>
                            {
                                this.objectLayerGroup = objectLayerGroup;
                            }}
                        />
                        <FeatureGroup>
                            <EditControl
                                onCreated={e => this.handleDrawCreated(e)}
                            />
                        </FeatureGroup>
                    </Map>
                </div>
            </div>
        );
    }
}

MidPanel.defaultProps = {
    currentImage: null,
};

MidPanel.propTypes = {
    /* URL to retrieve images from */
    imageEndpoint: PropTypes.string.isRequired,
    /* Name of image to display */
    currentImage: PropTypes.string,
    /* Functions to manipulate objects */
    createObject: PropTypes.func.isRequired,
    cancelObject: PropTypes.func.isRequired,
    redoObject: PropTypes.func.isRequired,
    /* Status of object creation (default, creating, saved, cancelled, loaded) */
    objectStatus: PropTypes.number.isRequired,
    imageFilter: PropTypes.shape({
        brightness: PropTypes.number.isRequired,
        saturation: PropTypes.number.isRequired,
        contrast: PropTypes.number.isRequired,
        invert: PropTypes.number.isRequired,
    }).isRequired,
    invertFilter: PropTypes.func.isRequired,
};

export default MidPanel;

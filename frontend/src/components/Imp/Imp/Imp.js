import React from 'react';
import axios from 'axios';
import LeftPanel from '../LeftPanel';
import MidPanel from '../MidPanel';
import RightPanel from '../RightPanel';
import ConfirmObjectModal from '../ConfirmObjectModal';
import DLinkedList from '../../../utils/DLinkedList';
import UASWebSocket from '../../../utils/UASWebSocket';
import { Type } from '../ObjectSection';
import './style.scss';

export const IMAGE_VIEW_ENDPOINT = 'http://localhost:8080/api/imp/images/';
const ADJUST_GPS_ENDPOINT = 'http://localhost:8080/api/imp/gps-adjust/';
export const OBJECT_VIEW_ENDPOINT = 'http://localhost:8080/api/imp/objects/';
const WEBSOCKET_IMAGE_ENDPOINT = `ws://localhost:8080/ws/imp/image/`;
const WEBSOCKET_OBJECT_ENDPOINT = `ws://localhost:8080/ws/imp/object/`;

/* Enum of object creation status */
export const ObjectStatus = Object.freeze({
    DEFAULT: 0,
    CREATING: 1,
    SAVED: 2,
    CANCELLED: 3,
    LOADED: 4,
    COMBINING: 5,
});

/* Enum of confirmObjectModalType */
export const ConfirmObjectModalType = Object.freeze({
    SAVE: 0,
    DELETE: 1,
    COMBINE: 2,
});

export const ProcessedStatus = Object.freeze({
    DEFAULT: 0,
    PROCESSED: 1,
    SAVED: 2,
});

export const PROXIMITY_THRESHOLD = 10; // in metres

/*
 * Top Level Component for Image Processing Imp Module
 */
class Imp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageSocket: null,
            objectSocket: null,
            /* List of images to process */
            imageList: [],
            /* List of all image viewed */
            imageHistory: new DLinkedList(),
            /* Current image to display */
            currentImage: {
                name: null,
                index: null,
            },
            /* Visiblities of image/object sections */
            leftPanelVisibility: {
                imageSectionVisible: true,
                objectSectionVisible: false,
            },
            /* List of saved objects */
            objectList: [],
            /* Current object being viewed/created */
            currentObject: {
                latitude: '',
                longitude: '',
                name: '',
                type: '',
                description: '',
                shape: '',
                background_color: '',
                alphanumeric: '',
                alphanumeric_color: '',
                orientation: '',
                orientationAbs: 0,
                image_source: '',
                pixel_location: {
                    x: '',
                    y: '',
                    w: '',
                    h: '',
                },
            },
            combiningObject: null,
            combiningObjectId: null,
            /* Heading of current image or image source of loaded object  */
            imageHdg: null,
            /* Database ID of current object, null if object has not been saved yet */
            currentObjectId: null,
            /* Last object cancelled */
            undoneObject: null,
            undoneCombiningObject: null,
            /* Array of objects close to current object */
            closeObjects: [],
            /* Status of object creation */
            objectStatus: ObjectStatus.DEFAULT,
            /* Describes whether or not confirm object modal is open */
            confirmObjectModal: {
                isOpen: false,
                type: ConfirmObjectModalType.SAVE,
            },
            imageFilter: {
                brightness: 100,
                saturation: 100,
                contrast: 100,
                invert: 0,
            },
        };
    }

    componentDidMount() {
        this.setupSockets();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.objectStatus === this.state.objectStatus &&
            prevState.currentObjectId === this.state.currentObjectId)
            return;

        this.updateImageHdg();
    }

    setupSockets() {
        this.setState({
            imageSocket: new UASWebSocket(WEBSOCKET_IMAGE_ENDPOINT,
                e => this.handleImageMessage(e)),
            objectSocket: new UASWebSocket(WEBSOCKET_OBJECT_ENDPOINT,
                e => this.handleObjectMessage(e)),
        });
    }

    //---------------------------------------------------------------------------------------------
    // Image Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Message handler for image UASWebMessages
     * @param {Event} e
     */
    handleImageMessage(e) {
        this.setState({
            imageList: JSON.parse(e.data).sort((a, b) => (a.id - b.id)),
        });
    }

    /**
     * Sets the current image to display
     * @param {Number} index of image to display, 0 <= index < imageList.length
     * @throws {RangeError} if index is out of bounds
     */
    displayImage(index) {
        if (index < 0 || index >= this.state.imageList.length)
            throw new RangeError('Image index out of bounds');

        this.changeImageProcessed(index, ProcessedStatus.PROCESSED);
        this.setState({
            currentImage: {
                name: this.state.imageList[index].name,
                index,
            },
        });

        /* Cancels any current objects */
        this.cancelObject();
    }

    /**
     * Changes the processed status of the given image
     * @param {Number} index of image to change, 0 <= index < imageList.length
     * @param {ProcessedStatus} status processed status for the given image
     * @returns {Boolean} true if put request succeeds,
     *                    false if put request fails or the index is invalid
     */
    changeImageProcessed(index, status) {
        const { imageList, imageSocket } = this.state;

        if (index < 0 || index > imageList.length - 1)
            return false;

        const imageID = imageList[index].id;

        imageSocket.put(imageID, {
            processed_flag: status,
        });
        return true;
    }

    /**
     * Selects an image to view and adds to history
     * @param {String} name of an existing image to view
     * @throws {RangeError} if image does not exist
     */
    selectImage(name) {
        const { imageList, imageHistory } = this.state;
        const imageIndex = imageList.findIndex(image => image.name === name);

        if (imageIndex === -1)
            throw new RangeError('Image does not exist');

        this.displayImage(imageIndex);
        imageHistory.insertAndDiscard(imageIndex);
    }

    /**
     * Selects the next unprocessed image or next image in the history to view
     */
    nextImage() {
        const { imageList, currentImage, imageHistory } = this.state;

        if (currentImage.index === null)
            return;

        if (imageHistory.next() !== null) {
            this.displayImage(imageHistory.val());
            return;
        }

        if (currentImage.index === imageList.length - 1)
            return;

        let i = 0;
        let processed;
        do {
            i += 1;
            if (currentImage.index + i >= imageList.length)
                return;

            processed = imageList[currentImage.index + i].processed_flag;
        } while (processed !== ProcessedStatus.DEFAULT);

        this.displayImage(currentImage.index + i);
        imageHistory.push(currentImage.index + i);
    }

    /**
     * Selects the previous image in history to view
     */
    prevImage() {
        const { currentImage, imageHistory } = this.state;

        if (currentImage.index === null)
            return;

        if (imageHistory.prev() !== null)
            this.displayImage(imageHistory.val());
    }

    /**
     * Updates imageHdg to that of the current image or the image source of the loaded object
     */
    updateImageHdg() {
        const { objectStatus, currentObject, currentImage, imageList } = this.state;
        if (objectStatus === ObjectStatus.LOADED) {
            const sourceImage = imageList.find(image => image.name === currentObject.image_source);
            this.setState({
                imageHdg: (typeof sourceImage === 'undefined') ? null :
                    sourceImage.heading.toString(),
            });
        }
        else {
            this.setState({
                imageHdg: (currentImage.index === null || imageList.length === 0) ?
                    null : imageList[currentImage.index].heading.toString(),
            });
        }
    }

    updateFilters(brightness, saturation, contrast) {
        this.setState(prevState => ({
            imageFilter: {
                brightness,
                saturation,
                contrast,
                invert: prevState.imageFilter.invert,
            },
        }));
    }

    invertFilter(invert) {
        this.setState(prevState => ({
            imageFilter: {
                brightness: prevState.imageFilter.brightness,
                saturation: prevState.imageFilter.saturation,
                contrast: prevState.imageFilter.contrast,
                invert,
            },
        }));
    }

    //---------------------------------------------------------------------------------------------
    // Panel Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Displays image/object sections
     * @param {Boolean} visible true to show image section
     *                          false to show object section
     */
    showImageSection(visible) {
        this.setState({
            leftPanelVisibility: {
                imageSectionVisible: visible,
                objectSectionVisible: !visible,
            },
        });
    }

    //---------------------------------------------------------------------------------------------
    // Object Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Message handler for object UASWebMessages
     * @param {Event} e
     */
    handleObjectMessage(e) {
        this.setState({
            objectList: JSON.parse(e.data).sort((a, b) => (a.id - b.id)),
        });
    }

    //---------------------------------------------------------------------------------------------
    // Object Utility Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Updates current object with object data
     * @param {Object} objData
     *                  Valid object data:
     *                      objLat, objLon
     *                      objName, objDescription, objShape, objBackgroundColor
     *                      objAlphanumeric, objAlphanumericColor, objOrientation, objOrientationAbs
     *                      objImageSource
     *                      objPixelLocationX, objPixelLocationY, objPixelLocationW,
     *                      objPixelLocatonH
     * @description this function is used by using keyword arguments with any of the valid data
     *              e.g. updateObject({ objectLat: 0, objImageSource: 'example.jpg' })
     */
    updateObject(objData) {
        const { latitude, longitude, name, type, description, shape, background_color,
            alphanumeric, alphanumeric_color, orientation, orientationAbs,
            image_source, pixel_location } = this.state.currentObject;

        const { objLat, objLon,
            objName, objType, objDescription, objShape, objBackgroundColor,
            objAlphanumeric, objAlphanumericColor, objOrientation, objOrientationAbs,
            objImageSource,
            objPixelLocationX, objPixelLocationY, objPixelLocationW, objPixelLocationH }
            = objData;

        this.setState({
            currentObject: {
                latitude: (typeof objLat === 'undefined') ? latitude : objLat,
                longitude: (typeof objLon === 'undefined') ? longitude : objLon,
                name: (typeof objName === 'undefined') ? name : objName,
                type: (typeof objType === 'undefined') ? type : objType,
                description: (typeof objDescription === 'undefined') ?
                    description : objDescription,
                shape: (typeof objShape === 'undefined') ? shape : objShape,
                background_color: (typeof objBackgroundColor === 'undefined') ?
                    background_color : objBackgroundColor,
                alphanumeric: (typeof objAlphanumeric === 'undefined') ?
                    alphanumeric : objAlphanumeric,
                alphanumeric_color: (typeof objAlphanumericColor === 'undefined') ?
                    alphanumeric_color : objAlphanumericColor,
                orientation: (typeof objOrientation === 'undefined') ?
                    orientation : objOrientation,
                orientationAbs: (typeof objOrientationAbs === 'undefined') ?
                    orientationAbs : objOrientationAbs,
                image_source: (typeof objImageSource === 'undefined') ?
                    image_source : objImageSource,
                pixel_location: {
                    x: (typeof objPixelLocationX === 'undefined') ?
                        pixel_location.x : objPixelLocationX,
                    y: (typeof objPixelLocationY === 'undefined') ?
                        pixel_location.y : objPixelLocationY,
                    w: (typeof objPixelLocationW === 'undefined') ?
                        pixel_location.w : objPixelLocationW,
                    h: (typeof objPixelLocationH === 'undefined') ?
                        pixel_location.h : objPixelLocationH,
                },
            },
        });
    }

    /**
     * Clear all values of current object
     */
    clearObjectValues() {
        this.updateObject({
            objLat: '',
            objLon: '',
            objName: '',
            objType: '',
            objDescription: '',
            objShape: '',
            objBackgroundColor: '',
            objAlphanumeric: '',
            objAlphanumericColor: '',
            objOrientation: '',
            objOrientationAbs: 0,
            objImageSource: '',
            objPixelLocationX: '',
            objPixelLocationY: '',
            objPixelLocationW: '',
            objPixelLocationH: '',
        });
    }

    /**
     * Calculates object latitude/longitude from offset from center of image and image dimensions
     * @param {Object{Number, Number}} percentageOffset offset of object (x, y) from image center
     * in percent
     * @returns {Object{Number, Number}} latitude, longitude
     */
    calculateObjectGPS(percentageOffset) {
        const { imageList, currentImage } = this.state;
        const { latitude, longitude, name } = imageList[currentImage.index];

        const coordInfo = {
            image_name: name,
            percent_x: percentageOffset.x,
            percent_y: percentageOffset.y,
        };

        return axios.post(ADJUST_GPS_ENDPOINT, coordInfo)
            .then((response) => {
                const adjustGPS = {
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                };
                return adjustGPS;
            })
            .catch((e) => {
                console.log(`Failed to get the adjusted GPS coordinates - ${e}`);
                alert('Error: Failed to get the adjusted GPS coordinates, Using image GPS');

                const origGPS = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                };
                return origGPS;
            });
    }

    /**
     * Calculates the distance between two objects in metres
     * @param {Object{Number, Number}} a Object in the form (latitude, longitude)
     * @param {Object{Number, Number}} b Object in the form (latitude, longitude)
     * @returns {Number} distance between a and b in metres
     */
    static calculateObjectDistance(a, b) {
        /*  Haversine Formula
         *  c = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
         *  d = 2 ⋅ R ⋅ atan2( √c, √(1−c) )
         *  φ: latitude
         *  λ: longitude
        */
        const { PI, sin, cos, sqrt, atan2 } = Math;

        const toRadians = degrees => (degrees / 180) * PI;

        const earthRadius = 6.3781e6;

        const latARad = toRadians(a.latitude);
        const latBRad = toRadians(b.latitude);
        const latDiff = toRadians(b.latitude - a.latitude);
        const lonDiff = toRadians(b.longitude - a.longitude);

        const c = (sin(latDiff / 2) * sin(latDiff / 2)) +
            (cos(latARad) * cos(latBRad) * sin(lonDiff / 2) * sin(lonDiff / 2));

        return 2 * earthRadius * atan2(sqrt(c), sqrt(1 - c));
    }

    /**
     * Finds objects in the list of existing objects close to the given latitude/longitude
     * @param {Number} latitude -90 <= latitude <= 90
     * @param {Number} longitude -180 < longitude <= 180
     * @param {Number} threshold distance threshold in m
     * @returns {Array{String, Number}} Array of (name, distance) of close objects
     */
    findCloseObjects(latitude, longitude, threshold) {
        const { objectList } = this.state;
        const closeObjects = [];

        for (let i = 0; i < objectList.length; i += 1) {
            const distance = Imp.calculateObjectDistance({
                latitude,
                longitude,
            }, {
                latitude: parseFloat(objectList[i].latitude),
                longitude: parseFloat(objectList[i].longitude),
            });

            if (distance < threshold) {
                closeObjects.push({
                    distance,
                    name: objectList[i].name,
                });
            }
        }

        return closeObjects;
    }

    /**
     * Sends current object data to the database
     * Uses a POST request for a new object and PUT request for an existing object
     */
    postObject() {
        const { currentObject, currentObjectId, objectStatus, objectSocket } = this.state;
        const { name, description, type, shape, background_color, alphanumeric, alphanumeric_color,
            orientation, orientationAbs, latitude, longitude, image_source,
            pixel_location } = currentObject;
        const { x, y, w, h } = pixel_location;

        const objectData = {
            latitude,
            longitude,
            name,
            description,
            type,
            shape,
            background_color,
            alphanumeric,
            alphanumeric_color,
            orientation,
            orientationAbs,
            image_source,
            x,
            y,
            w,
            h,
        };
        if (objectStatus !== ObjectStatus.LOADED)
            objectSocket.post(objectData);
        else
            objectSocket.put(currentObjectId, objectData);
    }

    combineObject() {
        const { objectSocket, currentObject, combiningObjectId } = this.state;
        const { latitude, longitude, orientation, orientationAbs } = currentObject;
        objectSocket.combine(combiningObjectId, {
            latitude,
            longitude,
            orientation,
            orientationAbs,
        });
    }

    /**
     * Loads existing object as current object
     * @param {Number} id Database ID of object to load
     */
    loadObject(id) {
        const { objectList, objectStatus } = this.state;

        if (objectStatus === ObjectStatus.CREATING || objectStatus === ObjectStatus.COMBINING)
            return;

        const loadedObject = objectList.find(object => object.id === id);

        const { name, description, type, shape, background_color, alphanumeric, alphanumeric_color,
            orientation, latitude, longitude, image_source, x, y, w, h } = loadedObject;

        this.setState({
            currentObjectId: id,
            currentObject: {
                latitude,
                longitude,
                name,
                description,
                type,
                shape,
                background_color,
                alphanumeric,
                alphanumeric_color,
                orientation,
                image_source,
                pixel_location: {
                    x,
                    y,
                    w,
                    h,
                },
            },
            objectStatus: ObjectStatus.LOADED,
        });

        this.showImageSection(false);
    }

    loadCombiningObject(objName) {
        if (objName === null) {
            this.setState({
                combiningObjectId: null,
                combiningObject: null,
                objectStatus: ObjectStatus.CREATING,
            });
            return;
        }

        const combiningObject = this.state.objectList.find(object => object.name === objName);

        const { id, name, description, type, shape, background_color,
            alphanumeric, alphanumeric_color } = combiningObject;

        this.setState({
            combiningObjectId: id,
            combiningObject: {
                name,
                description,
                type,
                shape,
                background_color,
                alphanumeric,
                alphanumeric_color,
            },
            objectStatus: ObjectStatus.COMBINING,
        });

        this.showImageSection(false);
    }

    //---------------------------------------------------------------------------------------------
    // Object Creation Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Create new object
     * @param {Object{Number, Number}} percentageOffset offset of object (x, y) from
     * image center in percent
     * @param {Object{Number, Number, Number, Number}} pixel_location w, h, x, y of
     * top left corner of object rect in percent
     */
    createObject(percentageOffset, pixel_location) {
        const { currentImage } = this.state;

        this.calculateObjectGPS(percentageOffset)
            .then((adjustGPS) => {
                const latitude = adjustGPS.latitude;
                const longitude = adjustGPS.longitude;

                this.updateObject({
                    objLat: latitude.toFixed(8),
                    objLon: longitude.toFixed(8),
                    objImageSource: currentImage.name,
                    objPixelLocationX: pixel_location.x.toFixed(5),
                    objPixelLocationY: pixel_location.y.toFixed(5),
                    objPixelLocationW: pixel_location.w.toFixed(5),
                    objPixelLocationH: pixel_location.h.toFixed(5),
                    objType: Type.STANDARD,
                });

                this.setState({
                    objectStatus: ObjectStatus.CREATING,
                    currentObjectId: null,
                    closeObjects: this.findCloseObjects(latitude, longitude, PROXIMITY_THRESHOLD),
                });

                this.showImageSection(false);
            });
    }

    /**
     * Clear all user settable values of current object
     */
    clearObject() {
        this.updateObject({
            objName: '',
            objDescription: '',
            objShape: '',
            objBackgroundColor: '',
            objAlphanumeric: '',
            objAlphanumericColor: '',
            objOrientation: '',
        });
    }

    /**
     * Cancels the current object being created
     */
    cancelObject() {
        this.setState(prevState => ({
            closeObjects: [],
            undoneObject: prevState.currentObject,
            undoneCombiningObject: prevState.combiningObject,
            objectStatus: (prevState.objectStatus === ObjectStatus.CREATING ||
                prevState.objectStatus === ObjectStatus.COMBINING) ?
                ObjectStatus.CANCELLED : ObjectStatus.DEFAULT,
            currentObjectId: null,
            combiningObjectId: null,
            combiningObject: null,
        }));

        this.clearObjectValues();
        this.showImageSection(true);
    }

    /**
     * Recreates most recent object cancelled
     */
    redoObject() {
        this.setState(prevState => ({
            currentObject: prevState.undoneObject,
            combiningObject: prevState.undoneCombiningObject,
            undoneObject: null,
            undoneCombiningObject: null,
            objectStatus: (prevState.undoneCombiningObject === null) ? ObjectStatus.CREATING
                : ObjectStatus.COMBINING,
            currentObjectId: null,
        }));

        this.showImageSection(false);
    }

    //---------------------------------------------------------------------------------------------
    // Object Modal Methods
    //---------------------------------------------------------------------------------------------

    /**
     * Opens object confirmation modal
     * @param {ConfirmObjectModalType} type modal type - save or delete
     */
    openConfirmObjectModal(type) {
        this.setState({
            confirmObjectModal: {
                isOpen: true,
                type,
            },
        });
    }

    /**
     * Closes object confirmation modal
     */
    closeConfirmObjectModal() {
        this.setState(prevState => ({
            confirmObjectModal: {
                isOpen: false,
                type: prevState.confirmObjectModal.type,
            },
        }));
    }

    /**
     * Saves object to database and closes object modal
     */
    saveConfirmObjectModal() {
        const { currentObjectId, objectSocket } = this.state;
        const { type } = this.state.confirmObjectModal;

        switch (type) {
            case ConfirmObjectModalType.SAVE: {
                this.postObject();

                this.clearObjectValues();
                this.setState(prevState => ({
                    closeObjects: [],
                    confirmObjectModal: {
                        isOpen: false,
                        type: prevState.confirmObjectModal.type,
                    },
                    objectStatus: ObjectStatus.SAVED,
                    currentObjectId: null,
                }));
                this.showImageSection(true);
                break;
            }
            case ConfirmObjectModalType.DELETE: {
                objectSocket.delete(currentObjectId);

                this.clearObjectValues();
                this.setState(prevState => ({
                    confirmObjectModal: {
                        isOpen: false,
                        type: prevState.confirmObjectModal.type,
                    },
                    objectStatus: ObjectStatus.DEFAULT,
                    currentObjectId: null,
                }));
                this.showImageSection(true);
                break;
            }
            case ConfirmObjectModalType.COMBINE: {
                this.combineObject();
                this.clearObjectValues();
                this.setState(prevState => ({
                    closeObjects: [],
                    confirmObjectModal: {
                        isOpen: false,
                        type: prevState.confirmObjectModal.type,
                    },
                    objectStatus: ObjectStatus.SAVED,
                    currentObjectId: null,
                    combiningObjectId: null,
                }));
                this.showImageSection(true);
                break;
            }
            default:
                break;
        }
    }

    render() {
        const { imageList, currentImage, leftPanelVisibility,
            objectList, currentObject, imageHdg, currentObjectId, objectStatus,
            confirmObjectModal, closeObjects, imageFilter, combiningObject } = this.state;

        return (
            <div className="row imp">
                <div className="instruction">
                    <p className="instruction1">
                        Next Image: <b>d or &#8594; </b>| Prev Image: <b>a or &#8592;
                        </b> | Select object: <b>ctrl-click + drag</b>
                    </p>
                    <p className="instruction2">
                        Undo object: <b>ctrl-z</b> | Redo object: <b>ctrl-y
                        </b> | Image invert: <b>shift</b>
                    </p>
                </div>

                <LeftPanel
                    imageList={imageList.map(image => ({
                        name: image.name,
                        processed_flag: image.processed_flag,
                    }))}
                    selectImage={name => this.selectImage(name)}
                    nextImage={() => this.nextImage()}
                    prevImage={() => this.prevImage()}
                    changeImageProcessed={(index, status) => this.changeImageProcessed(index,
                        status)}
                    currentImage={currentImage}
                    visibility={leftPanelVisibility}
                    showImageSection={visibility => this.showImageSection(visibility)}
                    imageHdg={imageHdg}
                    objectList={objectList.map(object => object.name)}
                    currentObject={currentObject}
                    closeObjects={closeObjects}
                    objectStatus={objectStatus}
                    clearObject={() => this.clearObject()}
                    cancelObject={() => this.cancelObject()}
                    updateObject={objData => this.updateObject(objData)}
                    confirmObject={type => this.openConfirmObjectModal(type)}
                    currentObjectId={currentObjectId}
                    imageFilter={imageFilter}
                    updateFilters={(brightness, saturation, contrast) =>
                        this.updateFilters(brightness, saturation, contrast)
                    }
                    combiningObject={combiningObject}
                    loadCombiningObject={name => this.loadCombiningObject(name)}
                />
                <MidPanel
                    imageEndpoint={IMAGE_VIEW_ENDPOINT}
                    currentImage={currentImage.name}
                    createObject={
                        (percentageOffset, pixel_location) =>
                            this.createObject(percentageOffset, pixel_location)
                    }
                    cancelObject={() => this.cancelObject()}
                    redoObject={() => this.redoObject()}
                    objectStatus={objectStatus}
                    imageFilter={imageFilter}
                    invertFilter={invert => this.invertFilter(invert)}
                />
                <RightPanel
                    objectList={objectList.map((object) => {
                        const subObject = {
                            id: object.id,
                            name: object.name,
                        };
                        return subObject;
                    })}
                    currentObjectId={currentObjectId}
                    loadObject={id => this.loadObject(id)}
                />
                <ConfirmObjectModal
                    currentObject={currentObject}
                    status={confirmObjectModal}
                    closeConfirmObjectModal={() => this.closeConfirmObjectModal()}
                    saveConfirmObjectModal={() => this.saveConfirmObjectModal()}
                    objectStatus={objectStatus}
                />
            </div>
        );
    }
}

export default Imp;

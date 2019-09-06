import React from 'react';
import PropTypes from 'prop-types';
import KeyHandler, { KEYDOWN } from 'react-key-handler';
import ImageSection from '../ImageSection';
import ObjectSection from '../ObjectSection';
import { ObjectStatus } from '../Imp';
import './style.scss';

/*
 * Panel to display list of image or object creation panel
 */
class LeftPanel extends React.Component
{
    /**
     * Handler for keypresses
     * @param {String} key key name to handle
     */
    handleKeyPress(key)
    {
        const { objectStatus, nextImage, prevImage, visibility } = this.props;

        if (!visibility.imageSectionVisible)
            return;

        if (objectStatus === ObjectStatus.CREATING || objectStatus === ObjectStatus.LOADED)
            return;

        switch (key)
        {
            case 'a':
            case 'left': {
                prevImage();
                break;
            }
            case 'd':
            case 'right': {
                nextImage();
                break;
            }
            default:
                break;
        }
    }

    render()
    {
        const { imageList, selectImage, changeImageProcessed, currentImage,
                visibility, imageHdg, objectList, currentObject, clearObject, cancelObject,
                updateObject, confirmObject, objectStatus, currentObjectId,
                closeObjects, imageFilter, updateFilters,
                combiningObject, loadCombiningObject } = this.props;

        return (
            <div className="leftPanel col-md-3 col-sm-3">
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="ArrowLeft"
                    onKeyHandle={() => this.handleKeyPress('left')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="a"
                    onKeyHandle={() => this.handleKeyPress('a')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="ArrowRight"
                    onKeyHandle={() => this.handleKeyPress('right')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="d"
                    onKeyHandle={() => this.handleKeyPress('d')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue=" "
                    onKeyHandle={() => this.handleKeyPress(' ')}
                />
                <ImageSection
                    imageList={imageList}
                    selectImage={name => selectImage(name)}
                    changeImageProcessed={(index, status) => changeImageProcessed(index, status)}
                    currentImage={currentImage}
                    visibility={visibility.imageSectionVisible}
                    objectStatus={objectStatus}
                    imageFilter={imageFilter}
                    updateFilters={(brightness, saturation, contrast) =>
                        updateFilters(brightness, saturation, contrast)
                    }
                />
                <ObjectSection
                    visibility={visibility.objectSectionVisible}
                    objectList={objectList}
                    currentObject={currentObject}
                    currentObjectId={currentObjectId}
                    updateObject={objInfo => updateObject(objInfo)}
                    clearObject={() => clearObject()}
                    cancelObject={() => cancelObject()}
                    confirmObject={type => confirmObject(type)}
                    objectStatus={objectStatus}
                    imageHdg={imageHdg}
                    closeObjects={closeObjects}
                    combiningObject={combiningObject}
                    loadCombiningObject={name => loadCombiningObject(name)}
                />
            </div>
        );
    }
}

LeftPanel.defaultProps = {
    currentImage: PropTypes.shape({
        index: null,
        name: null,
    }),
    currentObjectId: null,
    imageHdg: null,
    combiningObject: null,
};

LeftPanel.propTypes = {
    /* List of images to process */
    imageList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        processed_flag: PropTypes.number,
    })).isRequired,
    /* Function to set image to display */
    selectImage: PropTypes.func.isRequired,
    /* Function to move to the next image */
    nextImage: PropTypes.func.isRequired,
    /* Function to move to the previous image */
    prevImage: PropTypes.func.isRequired,
    /* Function to change processed state of image */
    changeImageProcessed: PropTypes.func.isRequired,
    /* Index of current image displayed */
    currentImage: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
    }),
    /* Visibility of image and object sections */
    visibility: PropTypes.shape({
        imageSectionVisible: PropTypes.bool.isRequired,
        objectSectionVisible: PropTypes.bool.isRequired,
    }).isRequired,
    /* Heading of current image */
    imageHdg: PropTypes.string,
    /* List of object names */
    objectList: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    /* Object currently being viewed/created */
    currentObject: PropTypes.shape({
        latitude: PropTypes.string.isRequired,
        longitude: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        shape: PropTypes.string.isRequired,
        background_color: PropTypes.string.isRequired,
        alphanumeric: PropTypes.string.isRequired,
        alphanumeric_color: PropTypes.string.isRequired,
        orientation: PropTypes.string.isRequired,
        image_source: PropTypes.string.isRequired,
        pixel_location: PropTypes.shape({
            x: PropTypes.string.isRequired,
            y: PropTypes.string.isRequired,
            w: PropTypes.string.isRequired,
            h: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    /* Database id of current object */
    currentObjectId: PropTypes.number,
    /* Array of objects close to current object */
    closeObjects: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        distance: PropTypes.number,
    })).isRequired,
    /* Status of object creation (default, creating, saved, cancelled, loaded) */
    objectStatus: PropTypes.number.isRequired,
    /* Functions to manipulate objects */
    updateObject: PropTypes.func.isRequired,
    clearObject: PropTypes.func.isRequired,
    cancelObject: PropTypes.func.isRequired,
    confirmObject: PropTypes.func.isRequired,
    imageFilter: PropTypes.shape({
        brightness: PropTypes.number.isRequired,
        saturation: PropTypes.number.isRequired,
        contrast: PropTypes.number.isRequired,
        invert: PropTypes.number.isRequired,
    }).isRequired,
    updateFilters: PropTypes.func.isRequired,
    loadCombiningObject: PropTypes.func.isRequired,
    combiningObject: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        shape: PropTypes.string.isRequired,
        background_color: PropTypes.string.isRequired,
        alphanumeric: PropTypes.string.isRequired,
        alphanumeric_color: PropTypes.string.isRequired,
    }),
};

export default LeftPanel;

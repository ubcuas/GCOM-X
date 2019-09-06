import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Knob from 'react-canvas-knob';
import { ObjectStatus, ConfirmObjectModalType } from '../Imp';
import './style.scss';

const PLACEHOLDER = 'Select...';
const PLACEHOLDER_OBJ = { value: PLACEHOLDER, label: PLACEHOLDER };

const COLORS = [
    PLACEHOLDER_OBJ,
    { value: 'black', label: 'black' },
    { value: 'blue', label: 'blue' },
    { value: 'brown', label: 'brown' },
    { value: 'gray', label: 'gray' },
    { value: 'green', label: 'green' },
    { value: 'orange', label: 'orange' },
    { value: 'purple', label: 'purple' },
    { value: 'red', label: 'red' },
    { value: 'white', label: 'white' },
    { value: 'yellow', label: 'yellow' },
];
const SHAPES = [
    PLACEHOLDER_OBJ,
    { value: 'circle', label: 'circle' },
    { value: 'cross', label: 'cross' },
    { value: 'heptagon', label: 'heptagon' },
    { value: 'hexagon', label: 'hexagon' },
    { value: 'octagon', label: 'octagon' },
    { value: 'pentagon', label: 'pentagon' },
    { value: 'quarter_circle', label: 'quarter_circle' },
    { value: 'rectangle', label: 'rectangle' },
    { value: 'semicircle', label: 'semicircle' },
    { value: 'square', label: 'square' },
    { value: 'star', label: 'star' },
    { value: 'trapezoid', label: 'trapezoid' },
    { value: 'triangle', label: 'triangle' },
];

export const Type = Object.freeze({
    STANDARD: 'standard',
    EMERGENT: 'emergent',
});
const TYPES = [
    { label: Type.STANDARD, value: Type.STANDARD },
    { label: Type.EMERGENT, value: Type.EMERGENT },
];

const M_TO_FT = 3.28084;

/*
 * Object Section with object property inputs and delete, clear, cancel, save buttons
 */
class ObjectSection extends React.Component
{
    /**
     * Converts orientation in degees to direction
     * @param {Number} orientation in degrees (0 - 359.999)
     * @returns {String} one of ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
     */
    static orientationNumberToLetter(orientation)
    {
        const orientationLetters = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

        if (orientation >= 360 || orientation < 0)
            return '';

        return orientationLetters[(orientation > 337.5 || orientation <= 22.5) ? 0 :
                                  Math.ceil((orientation - 22.5) / 45)];
    }

    /**
     * Validates and replaces input fields against invalid characters
     * @param {String} value value to validate
     * @param {String} oldValue previous value before most recent change
     * @param {Object} chars in the form of {
     *                          validChars, (valid characters to test against)
     *                          invalidChars, (invalid characters to test against)
     *                       }
     *                       Only need to specify one or the other
     * @param {Number} maxLength maximum length of input field
     * @returns {String} validated value
     */
    static validateValue(value, oldValue, chars, maxLength)
    {
        const { validChars, invalidChars } = chars;
        let regex;

        if (typeof maxLength === 'number')
        {
            if (oldValue.length === maxLength && value.length > oldValue.length)
                return oldValue;
        }

        if (typeof validChars === 'string')
            regex = new RegExp(`[^${validChars}]`, 'g');
        else if (typeof invalidChars === 'string')
            regex = new RegExp(`[${invalidChars}]`, 'g');
        else
            return oldValue;

        return value.replace(regex, '');
    }

    /**
     * Validates and replaces number against invalid ranges
     * @param {String} numberString number string to validate
     * @param {String} oldNumberString previous number string before most recent change
     * @param {Number} minValue minimum value of the number range
     * @param {Number} maxValue maximum value of the number range
     * @param {Number} decimalPlaces number of decimal places of the number
     * @returns {String} validated number string
     */
    static validateNumber(numberString, oldNumberString, minValue, maxValue, decimalPlaces)
    {
        if (numberString.split('.').length === 2 &&
            numberString.split('.')[1].length > decimalPlaces)
            return oldNumberString;

        if (parseFloat(numberString) < minValue || parseFloat(numberString) > maxValue)
            return oldNumberString;

        return numberString;
    }

    constructor(props)
    {
        super(props);

        this.state = {
            objRelOrientation: 0,
        };
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.objectStatus === this.props.objectStatus &&
            prevProps.currentObjectId === this.props.currentObjectId)
            return;

        this.clearState();
    }

    /**
     * Clears all temporary fields
     */
    clearState()
    {
        this.setState({
            objRelOrientation: 0,
        });
    }

    /**
     * Ensures object names are unique
     * @param {String} name name to verify
     * @param {String} oldName previous name before most recent change
     * @returns {String} name if name does not already exist, oldName otherwise
     */
    verifyObjectUniqueness(name, oldName)
    {
        if (this.props.objectList.includes(name))
            return oldName;

        return name;
    }

    /**
     * Checks if all required values are non empty
     * @returns {Boolean} true if all required values are empty, false otherwise
     */
    checkRequired()
    {
        if (this.objectName.value.length === 0)
            return false;

        return true;
    }
    /**
     * Returns shape, background color, alphanumeric, and alphanumeric orientation when
     * standard object is selected.
     * @returns {div} object fields that are valid for standard objects
     */
    standardSection()
    {
        const { currentObject, updateObject, imageHdg, combiningObject, objectStatus } = this.props;

        let { shape, background_color, alphanumeric,
                alphanumeric_color } = currentObject;

        if (objectStatus === ObjectStatus.COMBINING)
        {
            shape = combiningObject.shape;
            background_color = combiningObject.background_color;
            alphanumeric = combiningObject.alphanumeric;
            alphanumeric_color = combiningObject.alphanumeric_color;
        }

        return (
            <div>
                Shape:
                <Select
                    options={SHAPES}
                    value={{ label: shape, value: shape }}
                    isDisabled={objectStatus === ObjectStatus.COMBINING}
                    onChange={option => updateObject({
                        objShape: (option.value === SHAPES[0].value) ? '' : option.value,
                    })}
                />
                Background Color:
                <Select
                    options={COLORS}
                    isDisabled={objectStatus === ObjectStatus.COMBINING}
                    value={{ label: background_color, value: background_color }}
                    onChange={option => updateObject({
                        objBackgroundColor: (option.value === COLORS[0].value) ? '' : option.value,
                    })}
                />
                Alphanumeric:
                <input
                    className="objectInput objectAlphanumeric"
                    type="text"
                    title="Only a-z A-Z 0-9 allowed"
                    value={alphanumeric}
                    disabled={objectStatus === ObjectStatus.COMBINING}
                    onChange={(e) =>
                    {
                        const currentAlphanumeric = this.props.currentObject.alphanumeric;
                        updateObject({
                            objAlphanumeric: ObjectSection.validateValue(e.target.value,
                                             currentAlphanumeric, { validChars: 'a-zA-Z0-9' }, 1),
                        });
                    }}
                />
                Alphanumeric Color:
                <Select
                    options={COLORS}
                    isDisabled={objectStatus === ObjectStatus.COMBINING}
                    value={{ label: alphanumeric_color, value: alphanumeric_color }}
                    onChange={option => updateObject({
                        objAlphanumericColor: (option.value === SHAPES[0].value) ? '' : option.value,
                    })}
                />
                Alphanumeric Orientation:
                <div className="btn-group orientation">
                    <Knob
                        value={this.state.objRelOrientation}
                        className="knob"
                        min={0}
                        max={360}
                        thickness={0.5}
                        bgColor="#ccc"
                        fgColor="#000"
                        width={50}
                        height={50}
                        displayInput={false}
                        cursor={30}
                        step={5}
                        onChange={(value) =>
                        {
                            this.setState({
                                objRelOrientation: value,
                            });

                            const objOrientationAbs = (parseFloat(value) + parseFloat(imageHdg))
                                                        % 360;

                            updateObject({
                                objOrientation: ObjectSection
                                                .orientationNumberToLetter(objOrientationAbs),
                                objOrientationAbs,
                            });
                        }}
                    />
                    <input
                        className="objectInput objectOrientationAbs"
                        value={currentObject.orientation}
                        onChange={e => e.target.value}
                        readOnly
                    />
                </div>
            </div>
        );
    }
    /**
     * Returns the description textbox when emergent object is selected.
     * @returns {div} object fields that are valid for standard object
     */
    emergentSection()
    {
        return (
            <div>
                Description:
                <textarea
                    className={'objectInput objectDescription'}
                    value={this.props.currentObject.description}
                    onChange={e => this.props.updateObject({ objDescription: e.target.value })}
                />
            </div>
        );
    }
    /**
     * Update object with selected object type
     * @param {Object{String}} option: standard or emergent
     */
    handleChange(option)
    {
        if (option.value !== this.props.currentObject.type)
        {
            this.props.updateObject({
                objType: option.value,
                objDescription: '',
                objShape: '',
                objBackgroundColor: '',
                objAlphanumeric: '',
                objAlphanumericColor: '',
                objOrientation: '',
            });
            this.clearState();
        }
        else
        {
            this.props.updateObject({
                objType: option.value,
            });
        }
    }

    handleObjectCombine(obj)
    {
        if (this.props.objectStatus === ObjectStatus.COMBINING &&
            this.props.combiningObject.name === obj.label)
            return;

        if (obj.label === PLACEHOLDER)
        {
            this.props.clearObject();
            this.props.loadCombiningObject(null);
        }
        else
            this.props.loadCombiningObject(obj.label);
    }

    render()
    {
        const { objectList, visibility, currentObject, clearObject,
                cancelObject, updateObject, confirmObject,
                objectStatus, closeObjects, combiningObject } = this.props;
        let { name, type } = currentObject;
        const { latitude, longitude, image_source } = currentObject;

        if (objectStatus === ObjectStatus.COMBINING)
        {
            name = combiningObject.name;
            type = combiningObject.type;
        }

        const objectSectionStyle = {
            display: (visibility) ? 'block' : 'none',
        };

        const objectSelectList = [PLACEHOLDER_OBJ,
            ...objectList.map(objName => ({ label: objName, value: objName }))];

        let saveButtonText = 'Save';
        if (objectStatus === ObjectStatus.LOADED)
            saveButtonText = 'Update';
        else if (objectStatus === ObjectStatus.COMBINING)
            saveButtonText = 'Combine';

        return (
            <div className="objectSection" style={objectSectionStyle}>
                Image Source:
                <input
                    className="objectInputReadOnly objectImageSource"
                    type="text"
                    value={image_source}
                    readOnly
                />
                Latitude:
                <input
                    className="objectInputReadOnly objectLat"
                    type="text"
                    value={latitude}
                    readOnly
                />
                Longitude:
                <input
                    className="objectInputReadOnly objectLon"
                    type="text"
                    value={longitude}
                    readOnly
                />
                {
                    (closeObjects.length !== 0) ?
                        <div className="proximityWarning">
                            <h5 className="text-danger">Similar Objects Warning:</h5>
                            {
                                closeObjects.map(object =>
                                (
                                    <div key={object.name}>
                                    This object is
                                        <b> { (object.distance * M_TO_FT).toFixed(2) } ft</b> from <b>{ ` ${object.name}` }</b>
                                    </div>
                                ))
                            }
                        </div>
                    : ''
                }
                Combine with:
                <Select
                    options={objectSelectList}
                    value={objectStatus === ObjectStatus.COMBINING ?
                            { label: combiningObject.name, value: combiningObject.name } :
                            { label: '', value: '' }}
                    isDisabled={objectStatus === ObjectStatus.LOADED}
                    onChange={obj => this.handleObjectCombine(obj)}
                />
                Name:
                <input
                    className="objectInput objectName"
                    type="text"
                    value={name}
                    disabled={objectStatus === ObjectStatus.COMBINING}
                    ref={(input) =>
                    {
                        this.objectName = input;
                    }}
                    onChange={(e) =>
                    {
                        const currentName = this.props.currentObject.name;
                        const validatedName = ObjectSection.validateValue(e.target.value,
                        currentName, {
                            invalidChars: ' ',
                        });
                        updateObject({
                            objName: this.verifyObjectUniqueness(validatedName, currentName),
                        });
                    }}
                    required
                />
                Object Type:
                <Select
                    options={TYPES}
                    value={{ label: type, value: type }}
                    isDisabled={objectStatus === ObjectStatus.COMBINING}
                    onChange={option => this.handleChange(option)}
                />
                {
                    (type === Type.EMERGENT) ?
                    this.emergentSection() : this.standardSection()
                }
                <div className="btn-group">
                    <button
                        className="objectDelete btn btn-danger"
                        onClick={() =>
                        {
                            if (objectStatus !== ObjectStatus.LOADED)
                                return;

                            confirmObject(ConfirmObjectModalType.DELETE);
                        }}
                        onKeyPress={e => e.preventDefault()}
                    >
                        Delete
                    </button>
                    <button
                        className="objectClear btn btn-warning"
                        onClick={() =>
                        {
                            clearObject();
                            this.clearState();
                        }}
                    >
                        Clear
                    </button>
                </div>
                <div className="btn-group">
                    <button
                        className="objectCancel btn btn-warning"
                        onClick={() => cancelObject()}
                    >
                        Cancel
                    </button>
                    <button
                        className="objectSave btn btn-success"
                        onClick={() =>
                        {
                            if (!this.checkRequired())
                                return;

                            const modalType = (objectStatus === ObjectStatus.COMBINING) ?
                                ConfirmObjectModalType.COMBINE :
                                ConfirmObjectModalType.SAVE;

                            confirmObject(modalType);
                        }}
                        onKeyPress={e => e.preventDefault()}
                    >
                        {saveButtonText}
                    </button>
                </div>
            </div>
        );
    }
}

ObjectSection.defaultProps = {
    currentObjectId: null,
    imageHdg: null,
    combiningObject: null,
};

ObjectSection.propTypes = {
    /* Describes whether or not object section is visible */
    visibility: PropTypes.bool.isRequired,
    /* List of object names */
    objectList: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    /* Status of object creation (default, creating, saved, cancelled, loaded) */
    objectStatus: PropTypes.number.isRequired,
    /* Functions to manipulate objects */
    clearObject: PropTypes.func.isRequired,
    cancelObject: PropTypes.func.isRequired,
    updateObject: PropTypes.func.isRequired,
    confirmObject: PropTypes.func.isRequired,
    /* Database id of current object */
    currentObjectId: PropTypes.number,
    /* Heading of current image */
    imageHdg: PropTypes.string,
    /* Array of objects close to current object */
    closeObjects: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        distance: PropTypes.number,
    })).isRequired,
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

export default ObjectSection;

import React from 'react';
import PropTypes from 'prop-types';
import { ProcessedStatus } from '../Imp';
import './style.scss';

/*
 * Displays a list of images to view/process
 */
class ImageSection extends React.Component
{
    constructor(props)
    {
        super(props);

        this.checkbox = [];
        this.listItem = [];
    }
    /**
     * Handler for checkbox onChange
     * @param {Number} index of the image
     * @param {Boolean} checked whether or not the checkbox is checked
     */
    handleCheckboxChange(index, checked)
    {
        this.props.changeImageProcessed(index, (checked) ? ProcessedStatus.SAVED :
                                                            ProcessedStatus.PROCESSED);
        this.checkbox[index].blur();
    }

    /**
     * Converts an image name to a image button item
     * @param {Object} image object
     * @returns {Button} image button item
     */
    imageItem(image, index)
    {
        const { currentImage } = this.props;
        let buttonColor;

        if (currentImage.name === image.name)
            buttonColor = 'btn-primary';
        else if (image.processed_flag === ProcessedStatus.PROCESSED)
            buttonColor = 'btn-processed btn-secondary';
        else if (image.processed_flag === ProcessedStatus.SAVED)
            buttonColor = 'btn-warning';
        else
            buttonColor = 'btn-secondary';

        if (this.listItem && this.imagesList && this.listItem[index] &&
            currentImage.name === image.name)
        {
            const offsetBottom = this.listItem[index].offsetTop + this.listItem[index].offsetHeight;
            // If image list item is below visible range, scroll down
            if (offsetBottom > this.imagesList.scrollTop + this.imagesList.offsetHeight)
                this.imagesList.scrollTop = offsetBottom - this.imagesList.offsetHeight;
            // If image list item is above visible range, scroll up
            else if (this.listItem[index].offsetTop < this.imagesList.scrollTop)
                this.imagesList.scrollTop = this.listItem[index].offsetTop;
        }

        return (
            <div
                key={image.name}
            >
                <button
                    /* If currently selected, changes color */
                    className={`imageListItem btn btn-block ${buttonColor}`}
                    onClick={() => this.props.selectImage(image.name)}
                    ref={(listItem) =>
                    {
                        this.listItem[index] = listItem;
                    }}
                >{ image.name }
                    <input
                        type="checkbox"
                        className="imageSaveCheckBox"
                        onChange={e => this.handleCheckboxChange(index, e.target.checked)}
                        checked={image.processed_flag === ProcessedStatus.SAVED}
                        ref={(checkbox) =>
                        {
                            this.checkbox[index] = checkbox;
                        }}
                    />
                </button>
            </div>
        );
    }

    render()
    {
        const { imageList, visibility, updateFilters } = this.props;
        const { brightness, saturation, contrast } = this.props.imageFilter;

        const imageSectionStyle = {
            display: (visibility) ? 'block' : 'none',
        };

        return (
            <div className="imageSection" style={imageSectionStyle}>
                <div
                    className="imagesList"
                    ref={(imagesList) =>
                    {
                        this.imagesList = imagesList;
                    }}
                >
                    { imageList.map((image, index) => this.imageItem(image, index)) }
                </div>
                <div className="sliders card">
                    Brightness:
                    <input
                        className="form-control"
                        type="range"
                        min={0}
                        max={300}
                        value={brightness}
                        onChange={e => updateFilters(Number(e.target.value), saturation, contrast)}
                        onMouseUp={() => this.brightnessSlider.blur()}
                        ref={(brightnessSlider) =>
                        {
                            this.brightnessSlider = brightnessSlider;
                        }}
                    />
                    Saturation:
                    <input
                        className="form-control"
                        type="range"
                        min={0}
                        max={300}
                        value={saturation}
                        onChange={e => updateFilters(brightness, Number(e.target.value), contrast)}
                        onMouseUp={() => this.saturationSlider.blur()}
                        ref={(saturationSlider) =>
                        {
                            this.saturationSlider = saturationSlider;
                        }}
                    />
                    Contrast:
                    <input
                        className="form-control"
                        type="range"
                        min={0}
                        max={300}
                        value={contrast}
                        onChange={e => updateFilters(
                            brightness, saturation, Number(e.target.value),
                        )}
                        onMouseUp={() => this.contrastSlider.blur()}
                        ref={(contrastSlider) =>
                        {
                            this.contrastSlider = contrastSlider;
                        }}
                    />
                    <button
                        className="btn btn-secondary"
                        onClick={() => updateFilters(100, 100, 100)}
                    >
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

ImageSection.defaultProps = {
    currentImage: PropTypes.shape({
        index: null,
        name: null,
    }),
};

ImageSection.propTypes = {
    /* List of images to process */
    imageList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        processed_flag: PropTypes.number,
    })).isRequired,
    /* Function to set image to display */
    selectImage: PropTypes.func.isRequired,
    /* Function to change processed state of image */
    changeImageProcessed: PropTypes.func.isRequired,
    /* Index of current image displayed */
    currentImage: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
    }),
    /* Describes whether or not image section is visible */
    visibility: PropTypes.bool.isRequired,
    imageFilter: PropTypes.shape({
        brightness: PropTypes.number.isRequired,
        saturation: PropTypes.number.isRequired,
        contrast: PropTypes.number.isRequired,
        invert: PropTypes.number.isRequired,
    }).isRequired,
    updateFilters: PropTypes.func.isRequired,
};

export default ImageSection;

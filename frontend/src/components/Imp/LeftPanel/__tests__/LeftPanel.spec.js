import React from 'react';
import { shallow } from 'enzyme';
import LeftPanel from '../LeftPanel';
import { ObjectStatus } from '../../Imp';

describe('LeftPanel', () =>
{
    let leftPanel;

    let mockVisibility = {
        imageSectionVisible: false,
        objectSectionVisible: true,
    };

    const mockCurrentObject = {
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
        image_source: '',
        pixel_location: {
            x: '',
            y: '',
            w: '',
            h: '',
        },
    };

    const mockNextImage = jest.fn();
    const mockPrevImage = jest.fn();
    let mockObjectStatus = ObjectStatus.CREATING;
    // TODO: test filters
    const mockFilter = {
        brightness: 100,
        saturation: 100,
        contrast: 100,
        invert: 0,
    };
    const mockCombiningObject = {
        name: '',
        type: '',
        description: '',
        shape: '',
        background_color: '',
        alphanumeric: '',
        alphanumeric_color: '',
    };

    beforeEach(() =>
    {
        leftPanel = shallow(
            <LeftPanel
                imageList={[]}
                objectList={[]}
                selectImage={imageIndex => jest.fn(imageIndex)}
                nextImage={mockNextImage}
                prevImage={mockPrevImage}
                changeImageProcessed={(index, status) => jest.fn(index, status)}
                currentImage={{ name: '', index: 0 }}
                visibility={mockVisibility}
                showImageSection={visibility => jest.fn(visibility)}
                imageHdg="0"
                currentObject={mockCurrentObject}
                closeObjects={[]}
                objectStatus={mockObjectStatus}
                clearObject={() => jest.fn()}
                cancelObject={() => jest.fn()}
                updateObject={objData => jest.fn(objData)}
                confirmObject={() => jest.fn()}
                deleteObject={() => jest.fn()}
                currentObjectId={null}
                imageFilter={mockFilter}
                updateFilters={(brightness, saturation, contrast) =>
                    jest.fn(brightness, saturation, contrast)
                }
                combiningObject={mockCombiningObject}
                loadCombiningObject={name => jest.fn(name)}
            />,
        );
    });

    test('Left Right, a+d arrow keys work', () =>
    {
        // Image Section is not visible, object is being created, should not be able to use a+d
        mockObjectStatus = ObjectStatus.CREATING;
        leftPanel.setProps({ objectStatus: mockObjectStatus });

        leftPanel.instance().handleKeyPress('left');
        leftPanel.instance().handleKeyPress('right');
        leftPanel.instance().handleKeyPress('a');
        leftPanel.instance().handleKeyPress('d');
        expect(mockNextImage).toHaveBeenCalledTimes(0);
        expect(mockPrevImage).toHaveBeenCalledTimes(0);

        // Image Section is visible, object is being created, should not be able to use a+d
        mockVisibility = {
            imageSectionVisible: true,
            objectSectionVisible: false,
        };
        leftPanel.setProps({ visibility: mockVisibility });

        leftPanel.instance().handleKeyPress('left');
        leftPanel.instance().handleKeyPress('right');
        leftPanel.instance().handleKeyPress('a');
        leftPanel.instance().handleKeyPress('d');
        expect(mockNextImage).toHaveBeenCalledTimes(0);
        expect(mockPrevImage).toHaveBeenCalledTimes(0);

        // Image Section is visible, existing object being viewed, should not be able to use a+d
        mockObjectStatus = ObjectStatus.LOADED;
        leftPanel.setProps({ objectStatus: mockObjectStatus });

        leftPanel.instance().handleKeyPress('left');
        leftPanel.instance().handleKeyPress('right');
        leftPanel.instance().handleKeyPress('a');
        leftPanel.instance().handleKeyPress('d');
        expect(mockNextImage).toHaveBeenCalledTimes(0);
        expect(mockPrevImage).toHaveBeenCalledTimes(0);

        // Image Section is visible, should be able to use a+d
        mockObjectStatus = ObjectStatus.DEFAULT;
        leftPanel.setProps({ objectStatus: mockObjectStatus });

        leftPanel.instance().handleKeyPress('left');
        leftPanel.instance().handleKeyPress('right');
        leftPanel.instance().handleKeyPress('a');
        leftPanel.instance().handleKeyPress('d');
        expect(mockNextImage).toHaveBeenCalledTimes(2);
        expect(mockPrevImage).toHaveBeenCalledTimes(2);

        // Blank key press will not do anything
        leftPanel.instance().handleKeyPress();
        expect(mockNextImage).toHaveBeenCalledTimes(2);
        expect(mockPrevImage).toHaveBeenCalledTimes(2);
    });
});

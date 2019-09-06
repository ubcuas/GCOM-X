import React from 'react';
import { mount } from 'enzyme';
import ImageSection from '../ImageSection';
import { ObjectStatus, ProcessedStatus } from '../../Imp';

describe('ImageSection', () =>
{
    let imageSection;
    const mockImageList = [
        {
            name: 'horse.jpg',
            processed_flag: 0,
        },
        {
            name: 'Steampunk-city-street.jpg',
            processed_flag: 0,
        },
        {
            name: 'world-map.jpeg',
            processed_flag: 0,
        },
    ];
    const mockImpState = {
        imageList: mockImageList,
        currentImage: {
            name: null,
            index: null,
        },
        leftPanelVisibility: {
            imageSectionVisible: false,
            objectSectionVisible: true,
        },
        objectStatus: ObjectStatus.DEFAULT,
    };
    const mockChangeImageProcessed = jest.fn((index, status) =>
    {
        mockImpState.imageList[index].processed_flag = status;
        imageSection.setProps({ imageList: mockImpState.imageList });
    });
    const mockDisplayImage = jest.fn((name) =>
    {
        const imageIndex = mockImpState.imageList.findIndex(image => image.name === name);
        mockImpState.currentImage.index = imageIndex;
        mockImpState.currentImage.name = mockImpState.imageList[imageIndex].name;
        imageSection.setProps({ currentImage: mockImpState.currentImage });
        mockChangeImageProcessed(imageIndex, ProcessedStatus.PROCESSED);
    });
    // TODO: test filters
    const mockFilter = {
        brightness: 100,
        saturation: 100,
        contrast: 100,
        invert: 0,
    };

    beforeEach(() =>
    {
        imageSection = mount(
            <ImageSection
                imageList={mockImpState.imageList}
                selectImage={name => mockDisplayImage(name)}
                currentImage={mockImpState.currentImage}
                visibility={mockImpState.leftPanelVisibility.imageSectionVisible}
                changeImageProcessed={(index, status) => mockChangeImageProcessed(index, status)}
                objectStatus={mockImpState.objectStatus}
                imageFilter={mockFilter}
                updateFilters={(brightness, saturation, contrast) =>
                    jest.fn(brightness, saturation, contrast)
                }
            />,
        );
    });
    afterEach(() =>
    {
        jest.clearAllMocks();
        mockImpState.currentImage.index = null;
    });

    test('ImageSection is not visible', () =>
    {
        mockImpState.leftPanelVisibility = {
            imageSectionVisible: false,
            objectSectionVisible: true,
        };
        imageSection.setProps({ visibility: mockImpState.leftPanelVisibility.imageSectionVisible });
        expect(imageSection.props().visibility).toBeFalsy();
    });

    test('ImageSection is now visible', () =>
    {
        mockImpState.leftPanelVisibility = {
            imageSectionVisible: true,
            objectSectionVisible: false,
        };
        imageSection.setProps({ visibility: mockImpState.leftPanelVisibility.imageSectionVisible });
        expect(imageSection.props().visibility).toBeTruthy();
    });

    test('Initially all images are unprocessed', () =>
    {
        expect(imageSection.find('.btn-processed').length).toBe(0);
    });

    test('On image click, it now changes to processed', () =>
    {
        imageSection.find('.imageListItem').first().simulate('click');
        imageSection.find('.imageListItem').at(1).simulate('click');
        expect(imageSection.find('.btn-processed').length).toBe(1);
    });

    test('On all image click, all change to processed', () =>
    {
        imageSection.find('.imageListItem').first().simulate('click');
        imageSection.find('.imageListItem').at(1).simulate('click');
        imageSection.find('.imageListItem').at(2).simulate('click');

        expect(imageSection.find('.btn-processed').length).toBe(2);
    });

    test('On checkbox check, image changes to saved', () =>
    {
        imageSection.find('.imageListItem').first().simulate('click');
        imageSection.find('.imageSaveCheckBox').first().simulate('change', {
            target: {
                checked: true,
            },
        });
        imageSection.find('.imageListItem').at(1).simulate('click');

        expect(imageSection.find('.btn-warning').text()).toBe(mockImageList[0].name);
    });

    test('On saved image click, image changes to processed', () =>
    {
        imageSection.find('.imageListItem').first().simulate('click');
        imageSection.find('.imageSaveCheckBox').first().simulate('change', {
            target: {
                checked: true,
            },
        });
        imageSection.find('.imageListItem').at(1).simulate('click');
        imageSection.find('.btn-warning').simulate('click');

        expect(imageSection.find('.btn-primary').text()).toBe(mockImageList[0].name);
    });

    test('On checkbox uncheck, image changes to processed', () =>
    {
        imageSection.find('.imageListItem').first().simulate('click');
        imageSection.find('.imageSaveCheckBox').first().simulate('change', {
            target: {
                checked: true,
            },
        });
        imageSection.find('.imageSaveCheckBox').first().simulate('change', {
            target: {
                checked: false,
            },
        });

        expect(imageSection.find('.btn-primary').text()).toBe(mockImageList[0].name);
    });
});

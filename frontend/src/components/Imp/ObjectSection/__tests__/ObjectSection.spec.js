import React from 'react';
import { mount } from 'enzyme';
import ObjectSection from '../ObjectSection';
import { ObjectStatus } from '../../Imp';

jest.mock('react-canvas-knob');

describe('ObjectSection', () =>
{
    const mockImpState = {
        objectList: ['Object-1', 'object-a', 'object.'],
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
            image_source: '',
            pixel_location: {
                x: '',
                y: '',
                w: '',
                h: '',
            },
        },
        leftPanelVisibility: {
            imageSectionVisible: true,
            objectSectionVisible: false,
        },
        objectStatus: ObjectStatus.DEFAULT,
    };

    const mockUpdateObject = jest.fn((objData) =>
    {
        const { latitude, longitude, name, type, description, shape, background_color,
                alphanumeric, alphanumeric_color, orientation, image_source, pixel_location } =
                mockImpState.currentObject;

        const { objLat, objLon,
                objName, objType, objDescription, objShape, objBackgroundColor,
                objAlphanumeric, objAlphanumericColor, objOrientation,
                objImageSource,
                objPixelLocationX, objPixelLocationY, objPixelLocationW, objPixelLocationH }
                = objData;

        mockImpState.currentObject = {
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
        };
    });

    const mockClearObject = jest.fn(() =>
    {
        const { latitude, longitude, image_source } = mockImpState.currentObject;

        mockUpdateObject({
            objLat: latitude,
            objLon: longitude,
            objName: '',
            objType: '',
            objDescription: '',
            objShape: '',
            objBackgroundColor: '',
            objAlphanumeric: '',
            objAlphanumericColor: '',
            objOrientation: '',
            objImageSource: image_source,
        });
    });

    const mockCancelObject = jest.fn(() =>
    {
        const { objectStatus } = mockImpState;

        mockImpState.objectStatus = (objectStatus === ObjectStatus.CREATING) ?
                                     ObjectStatus.CANCELLED : ObjectStatus.DEFAULT;

        mockUpdateObject({
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
            objImageSource: '',
        });

        mockImpState.leftPanelVisibility = {
            imageSectionVisible: true,
            objectSectionVisible: false,
        };
    });
    const mockCombiningObject = {
        name: '',
        type: '',
        description: '',
        shape: '',
        background_color: '',
        alphanumeric: '',
        alphanumeric_color: '',
    };

    const mockConfirmObject = jest.fn();
    const mockImageHdg = '0';

    let objectSection;

    beforeEach(() =>
    {
        objectSection = mount(
            <ObjectSection
                visibility={mockImpState.leftPanelVisibility.objectSectionVisible}
                objectList={mockImpState.objectList}
                currentObject={mockImpState.currentObject}
                clearObject={() => mockClearObject()}
                cancelObject={() => mockCancelObject()}
                updateObject={objInfo => mockUpdateObject(objInfo)}
                confirmObject={type => mockConfirmObject(type)}
                objectStatus={mockImpState.objectStatus}
                imageHdg={mockImageHdg}
                closeObjects={[]}
                loadCombiningObject={name => jest.fn(name)}
                combiningObject={mockCombiningObject}
            />,
        );
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    test('ObjectSection is not visible', () =>
    {
        expect(objectSection.props().visibility).toBeFalsy();
    });

    test('ObjectSection is visible', () =>
    {
        mockImpState.leftPanelVisibility = {
            imageSectionVisible: false,
            objectSectionVisible: true,
        };
        objectSection.setProps({
            visibility: mockImpState.leftPanelVisibility.objectSectionVisible,
        });
        expect(objectSection.props().visibility).toBeTruthy();
    });

    const testInput = (inputClass, inputProperty, testList, expectedList) =>
    {
        let currentObjectItem;
        const updateCurrentObjectItem = (item) =>
        {
            if (typeof item !== 'undefined')
                mockImpState.currentObject[inputProperty] = item;

            currentObjectItem = mockImpState.currentObject[inputProperty];
        };

        const input = objectSection.find(inputClass);
        for (let listIndex = 0; listIndex < testList.length; listIndex += 1)
        {
            const item = testList[listIndex];
            let inputtedItem = '';
            for (let charIndex = 0; charIndex < item.length; charIndex += 1)
            {
                input.simulate('change', { target: { value: item.substr(0, charIndex + 1) } });

                updateCurrentObjectItem();
                if (currentObjectItem !== inputtedItem)
                {
                    inputtedItem += item[charIndex];

                    updateCurrentObjectItem(inputtedItem);
                }
                objectSection.setProps({ currentObject: mockImpState.currentObject });
            }
            expect(currentObjectItem).toBe(expectedList[listIndex]);
        }
    };

    test('Object name accepts everything but trims spaces', () =>
    {
        const validList = ['Object', 'object123a', 'object!@#$%^&[]\\'];
        const validListWithSpaces = [' Object', 'object123a ', 'object!@# $%^&[]\\'];

        testInput('.objectName', 'name', validList, validList);
        testInput('.objectName', 'name', validListWithSpaces, validList);
    });

    test('Object name must be unique', () =>
    {
        const nameList = ['Object-1', 'object-a', 'object.'];
        const expectedList = ['Object-', 'object-', 'object'];

        testInput('.objectName', 'name', nameList, expectedList);
    });

    test('Object alphanumeric input accepts a single letter or number', () =>
    {
        const validList = ['a', 'b', 'Z', '8'];
        const invalidList = ['!@$%', 'as', 'ba>a'];
        const expectedList = ['', 'a', 'b'];

        testInput('.objectAlphanumeric', 'alphanumeric', validList, validList);
        testInput('.objectAlphanumeric', 'alphanumeric', invalidList, expectedList);
    });

    test('Object alphanumeric orientation input displays a corresponding orientation letter',
    () =>
    {
        // TODO
        // const validList = ['0', '0.001', '123.4567', '259.0001', '247.5', '359.9999'];
        // const expectedListValid = ['E', 'E', 'SW', 'N', 'NW', 'E'];

        // const orientationRelProperty = '.objectOrientationRel';
        // const orientationAbsProperty = '.objectOrientationAbs';
        // const orientationRelInput = objectSection.find(orientationRelProperty);
        // const orientationAbsInput = objectSection.find(orientationAbsProperty);

        // const testOrientation = (inputList, outputList) =>
        // {
        //     for (let listIndex = 0; listIndex < inputList.length; listIndex += 1)
        //     {
        //         const item = inputList[listIndex];
        //         orientationRelInput.simulate('change', { value: item });
        //         objectSection.setProps({ currentObject: mockImpState.currentObject });
        //         expect(orientationAbsInput.instance().value).toBe(outputList[listIndex]);
        //     }
        // };

        // mockImageHdg = '90';
        // objectSection.setProps({ imageHdg: mockImageHdg });
        // testOrientation(validList, expectedListValid);
    });

    test('Object Clear works', () =>
    {
        mockUpdateObject({
            objImageSource: 'image.jpg',
            objLat: '49.1',
            objLon: '-123.1',
            objName: 'object',
            objType: 'standard',
            objDescription: 'description',
            objShape: 'shape',
            objBackgroundColor: 'backgroundColor',
            objAlphanumeric: 'A',
            objAlphanumericColor: 'alphaColor',
            objOrientation: 'alpaOrient',
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        objectSection.find('.objectClear').simulate('click');
        expect(mockClearObject).toHaveBeenCalledTimes(1);
        expect(mockImpState.leftPanelVisibility).toEqual({
            imageSectionVisible: false,
            objectSectionVisible: true,
        });
        expect(mockImpState.currentObject).toEqual({
            latitude: '49.1',
            longitude: '-123.1',
            name: '',
            type: '',
            description: '',
            shape: '',
            background_color: '',
            alphanumeric: '',
            alphanumeric_color: '',
            orientation: '',
            image_source: 'image.jpg',
            pixel_location: {
                x: '',
                y: '',
                w: '',
                h: '',
            },
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        expect(objectSection.find('.objectInput').map(input => input.props().value))
        .toEqual(['', '', '']);
        expect(objectSection.find('.objectInputReadOnly').map(input => input.props().value))
        .toEqual(['image.jpg', '49.1', '-123.1']);
    });

    test('Object Cancel works', () =>
    {
        mockUpdateObject({
            objLat: '49.1',
            objLon: '-123.1',
            objName: 'object',
            objType: 'standard',
            objDescription: 'description',
            objShape: 'shape',
            objBackgroundColor: 'backgroundColor',
            objAlphanumeric: 'A',
            objAlphanumericColor: 'alphaColor',
            objOrientation: 'alpaOrient',
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        objectSection.find('.objectCancel').simulate('click');
        expect(mockCancelObject).toHaveBeenCalledTimes(1);
        expect(mockImpState.leftPanelVisibility).toEqual({
            imageSectionVisible: true,
            objectSectionVisible: false,
        });
        expect(mockImpState.currentObject).toEqual({
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
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        expect(objectSection.find('.objectInput').map(input => input.props().value))
        .toEqual(['', '', '']);
        expect(objectSection.find('.objectInputReadOnly').map(input => input.props().value))
        .toEqual(['', '', '']);
    });

    test('Object Delete works', () =>
    {
        objectSection.find('.objectDelete').simulate('click');
        expect(mockConfirmObject).toHaveBeenCalledTimes(0);

        mockImpState.objectStatus = ObjectStatus.LOADED;
        objectSection.setProps({ objectStatus: mockImpState.objectStatus });
        objectSection.find('.objectDelete').simulate('click');
        expect(mockConfirmObject).toHaveBeenCalledTimes(1);
    });

    test('Object Save works', () =>
    {
        objectSection.find('.objectSave').simulate('click');
        expect(mockConfirmObject).toHaveBeenCalledTimes(0);

        objectSection.find('.objectName').simulate('change', {
            target: { value: 'name' },
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        objectSection.find('.objectSave').simulate('click');
        expect(mockConfirmObject).toHaveBeenCalledTimes(1);
    });

    test('Object type standard', () =>
    {
        mockUpdateObject({
            objLat: '49.1',
            objLon: '-123.1',
            objName: 'object',
            objType: 'standard',
            objAlphanumeric: '',
            objOrientation: '',
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        objectSection.find('.objectSave').simulate('click');
        expect(objectSection.find('.objectInput').map(input => input.props().value))
        .toEqual(['object', '', '']);
    });

    test('Object type emergent', () =>
    {
        mockUpdateObject({
            objImageSource: 'image.jpg',
            objLat: '49.1',
            objLon: '-123.1',
            objName: 'object',
            objType: 'emergent',
            objDescription: '',
        });
        objectSection.setProps({ currentObject: mockImpState.currentObject });
        objectSection.find('.objectSave').simulate('click');
        expect(objectSection.find('.objectInput').map(input => input.props().value))
        .toEqual(['object', '']);
    });
});

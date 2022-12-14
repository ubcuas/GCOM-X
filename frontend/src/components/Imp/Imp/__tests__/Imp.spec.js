import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';
import Imp, { ObjectStatus, ConfirmObjectModalType, ProcessedStatus,
              PROXIMITY_THRESHOLD } from '../Imp';
import UASWebSocket from '../../../../../utils/UASWebSocket';

jest.mock('axios');

describe('Imp', () =>
{
    let imp;

    const mockImageList = {
        data: [
            {
                id: 1,
                name: 'horse.jpg',
                processed_flag: 0,
                timeStamp: '2018-07-06T09:00:00-07:00',
                latitude: '49.10000000',
                longitude: '-123.10000000',
                altitude: '300.0000',
                heading: '0.0000',
                width: '40.0000',
                height: '30.0000',
            },
        ],
    };
    const mockImageItem = {
        id: 2,
        name: 'Steampunk-city-street.jpg',
        processed_flag: 0,
        timeStamp: '2018-07-06T09:00:00-07:00',
        latitude: '38.14725000',
        longitude: '-76.42644400',
        altitude: '300.0000',
        heading: '225.0000',
        width: '30.0000',
        height: '60.0000',
    };
    const mockImageItem2 = {
        id: 3,
        name: '1.jpg',
        processed_flag: 0,
        timeStamp: '2018-07-06T09:00:00-07:00',
        latitude: '38.14725000',
        longitude: '-76.42644400',
        altitude: '300.0000',
        heading: '225.0000',
        width: '30.0000',
        height: '60.0000',
    };

    const mockObjectList = {
        data: [
            {
                id: 1,
                latitude: '49.1',
                longitude: '-123.1',
                type: 'standard',
                name: 'object',
                description: 'description',
                shape: 'rectangle',
                background_color: 'red',
                alphanumeric: 'T',
                alphanumeric_color: 'yellow',
                orientation: 'NE',
                orientationAbs: 315,
                image_source: 'image.jpg',
                x: '0.5',
                y: '0.5',
                w: '0.123',
                h: '0.123',
            },
        ],
    };
    const mockObjectItem = {
        id: 2,
        latitude: '123.1',
        longitude: '-23.1',
        type: 'standard',
        name: 'name',
        description: 'description',
        shape: 'shape',
        background_color: 'backgroundColor',
        alphanumeric: 'W',
        alphanumeric_color: 'color',
        orientation: 'NE',
        orientationAbs: 315,
        image_source: 'horse.jpg',
        x: '1',
        y: '1',
        w: '0.2',
        h: '0.2',
    };

    const mockObjectItem2 = {
        id: 3,
        latitude: '49.1',
        longitude: '-123.1',
        name: '2',
        description: '2',
        shape: 'shape',
        background_color: 'backgroundColor',
        alphanumeric: 'W',
        alphanumeric_color: 'color',
        orientation: 'NE',
        orientationAbs: 315,
        image_source: 'horse.jpg',
        x: '1',
        y: '1',
        w: '0.2',
        h: '0.2',
    };

    const testObject = {
        latitude: '49.1',
        longitude: '-123.1',
        name: 'object',
        type: 'standard',
        description: 'description',
        shape: 'rectangle',
        background_color: 'red',
        alphanumeric: 'T',
        alphanumeric_color: 'yellow',
        orientation: 'NE',
        image_source: 'image.jpg',
        pixel_location: {
            x: '0.5',
            y: '0.5',
            w: '0.123',
            h: '0.123',
        },
    };
    const emptyObject = {
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
    };

    beforeEach(() =>
    {
        imp = shallow(<Imp />);
        imp.instance().handleImageMessage({
            data: JSON.stringify(mockImageList.data),
        });
        imp.instance().handleObjectMessage({
            data: JSON.stringify(mockObjectList.data),
        });
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    test('Sockets are setup', () =>
    {
        expect(imp.state().imageSocket instanceof UASWebSocket).toBeTruthy();
        expect(imp.state().objectSocket instanceof UASWebSocket).toBeTruthy();
    });

    test('Image message handler', () =>
    {
        mockImageList.data.push(mockImageItem2);
        mockImageList.data.push(mockImageItem);

        imp.instance().handleImageMessage({
            data: JSON.stringify(mockImageList.data),
        });

        mockImageList.data.pop();
        mockImageList.data.pop();
        mockImageList.data.push(mockImageItem);
        mockImageList.data.push(mockImageItem2);

        expect(imp.state().imageList).toEqual(mockImageList.data);
    });

    test('Object message handler', () =>
    {
        mockObjectList.data.push(mockObjectItem2);
        mockObjectList.data.push(mockObjectItem);

        imp.instance().handleObjectMessage({
            data: JSON.stringify(mockObjectList.data),
        });

        mockObjectList.data.pop();
        mockObjectList.data.pop();
        mockObjectList.data.push(mockObjectItem);
        mockObjectList.data.push(mockObjectItem2);

        expect(imp.state().objectList).toEqual(mockObjectList.data);
    });

    test('displayImage correctly sets state and clears old objects', () =>
    {
        imp.instance().changeImageProcessed = jest.fn();

        for (let i = 0; i < mockImageList.data.length; i += 1)
        {
            imp.setState({ currentObject: testObject });
            imp.instance().displayImage(i);
            expect(imp.state().currentImage.name).toBe(mockImageList.data[i].name);
            expect(imp.state().currentImage.index).toBe(i);
            expect(imp.state().currentObject).toEqual(emptyObject);
            expect(imp.state().objectStatus).toBe(ObjectStatus.DEFAULT);
            expect(imp.instance().changeImageProcessed).toHaveBeenCalledTimes(i + 1);
        }
        expect(() =>
        {
            imp.instance().displayImage(-1);
        }).toThrowError(RangeError);
        expect(() =>
        {
            imp.instance().displayImage(mockImageList.data.length);
        }).toThrowError(RangeError);
    });

    test('changeImageProcessed', () =>
    {
        expect(imp.instance().changeImageProcessed(-1, ProcessedStatus.PROCESSED)).toBeFalsy();

        expect(imp.instance().changeImageProcessed(mockImageList.data.length,
        ProcessedStatus.PROCESSED)).toBeFalsy();

        expect(imp.instance().changeImageProcessed(0, ProcessedStatus.PROCESSED)).toBeTruthy();
    });

    test('selectImage', () =>
    {
        imp.instance().selectImage('horse.jpg');
        expect(imp.state().currentImage).toEqual({
            name: 'horse.jpg',
            index: 0,
        });
        expect(imp.state().imageHistory.val()).toBe(0);

        imp.instance().selectImage('Steampunk-city-street.jpg');
        expect(imp.state().currentImage).toEqual({
            name: 'Steampunk-city-street.jpg',
            index: 1,
        });
        expect(imp.state().imageHistory.val()).toBe(1);

        expect(() =>
        {
            imp.instance().selectImage('Steampunk-city-street.jpeg');
        }).toThrowError(RangeError);
    });

    test('nextImage works correctly sequentially', () =>
    {
        imp.instance().nextImage();
        expect(imp.state().currentImage).toEqual({
            name: null,
            index: null,
        });

        imp.instance().selectImage('horse.jpg');

        imp.instance().nextImage();
        expect(imp.state().currentImage).toEqual({
            name: 'Steampunk-city-street.jpg',
            index: 1,
        });

        imp.instance().nextImage();
        expect(imp.state().currentImage).toEqual({
            name: '1.jpg',
            index: 2,
        });

        imp.instance().nextImage();
        expect(imp.state().currentImage).toEqual({
            name: '1.jpg',
            index: 2,
        });
    });

    test('nextImage jumps to the next unprocessed imaged', () =>
    {
        mockImageList.data[1].processed_flag = ProcessedStatus.PROCESSED;

        imp.instance().handleImageMessage({
            data: JSON.stringify(mockImageList.data),
        });

        imp.instance().selectImage('horse.jpg');
        imp.instance().nextImage();
        expect(imp.state().currentImage).toEqual({
            name: '1.jpg',
            index: 2,
        });
    });

    test('prevImage', () =>
    {
        imp.instance().prevImage();
        expect(imp.state().currentImage).toEqual({
            name: null,
            index: null,
        });

        imp.instance().selectImage('horse.jpg');
        imp.instance().selectImage('Steampunk-city-street.jpg');

        imp.instance().prevImage();
        expect(imp.state().currentImage).toEqual({
            name: 'horse.jpg',
            index: 0,
        });

        imp.instance().prevImage();
        expect(imp.state().currentImage).toEqual({
            name: 'horse.jpg',
            index: 0,
        });
    });

    test('selectImage correctly discards history', () =>
    {
        imp.instance().selectImage('horse.jpg');
        imp.instance().selectImage('Steampunk-city-street.jpg');
        imp.instance().selectImage('1.jpg');
        imp.instance().prevImage();
        imp.instance().prevImage();
        imp.instance().selectImage('1.jpg');

        imp.instance().prevImage();
        expect(imp.state().currentImage).toEqual({
            name: 'horse.jpg',
            index: 0,
        });
    });

    const flushPromises = () => new Promise(resolve => setImmediate(resolve));

    const populateCurrentObjectReadOnly = () =>
    {
        imp.setState({ currentImage: { name: mockImageList.data[0].name, index: 0 } });

        const percentageOffset = {
            x: 0.25,
            y: 0.25,
        };
        const pixelLocation = {
            x: 0.1,
            y: 0.2,
            w: 0.3,
            h: 0.4,
        };

        axios.post.mockResolvedValue({ data: { latitude: 49.10006737, longitude: -123.09986280 } });
        imp.instance().createObject(percentageOffset, pixelLocation);
    };

    const populateCurrentObject = () =>
    {
        populateCurrentObjectReadOnly();

        imp.instance().updateObject({
            objName: 'object',
            objType: 'standard',
            objDescription: 'description',
            objShape: 'shape',
            objBackgroundColor: 'backgroundColor',
            objAlphanumeric: 'A',
            objAlphanumericColor: 'color',
            objOrientation: 'N',
            objOrientationAbs: 0,
        });
    };

    const populatedObjectReadOnly = {
        latitude: '49.10006737',
        longitude: '-123.09986280',
        name: '',
        type: 'standard',
        description: '',
        shape: '',
        background_color: '',
        alphanumeric: '',
        alphanumeric_color: '',
        orientation: '',
        orientationAbs: 0,
        image_source: 'horse.jpg',
        pixel_location: {
            x: '0.10000',
            y: '0.20000',
            w: '0.30000',
            h: '0.40000',
        },
    };

    const populatedObject = {
        latitude: '49.10006737',
        longitude: '-123.09986280',
        name: 'object',
        type: 'standard',
        description: 'description',
        shape: 'shape',
        background_color: 'backgroundColor',
        alphanumeric: 'A',
        alphanumeric_color: 'color',
        orientation: 'N',
        orientationAbs: 0,
        image_source: 'horse.jpg',
        pixel_location: {
            x: '0.10000',
            y: '0.20000',
            w: '0.30000',
            h: '0.40000',
        },
    };

    test('createObject', async () =>
    {
        populateCurrentObjectReadOnly();
        await flushPromises();  // Wait for promises to finish resolving
        expect(imp.state().objectStatus).toBe(ObjectStatus.CREATING);
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: false,
            objectSectionVisible: true,
        });
        expect(imp.state().currentObject).toEqual(populatedObjectReadOnly);
    });

    test('clearObject', async () =>
    {
        populateCurrentObject();
        await flushPromises();  // Wait for promises to finish resolving
        expect(imp.state().currentObject).toEqual(populatedObject);

        imp.instance().clearObject();

        expect(imp.state().objectStatus).toBe(ObjectStatus.CREATING);
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: false,
            objectSectionVisible: true,
        });
        expect(imp.state().currentObject).toEqual(populatedObjectReadOnly);
    });

    test('cancelObject', async () =>
    {
        populateCurrentObject();
        await flushPromises();  // Wait for promises to finish resolving
        expect(imp.state().currentObject).toEqual(populatedObject);

        imp.instance().cancelObject();
        expect(imp.state().objectStatus).toBe(ObjectStatus.CANCELLED);
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: true,
            objectSectionVisible: false,
        });
        expect(imp.state().currentObject).toEqual(emptyObject);
        expect(imp.state().undoneObject).toEqual(populatedObject);
        expect(imp.state().currentObjectId).toBeNull();
    });

    test('redoObject', async () =>
    {
        populateCurrentObject();
        await flushPromises();  // Wait for promises to finish resolving
        expect(imp.state().currentObject).toEqual(populatedObject);

        imp.instance().cancelObject();
        imp.instance().redoObject();

        expect(imp.state().objectStatus).toBe(ObjectStatus.CREATING);
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: false,
            objectSectionVisible: true,
        });
        expect(imp.state().currentObject).toEqual(populatedObject);
        expect(imp.state().undoneObject).toBeNull();
    });

    test('open and closeConfirmObjectModal', () =>
    {
        imp.instance().openConfirmObjectModal(ConfirmObjectModalType.SAVE);
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: true,
            type: ConfirmObjectModalType.SAVE,
        });
        imp.instance().closeConfirmObjectModal();
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: false,
            type: ConfirmObjectModalType.SAVE,
        });

        imp.instance().openConfirmObjectModal(ConfirmObjectModalType.DELETE);
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: true,
            type: ConfirmObjectModalType.DELETE,
        });
        imp.instance().closeConfirmObjectModal();
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: false,
            type: ConfirmObjectModalType.DELETE,
        });
    });

    test('saveConfirmObjectModal', async () =>
    {
        const postSpy = jest.spyOn(UASWebSocket.prototype, 'post');
        imp.instance().openConfirmObjectModal(ConfirmObjectModalType.SAVE);
        imp.instance().saveConfirmObjectModal();
        expect(postSpy).toHaveBeenCalledTimes(1);

        expect(imp.state().objectStatus).toBe(ObjectStatus.SAVED);
        expect(imp.state().currentObject).toEqual(emptyObject);
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: false,
            type: ConfirmObjectModalType.SAVE,
        });
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: true,
            objectSectionVisible: false,
        });
        expect(imp.state().currentObjectId).toBeNull();

        const putSpy = jest.spyOn(UASWebSocket.prototype, 'put');
        imp.instance().loadObject(1);
        imp.instance().openConfirmObjectModal(ConfirmObjectModalType.SAVE);
        imp.instance().saveConfirmObjectModal();
        expect(putSpy).toHaveBeenCalledTimes(1);

        expect(imp.state().objectStatus).toBe(ObjectStatus.SAVED);
        expect(imp.state().currentObject).toEqual(emptyObject);
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: false,
            type: ConfirmObjectModalType.SAVE,
        });
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: true,
            objectSectionVisible: false,
        });
        expect(imp.state().currentObjectId).toBeNull();

        const deleteSpy = jest.spyOn(UASWebSocket.prototype, 'delete');
        imp.instance().openConfirmObjectModal(ConfirmObjectModalType.DELETE);
        imp.instance().saveConfirmObjectModal();
        expect(deleteSpy).toHaveBeenCalledTimes(1);

        expect(imp.state().objectStatus).toBe(ObjectStatus.DEFAULT);
        expect(imp.state().currentObject).toEqual(emptyObject);
        expect(imp.state().confirmObjectModal).toEqual({
            isOpen: false,
            type: ConfirmObjectModalType.DELETE,
        });
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: true,
            objectSectionVisible: false,
        });
        expect(imp.state().currentObjectId).toBeNull();
    });

    test('loadObject', async () =>
    {
        populateCurrentObjectReadOnly();
        await flushPromises();  // Wait for promises to finish resolving
        imp.instance().loadObject(1);
        expect(imp.state().objectStatus).toEqual(ObjectStatus.CREATING);
        expect(imp.state().currentObjectId).toBeNull();

        imp.instance().cancelObject();
        imp.instance().loadObject(1);
        expect(imp.state().objectStatus).toEqual(ObjectStatus.LOADED);
        expect(imp.state().currentObjectId).toBe(1);
        expect(imp.state().currentObject).toEqual(testObject);
        expect(imp.state().leftPanelVisibility).toEqual({
            imageSectionVisible: false,
            objectSectionVisible: true,
        });
    });

    test('updateImageHdg', async () =>
    {
        const imageItem = mockImageList.data[0];
        mockImageList.data = [];

        imp.instance().handleImageMessage({
            data: JSON.stringify(mockImageList.data),
        });

        expect(imp.state().imageHdg).toBeNull();

        mockImageList.data.push(imageItem);
        mockImageList.data.push(mockImageItem);

        imp.instance().handleImageMessage({
            data: JSON.stringify(mockImageList.data),
        });

        expect(imp.state().imageHdg).toBeNull();

        imp.setState({ objectStatus: ObjectStatus.SAVED });
        imp.instance().displayImage(1);
        expect(imp.state().imageHdg).toBe('225.0000');

        imp.instance().loadObject(2);
        expect(imp.state().imageHdg).toBe('0.0000');
    });

    test('calculateObjectDistance', () =>
    {
        const testPositions = [
            {
                a: {
                    latitude: 0,
                    longitude: 0,
                },
                b: {
                    latitude: 0,
                    longitude: 0,
                },
            },
            {
                a: {
                    latitude: 49.10000000,
                    longitude: -123.0997253,
                },
                b: {
                    latitude: 49.1001349,
                    longitude: -123.1,
                },
            },
            {
                a: {
                    latitude: 38.147155,
                    longitude: -76.426565,
                },
                b: {
                    latitude: 38.147059,
                    longitude: -76.4262017,
                },
            },
            {
                a: {
                    latitude: -10,
                    longitude: 10,
                },
                b: {
                    latitude: -9.9998,
                    longitude: 10.0002,
                },
            },
            {
                a: {
                    latitude: 49,
                    longitude: 49,
                },
                b: {
                    latitude: 49.000001,
                    longitude: 49.000001,
                },
            },
        ];

        const expectedDistance = [
            0,
            25.0,
            33.6,
            31.2,
            0.1,
        ];

        for (let i = 0; i < testPositions.length; i += 1)
        {
            expect(Imp.calculateObjectDistance(testPositions[i].a, testPositions[i].b))
            .toBeCloseTo(expectedDistance[i], 1);
        }
    });

    test('findCloseObjects', () =>
    {
        mockObjectList.data.pop();

        imp.instance().handleObjectMessage({
            data: JSON.stringify(mockObjectList.data),
        });

        let closeObjects = imp.instance().findCloseObjects(49.10005, -123.1, PROXIMITY_THRESHOLD);
        expect(closeObjects.length).toBe(1);
        expect(closeObjects[0].name).toBe('object');
        expect(closeObjects[0].distance).toBeCloseTo(5.6, 1);

        mockObjectList.data.push(mockObjectItem2);

        imp.instance().handleObjectMessage({
            data: JSON.stringify(mockObjectList.data),
        });

        closeObjects = imp.instance().findCloseObjects(49.10005, -123.1, PROXIMITY_THRESHOLD);
        expect(closeObjects.length).toBe(2);

        closeObjects = imp.instance().findCloseObjects(49.103, -123.1, PROXIMITY_THRESHOLD);
        expect(closeObjects.length).toBe(0);

        mockObjectList.data.pop();
    });
});

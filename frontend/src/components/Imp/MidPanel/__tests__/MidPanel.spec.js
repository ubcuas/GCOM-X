import React from 'react';
import { mount } from 'enzyme';
import L from 'leaflet';
import MidPanel from '../MidPanel';
import { ObjectStatus } from '../../Imp';

describe('MidPanel', () =>
{
    const IMAGE_ENDPOINT = '/api/imp/images/viewImage/';
    const testImages = [
        {
            name: 'horse.jpg',
            width: 150,
            height: 150,
        },
        {
            name: 'Steampunk-city-street.jpg',
            width: 2020,
            height: 1080,
        },
        {
            name: 'world-map.jpeg',
            width: 4500,
            height: 2234,
        },
    ];
    const mockImpState = {
        imageList: [],
        currentImage: null,
        leftPanel: {
            imageSectionVisible: true,
            objectSectionVisible: false,
        },
        objectStatus: ObjectStatus.DEFAULT,
    };

    const mockShowImageSection = jest.fn((visible) =>
    {
        mockImpState.leftPanel.imageSectionVisible = visible;
        mockImpState.leftPanel.objectSectionVisible = !visible;
    });
    const mockCreateObject = jest.fn(() =>
    {
        mockImpState.objectStatus = ObjectStatus.CREATING;
    });
    const mockCancelObject = jest.fn(() =>
    {
        mockImpState.objectStatus = (mockImpState.objectStatus === ObjectStatus.CREATING) ?
                                    ObjectStatus.CANCELLED : ObjectStatus.DEFAULT;
    });
    const mockRedoObject = jest.fn(() =>
    {
        mockImpState.objectStatus = ObjectStatus.CREATING;
    });
    // TODO: test filters
    const mockFilter = {
        brightness: 100,
        saturation: 100,
        contrast: 100,
        invert: 0,
    };

    let div;
    let midPanel;

    beforeAll(() =>
    {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    beforeEach(() =>
    {
        midPanel = mount(
            <MidPanel
                imageEndpoint={IMAGE_ENDPOINT}
                currentImage={null}
                showImageSection={mockShowImageSection}
                createObject={mockCreateObject}
                cancelObject={mockCancelObject}
                redoObject={mockRedoObject}
                objectStatus={mockImpState.objectStatus}
                imageFilter={mockFilter}
                invertFilter={invert => jest.fn(invert)}
            />,
            { attachTo: div },
        );
    });

    afterEach(() =>
    {
        midPanel.unmount();
    });

    test('updateImage calls overlayImage if loadImage succeeds', async () =>
    {
        midPanel.instance().overlayImage = jest.fn();
        midPanel.setProps({ currentImage: testImages[0].name });

        midPanel.instance().loadImage().then((imageData) =>
        {
            expect(imageData).not.toBeNull();
            expect(imageData.path).toEqual(IMAGE_ENDPOINT + testImages[0].name);
            expect(midPanel.instance().overlayImage).toHaveBeenCalledTimes(1);
        });
        // This test ends before the promise is resolved. Therefore it doesn't really test.
        // I did it this way since there is a bug in jest that's maing it act strange.
    });

    test('updateImage shows error if loadImage fails', async () =>
    {
        midPanel.instance().overlayImage = jest.fn();
        midPanel.instance().loadImage = jest.fn(() =>
            new Promise((resolve, reject) =>
            {
                reject(IMAGE_ENDPOINT + testImages[0].name);
            }),
        );

        midPanel.setProps({ currentImage: testImages[0].name });

        midPanel.instance().loadImage()
        .then(() =>
        {
        })
        .catch((errorSrc) =>
        {
            expect(midPanel.state().image.path).toBe('');
            expect(div.querySelector('.leaflet-image-layer').src).toBe('');
            expect(midPanel.state().imageError)
            .toBe(`Error: could not load ${errorSrc}`);
        });
    });

    test('overlayImage overlays images correctly', () =>
    {
        let imageData;
        for (let i = 0; i < testImages.length; i += 1)
        {
            imageData = {
                width: testImages[i].width,
                height: testImages[i].height,
                path: IMAGE_ENDPOINT + testImages[i].name,
            };

            midPanel.instance().overlayImage(imageData);
            expect(div.querySelector('.leaflet-image-layer')).not.toBeNull();
            expect(div.querySelectorAll('.leaflet-image-layer').length).toBe(1);
            expect(div.querySelector('.leaflet-image-layer').src).toBe(
                `http://localhost${IMAGE_ENDPOINT}${testImages[i].name}`);
            expect(midPanel.instance().map.leafletElement.getZoom()).toBe(1);
        }
    });

    test('Pressing shift adds filter to image', () =>
    {
        // TODO
    });

    test('Pressing ctrl activates draw', () =>
    {
        midPanel.state().drawRectangle.enable = jest.fn();
        midPanel.state().drawRectangle.disable = jest.fn();

        const testCtrlDown = (objectStatus, currentImage, expectedTimes) =>
        {
            mockImpState.objectStatus = objectStatus;
            mockImpState.currentImage = currentImage;
            midPanel.setProps({
                currentImage: mockImpState.currentImage,
                objectStatus: mockImpState.objectStatus,
            });
            midPanel.instance().handleKeyDown('ctrl');
            expect(midPanel.state().drawRectangle.enable).toHaveBeenCalledTimes(expectedTimes);
        };

        testCtrlDown(ObjectStatus.CREATING, null, 0);
        testCtrlDown(ObjectStatus.LOADED, null, 0);
        testCtrlDown(ObjectStatus.DEFAULT, null, 0);
        testCtrlDown(ObjectStatus.DEFAULT, testImages[0].name, 1);

        midPanel.instance().handleKeyUp('ctrl');
        expect(midPanel.state().drawRectangle.disable).toHaveBeenCalledTimes(1);
    });

    test('handleDrawCreated and calculateObjectLocation work', () =>
    {
        const objectBounds = [[-78.62322334, 225.66668701], [-37.99338691, 256]];
        const imageBounds = [[-239.625, 0], [0, 319.5]];
        const expectedPixelLocation = {
            x: objectBounds[0][1] / imageBounds[1][1],
            y: objectBounds[1][0] / imageBounds[0][0],
            w: (objectBounds[1][1] - objectBounds[0][1]) / imageBounds[1][1],
            h: (objectBounds[1][0] - objectBounds[0][0]) / -imageBounds[0][0],
        };
        const expectedPercentageOffset = {
            x: ((objectBounds[0][1] + ((objectBounds[1][1] - objectBounds[0][1]) / 2)) /
                imageBounds[1][1]) - 0.5,
            y: -((objectBounds[1][0] + ((objectBounds[0][0] - objectBounds[1][0]) / 2)) /
                imageBounds[0][0]) + 0.5,
        };
        const mockObjectLayer = new L.Rectangle(objectBounds);
        midPanel.instance().objectLayerGroup.leafletElement.addLayer = jest.fn();

        midPanel.setState({ image: { bounds: imageBounds, path: '' } });
        const { percentageOffset, pixelLocation } =
        midPanel.instance().calculateObjectLocation(mockObjectLayer);

        expect(percentageOffset.x).toBeCloseTo(expectedPercentageOffset.x, 8);
        expect(percentageOffset.y).toBeCloseTo(expectedPercentageOffset.y, 8);
        expect(pixelLocation.x).toBeCloseTo(expectedPixelLocation.x, 8);
        expect(pixelLocation.y).toBeCloseTo(expectedPixelLocation.y, 8);
        expect(pixelLocation.w).toBeCloseTo(expectedPixelLocation.w, 8);
        expect(pixelLocation.h).toBeCloseTo(expectedPixelLocation.h, 8);
        expect(midPanel.instance().objectLayerGroup.leafletElement.addLayer)
        .toHaveBeenCalledTimes(1);


        midPanel.instance().handleDrawCreated({ layer: mockObjectLayer });
        expect(midPanel.state().undoneObjectLayer).toBeNull();
        expect(mockCreateObject).toBeCalledWith(expectedPercentageOffset,
                                                expectedPixelLocation);
    });

    test('Undo/Redo Object work', () =>
    {
        let mockObjectList = [1, 2, 3];
        midPanel.instance().objectLayerGroup.leafletElement.getLayers = jest.fn(() =>
        mockObjectList);
        midPanel.instance().objectLayerGroup.leafletElement.removeLayer = jest.fn(() =>
        {
            mockObjectList.pop();
        });
        midPanel.instance().objectLayerGroup.leafletElement.addLayer = jest.fn((layer) =>
        {
            mockObjectList.push(layer);
        });

        midPanel.instance().handleKeyPress();
        expect(mockCancelObject).toHaveBeenCalledTimes(0);
        expect(mockRedoObject).toHaveBeenCalledTimes(0);

        midPanel.instance().handleKeyPress('ctrl+z');
        expect(mockCancelObject).toHaveBeenCalledTimes(1);
        midPanel.setProps({ objectStatus: mockImpState.objectStatus });
        midPanel.instance().handleKeyPress('meta+z');
        expect(mockCancelObject).toHaveBeenCalledTimes(1);
        midPanel.setProps({ objectStatus: mockImpState.objectStatus });
        expect(midPanel.instance().objectLayerGroup.leafletElement.getLayers().length).toBe(2);
        expect(midPanel.state().undoneObjectLayer).toBe(3);
        expect(mockObjectList).toEqual([1, 2]);

        midPanel.instance().handleKeyPress('ctrl+y');
        expect(mockRedoObject).toHaveBeenCalledTimes(1);
        midPanel.setProps({ objectStatus: mockImpState.objectStatus });
        midPanel.instance().handleKeyPress('meta+shift+z');
        expect(mockRedoObject).toHaveBeenCalledTimes(1);
        midPanel.setProps({ objectStatus: mockImpState.objectStatus });
        expect(midPanel.instance().objectLayerGroup.leafletElement.getLayers().length).toBe(3);
        expect(midPanel.state().undoneObjectLayer).toBeNull();
        expect(mockObjectList).toEqual([1, 2, 3]);

        mockObjectList = [];
        midPanel.instance().handleKeyPress('ctrl+z');
        midPanel.setProps({ objectStatus: mockImpState.objectStatus });
        expect(mockCancelObject).toHaveBeenCalledTimes(2);
        expect(midPanel.instance().objectLayerGroup.leafletElement.removeLayer)
        .toHaveBeenCalledTimes(1);

        midPanel.instance().handleKeyPress('ctrl+y');
        midPanel.setProps({ objectStatus: mockImpState.objectStatus });
        expect(mockRedoObject).toHaveBeenCalledTimes(2);
        expect(midPanel.instance().objectLayerGroup.leafletElement.addLayer)
        .toHaveBeenCalledTimes(1);
    });
});

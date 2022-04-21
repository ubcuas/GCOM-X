import React from 'react';
import { shallow } from 'enzyme';
import ConfirmObjectModal from '../ConfirmObjectModal';
import { ObjectStatus, ConfirmObjectModalType } from '../../Imp';

describe('RightPanel', () =>
{
    const mockCurrentObject = {
        latitude: '49.1',
        longitude: '-123.1',
        name: 'object',
        type: 'standard',
        description: 'description',
        shape: 'rectangle',
        background_color: 'red',
        alphanumeric: 'T',
        alphanumeric_color: 'yellow',
        orientation: 'N',
        orientationAbs: 0,
        image_source: 'image.jpg',
        pixel_location: {
            x: '0.5',
            y: '0.5',
            w: '0.123',
            h: '0.123',
        },
    };
    const mockStatus = {
        isOpen: true,
        type: ConfirmObjectModalType.SAVE,
    };
    const mockCloseConfirmObjectModal = jest.fn(() =>
    {
        mockStatus.isOpen = false;
    });
    const mockSaveConfirmObjectModal = jest.fn(() =>
    {
        mockStatus.isOpen = false;
    });

    let confirmObjectModal;

    beforeEach(() =>
    {
        confirmObjectModal = shallow(
            <ConfirmObjectModal
                currentObject={mockCurrentObject}
                status={mockStatus}
                closeConfirmObjectModal={() => mockCloseConfirmObjectModal()}
                saveConfirmObjectModal={() => mockSaveConfirmObjectModal()}
                objectStatus={ObjectStatus.DEFAULT}
            />,
        );
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    test('Modal shows correct object data for save modal', () =>
    {
        expect(confirmObjectModal.find('pre').text())
        .toBe(JSON.stringify(mockCurrentObject, null, 4));
    });

    test('Save/Update button changes text depending on objectStatus', () =>
    {
        expect(confirmObjectModal.find('.saveConfirmObjectModal').text()).toBe('Save');
        confirmObjectModal.setProps({ objectStatus: ObjectStatus.LOADED });
        expect(confirmObjectModal.find('.saveConfirmObjectModal').text()).toBe('Update');
    });

    test('Save button calls correct function and closes the modal', () =>
    {
        confirmObjectModal.find('.saveConfirmObjectModal').simulate('click');
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);
        confirmObjectModal.setProps({ status: mockStatus });
        expect(confirmObjectModal.find('Modal').props().isOpen).toBeFalsy();
    });

    test('Close button calls correct function and closes the modal', () =>
    {
        confirmObjectModal.find('.closeConfirmObjectModal').simulate('click');
        expect(mockCloseConfirmObjectModal).toHaveBeenCalledTimes(1);
        confirmObjectModal.setProps({ status: mockStatus });
        expect(confirmObjectModal.find('Modal').props().isOpen).toBeFalsy();
    });

    test('Enter and Escape keys work', () =>
    {
        mockStatus.isOpen = true;
        confirmObjectModal.setProps({ status: mockStatus });
        confirmObjectModal.instance().handleKeyPress('enter');
        expect(mockCloseConfirmObjectModal).toHaveBeenCalledTimes(0);
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);

        mockStatus.isOpen = true;
        confirmObjectModal.setProps({ status: mockStatus });
        confirmObjectModal.instance().handleKeyPress('esc');
        expect(mockCloseConfirmObjectModal).toHaveBeenCalledTimes(1);
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);

        confirmObjectModal.instance().handleKeyPress('enter');
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);

        mockStatus.isOpen = true;
        confirmObjectModal.setProps({ status: mockStatus });
        confirmObjectModal.instance().handleKeyPress();
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);
        expect(mockSaveConfirmObjectModal).toHaveBeenCalledTimes(1);
    });

    test('Modal shows correct data for delete modal', () =>
    {
        mockStatus.type = ConfirmObjectModalType.DELETE;
        confirmObjectModal.setProps({ status: mockStatus });
        expect(confirmObjectModal.find('h3').text())
        .toBe('Delete Object?');
        expect(confirmObjectModal.find('pre').length).toBe(0);
        expect(confirmObjectModal.find('.saveConfirmObjectModal').hasClass('btn-danger'))
        .toBeTruthy();
    });
});

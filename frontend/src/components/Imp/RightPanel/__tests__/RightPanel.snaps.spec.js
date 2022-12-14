import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RightPanel from '../RightPanel';

describe('RightPanel', () =>
{
    const mockObjectList = [
        {
            id: 1,
            name: '1.jpeg',
        },
        {
            id: 2,
            name: '2.jpeg',
        },
        {
            id: 3,
            name: '3.jpeg',
        },
    ];
    let objectId = null;
    const mockLoadObject = jest.fn((id) =>
    {
        objectId = id;
    });
    const objectElements = ['name', 'image'];
    let rightPanel;
    const endpoint = '/api/imp/objects/';


    beforeEach(() =>
    {
        rightPanel = shallow(
            <RightPanel
                objectList={mockObjectList}
                currentObjectId={objectId}
                loadObject={id => mockLoadObject(id)}
            />,
        );
    });

    test('Objects are loaded and information is correct', () =>
    {
        expect(toJson(rightPanel)).toMatchSnapshot();
        expect(rightPanel.find('.objectListItem').length).toBe(mockObjectList.length);
        for (let i = 0; i < mockObjectList.length; i += 1)
        {
            /* Make sure all buttons default to btn-secondary */
            const objectListItem = rightPanel.find('.objectListItem').at(i);
            expect(objectListItem.hasClass('btn-secondary')).toBeTruthy();
            expect(objectListItem.hasClass('btn-primary')).toBeFalsy();

            /* Make sure all buttons have the 3 fields: name, latitude, longitude */
            expect(objectElements.length).toBe(2);

            const objectName = objectListItem.find('.objectName');
            const objectImage = objectListItem.find('.objectImage');
            expect(objectName.text()).toBe(mockObjectList[i].name);
            expect(objectImage.props().children.props.src).toBe(`${endpoint}${mockObjectList[i].id}.jpg`);
        }
    });

    test('Clicking on object changes class and calls loadObject', () =>
    {
        for (let i = 0; i < mockObjectList.length; i += 1)
        {
            objectId = null;
            rightPanel.setProps({ currentObjectId: objectId });
            expect(toJson(rightPanel)).toMatchSnapshot();

            /* Make sure loadObject is called once and id has been changed */
            rightPanel.find('.objectListItem').at(i).simulate('click');
            expect(mockLoadObject).toHaveBeenCalledTimes(i + 1);
            expect(objectId).toBe(mockObjectList[i].id);

            rightPanel.setProps({ currentObjectId: objectId });
            expect(toJson(rightPanel)).toMatchSnapshot();
            /* Make sure class has changed for only the clicked button */
            expect(rightPanel.find('.objectListItem').find('.btn-primary').length).toBe(1);
            expect(rightPanel.find('.objectListItem').at(i).hasClass('btn-secondary')).toBeFalsy();
            expect(rightPanel.find('.objectListItem').at(i).hasClass('btn-primary')).toBeTruthy();
        }
    });
});

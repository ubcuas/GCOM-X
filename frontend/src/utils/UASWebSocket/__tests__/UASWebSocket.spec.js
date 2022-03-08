import UASWebSocket from '../UASWebSocket';

describe('UASWebSocket', () =>
{
    const MessageType = Object.freeze({
        CREATE: '0',
        UPDATE: '1',
        DELETE: '2',
    });
    const mockMessageHandler = jest.fn(e => e);
    const socket = new UASWebSocket('ws://socket/', e => mockMessageHandler(e));

    test('post', () =>
    {
        const data = {
            field1: 1,
            field2: '2',
            field3: null,
            field4: {
                field5: ['5', '6'],
            },
        };
        const expectedMessage = MessageType.CREATE + JSON.stringify(data);

        expect(socket.post(data)).toBe(expectedMessage);
    });

    test('put', () =>
    {
        const pk = 123;
        const data = {
            field1: 1,
            field2: '2',
            field3: null,
            field4: {
                field5: ['5', '6'],
            },
        };
        const expectedMessage = MessageType.UPDATE + pk + JSON.stringify(data);

        expect(socket.put(pk, data)).toBe(expectedMessage);
    });

    test('delete', () =>
    {
        const pk = 123;
        const expectedMessage = MessageType.DELETE + pk;

        expect(socket.delete(pk)).toBe(expectedMessage);
    });
});

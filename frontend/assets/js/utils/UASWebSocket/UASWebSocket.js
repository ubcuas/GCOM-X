import Sockette from 'sockette';

/**
 * Enum for Message Type
 */
const MessageType = Object.freeze({
    CREATE: '0',
    UPDATE: '1',
    DELETE: '2',
    COMBINE: '3',
});

/**
 * UASWebSocket - WebSocket to communicate with backend UASWebMessage
 */
class UASWebSocket
{
    /**
     * Constructs a new UASWebSocket
     * @param {String} url Endpoint to communicate with
     * @param {Function} messageHandler handler for socket onmessage
     */
    constructor(url, messageHandler)
    {
        this.socket = new Sockette(url, {
            timeout: 5e3,
            onmessage: e => messageHandler(e),
        });
    }

    /**
     * Sends a socket put/update request
     * @param {Number|String} pk primary key of object to update
     * @param {Object} data new data of object to update
     * @returns {String} message sent
     */
    put(pk, data)
    {
        const message = MessageType.UPDATE + pk + JSON.stringify(data);
        this.socket.send(message);
        return message;
    }

    /**
     * Sends a socket combine request
     * @param {Number|String} pk primary key of object to combine
     * @param {Object} data data of object to combine
     * @returns {String} message sent
     */
    combine(pk, data)
    {
        const message = MessageType.COMBINE + pk + JSON.stringify(data);
        this.socket.send(message);
        return message;
    }

    /**
     * Sends a socket post/create request
     * @param {Object} data new data of object to create
     * @returns {String} message sent
     */
    post(data)
    {
        const message = MessageType.CREATE + JSON.stringify(data);
        this.socket.send(message);
        return message;
    }

    /**
     * Sends a socket delete request
     * @param {Number|String} pk primary key of object to delete
     * @returns {String} message sent
     */
    delete(pk)
    {
        const message = MessageType.DELETE + pk;
        this.socket.send(message);
        return message;
    }
}

export default UASWebSocket;

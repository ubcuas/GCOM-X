/**
 * Node class for the DLinkedList
 */
class Node
{
    /**
     * @constructs Node
     * @param {*} data of the current Node
     * @param {Node} prev reference to the previous Node
     * @param {Node} next reference to the next Node
     */
    constructor(data, prev, next)
    {
        this.data = data;
        this.prev = prev;
        this.next = next;
    }
}

/**
 * DLinkedList Doubly Linked List
 */
class DLinkedList
{
    /**
     * @constructs DLinkedList with head, tail, and current references
     */
    constructor()
    {
        this.head = null;
        this.tail = null;
        this.current = null;
    }

    /**
     * Adds a new element to the end of the list and sets the current element to this element
     * @param {*} data data to push to the end of the list
     * @returns {Node} this
     */
    push(data)
    {
        const node = new Node(data, this.tail, null);
        if (this.tail !== null)
            this.tail.next = node;
        else
            this.head = node;
        this.tail = node;
        this.current = this.tail;
        return this;
    }

    /**
     * Inserts a new element after the current node and discards the rest of the list
     * @param {*} data data to insert into the list
     * @returns {Node} this
     */
    insertAndDiscard(data)
    {
        const node = new Node(data, this.current, null);
        if (this.current !== null)
            this.current.next = node;
        else
            this.head = node;
        this.tail = node;
        this.current = this.tail;
        return this;
    }

    /**
     * Removes the last element of the list
     * @returns {Node} this
     */
    pop()
    {
        if (this.tail === null)
            return null;

        this.tail = this.tail.prev;
        this.tail.next = null;
        this.current = this.tail;
        return this;
    }

    /**
     * Traverses to the next element of the list
     * @returns {Node} this if the next element exists, otherwise null
     */
    next()
    {
        if (this.current === null || this.current.next === null)
            return null;

        this.current = this.current.next;
        return this;
    }

    /**
     * Gets the value of the next element of the list without moving to the next element
     * @returns {*} the value of the next element if it exists, otherwise null
     */
    getNextVal()
    {
        if (this.current === null || this.current.next === null)
            return null;

        return this.current.next.data;
    }

    /**
     * Traverses to the previous element of the list
     * @returns {Node} this if the previous element exists, otherwise null
     */
    prev()
    {
        if (this.current === null || this.current.prev === null)
            return null;

        this.current = this.current.prev;
        return this;
    }

    /**
     * Gets the value of the previous element of the list without moving to the next element
     * @returns {*} the value of the previous element if it exists, otherwise null
     */
    getPrevVal()
    {
        if (this.current === null || this.current.prev === null)
            return null;

        return this.current.prev.data;
    }

    /**
     * Gets the data of the current node
     * @returns {*} value at the current node
     */
    val()
    {
        return this.current.data;
    }
}

export default DLinkedList;

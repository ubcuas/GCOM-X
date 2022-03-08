import DLinkedList from '../DLinkedList';

describe('DLinkedList', () =>
{
    let dll;
    beforeEach(() =>
    {
        dll = new DLinkedList();
    });

    test('Empty list has no next, prev', () =>
    {
        expect(dll.next()).toBeNull();
        expect(dll.prev()).toBeNull();
    });

    test('Adding new elements', () =>
    {
        dll.push(1);
        expect(dll.next()).toBeNull();
        expect(dll.prev()).toBeNull();
        expect(dll.val()).toBe(1);

        dll.push(2).push(3);
        expect(dll.val()).toBe(3);
        expect(dll.next()).toBeNull();
        expect(dll.prev().val()).toBe(2);
        dll.prev();
        expect(dll.val()).toBe(1);
    });

    test('Insert and discard elements', () =>
    {
        dll.push(1).push(2).push(3);
        dll.prev();
        dll.insertAndDiscard(4);
        expect(dll.val()).toBe(4);
        expect(dll.next()).toBeNull();
        expect(dll.prev().val()).toBe(2);
    });

    test('Removing elements', () =>
    {
        dll.push(1).push(2).push(3);
        expect(dll.pop().val()).toBe(2);
        dll.pop();
        expect(dll.val()).toBe(1);
        expect(dll.next()).toBeNull();
        expect(dll.prev()).toBeNull();
    });

    test('Traversing elements', () =>
    {
        dll.push(1).push(2).push(3);
        expect(dll.val()).toBe(3);
        expect(dll.getPrevVal()).toBe(2);
        dll.prev();
        expect(dll.val()).toBe(2);
        dll.prev();
        expect(dll.val()).toBe(1);
        dll.next();
        expect(dll.val()).toBe(2);
        expect(dll.getNextVal()).toBe(3);
        dll.next();
        expect(dll.val()).toBe(3);
    });
});

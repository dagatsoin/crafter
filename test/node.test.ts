import {object} from "../src/api/Object";
import {canAttachNode, createNode, isInstance} from "../src/lib/Node";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {optional} from "../src/api/Optional";
import {getParent, hasParent} from "../src/lib/utils";

const Entity = object("Entity", {
    name: string,
    stats: object("Stats", {
        aura: number,
        phase: number
    }),
});

const Slot = object("Slot", {
    prefabId: string,
    quantity: number
});

const Currency = object("Currency", {
    type: string,
    quantity: number
});

const Inventory = object("Inventory", {
    slots: array(Slot),
    currencies: array(Currency)
});

const Player = object("Player", {
    entity: Entity,
    inventory: Inventory,
});

const snapshots = {
    Fraktar: {
        entity: {
            name: "Fraktar",
            stats: {
                aura: 20,
                phase: 3
            }
        },
        inventory: {
            slots: [],
            currencies: []
        }
    }
};

it("should check if a node can be attached to the value", function () {
    const Type = object("model", {foo: ""});
    const node = Type.instantiate(null, "", {foo: "foo"});
    expect(canAttachNode(node)).toBeFalsy();
    expect(canAttachNode({foo: "bar"})).toBeTruthy();
});

it("should check if it is a node", function () {
    const Type = object("foo", {});
    const node = Type.create({});
    expect(isInstance(node)).toBeTruthy();
    expect(isInstance({})).toBeFalsy();
});

it("should create a Node from an existing Node", function () {
    const Type = object("model", {foo: "foo"});
    const node = Type.create({foo: "foo"});
    expect(() => createNode(Type, null, "", node)).not.toThrowError();
    expect(createNode(Type, null, "", node).data.foo).toEqual("foo");
});

it("should resolve parents", t => {
    const Row = object("row", {
        article_id: 0
    });
    const Document = object("document", {
        rows: optional(array(Row), [])
    });
    const doc = Document.create();

    const row = Row.create();
    doc.rows.push(row);
    expect(hasParent(row)).toBeTruthy(); // array
    expect(hasParent(row, 2)).toBeTruthy(); // row
    expect(hasParent(row, 3)).toBeFalsy();
    expect(getParent(row) === doc.rows).toBeTruthy(); // array
    expect(getParent(row, 2) === doc).toBeTruthy(); // row
    expect(() => getParent(row, 3)).toThrowError("[mobx-state-tree] Failed to find the parent of AnonymousModel@/rows/0 at depth 3");
});

it("should clone a node", t => {
    const Row = types.model({
        article_id: 0
    });
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    });
    const doc = Document.create();
    unprotect(doc);
    const row = Row.create();
    doc.rows.push(row);
    const cloned = clone(doc);
    t.deepEqual(doc, cloned);
});

it("should be possible to clone a dead object", t => {
    const Task = types.model("Task", {
        x: types.string
    });
    const a = Task.create({ x: "a" });
    const store = types
        .model({
            todos: types.optional(types.array(Task), [])
        })
        .create({
            todos: [a]
        });
    unprotect(store);
    t.deepEqual(store.todos.slice(), [a]);
    t.is(isAlive(a), true);
    store.todos.splice(0, 1);
    t.is(isAlive(a), false);
    const a2 = clone(a);
    store.todos.splice(0, 0, a2);
    t.is(store.todos[0].x, "a");
});

it("should return the model factory", t => {
    const Document = types.model({
        customer_id: 0
    });
    const doc = Document.create();
    t.deepEqual(getType(doc), Document);
});
// getChildModelFactory

it("should return the child model factory", t => {
    const Row = types.model({
        article_id: 0
    });
    const ArrayOfRow = types.optional(types.array(Row), []);
    const Document = types.model({
        rows: ArrayOfRow
    });
    const doc = Document.create();
    t.deepEqual(getChildType(doc, "rows"), ArrayOfRow);
});

it("should not create a node which already exists in a tree", t => {
    const Row = types.model({
        article_id: 0
    });
    const Document = types.model({
        rows: types.optional(types.array(Row), []),
        foos: types.optional(types.array(Row), [])
    });
    const doc = Document.create();
    unprotect(doc);
    const row = Row.create();
    doc.rows.push(row);
    const error = t.throws(() => {
        doc.foos.push(row);
    });
    t.is(
        error.message,
        "[mobx-state-tree] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/foos/0', but it lives already at '/rows/0'"
    );
});

it("should get the root of the tree");
it("should get the parent of an node");
it("should get the path");
it("should get empty path because it is the root");
it("should get the children of an object node");
it("should get the children of an array node");
it("should get the children of an map node");
it("should not find any parent or children in a dead Instance");
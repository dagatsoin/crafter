import {object} from "../src/api/Object";
import {canAttachNode, createNode, getNode, isInstance} from "../src/lib/Node";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {optional} from "../src/api/Optional";
import {getChildType, getType, clone, getParent, hasParent, isAlive, getRoot} from "../src/api/utils";
import {observable} from "mobx";

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

it("should resolve parents", function () {
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
    expect(() => getParent(row, 3)).toThrowError("[chewing] Failed to find the parent of [object Object] at depth 3");
});

it("should clone a node", function () {
    const Row = object("row", {
        article_id: 0
    });
    const Document = object("Document", {
        rows: optional(array(Row), [])
    });
    const doc = Document.create();
    const row = Row.create();
    doc.rows.push(row);
    const cloned = clone(doc);
    expect(doc).toEqual(cloned);
});

it("should be possible to clone a dead object", t => {
    const Task = object("Task", {
        title: string
    });
    const a = Task.create({title: "a"});
    const store = object("Store", {
        todos: optional(array(Task), [])
    }).create({todos: [a]});

    expect(store.todos.slice()).toEqual([{"title": "a"}]);

    expect(isAlive(a)).toBeTruthy();
    store.todos.splice(0, 1);
    expect(isAlive(a)).toBeFalsy();
    const a2 = clone(a);
    store.todos.splice(0, 0, a2);
    expect(store.todos[0].title).toEqual("a");
});

it("should return the model factory", function () {
    const Document = object("Document", {
        customer_id: 0
    });
    const doc = Document.create();
    expect(getType(doc)).toEqual(Document);
});
// getChildModelFactory

it("should return the child model factory", function () {
    const Row = object("row", {
        article_id: 0
    });
    const ArrayOfRow = optional(array(Row), []);
    const Document = object("document", {
        rows: ArrayOfRow
    });
    const doc = Document.create();
    expect(getChildType(doc, "rows")).toEqual(ArrayOfRow);
});

it("should recognize a root", function () {
    const root = object("root", {
        firstLvl: object("firstLvl", {
            scdLvl: object("scdLvl", {
                thirdLvl: object("thirdLvl")
            })
        })
    }).create({firstLvl: {scdLvl: {thirdLvl: {}}}});

    expect(getNode(root.firstLvl.scdLvl.thirdLvl).isRoot).toBeFalsy();
    expect(getNode(root).isRoot).toBeTruthy();
});

it("should not create a node which already exists in a tree", function () {
    const Row = object("row", {
        article_id: 0
    });
    const Document = object({
        rows: optional(array(Row), []),
        foos: optional(array(Row), [])
    });
    const doc = Document.create();

    const row = Row.create();
    doc.rows.push(row);
    expect(() => doc.foos.push(row)).toThrowError("[chewing] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/foos/0', but it lives already at '/rows/0'");
});

it("should get the path", function () {
    const root = object("root", {
        firstLvl: object("firstLvl", {
            scdLvl: object("scdLvl", {
                thirdLvl: object("thirdLvl")
            })
        })
    }).create({firstLvl: {scdLvl: {thirdLvl: {}}}});

    expect(getNode(root.firstLvl.scdLvl.thirdLvl).path).toEqual("/firstLvl/scdLvl/thirdLvl");
});

it("should get empty path because it is the root", function () {
    const root = object("root", {
        firstLvl: object("firstLvl", {
            scdLvl: object("scdLvl", {
                thirdLvl: object("thirdLvl")
            })
        })
    }).create({firstLvl: {scdLvl: {thirdLvl: {}}}});

    expect(getNode(root).path).toEqual("");
});

it("should store primitive nodes in parent", function () {
    const slotNode = Slot.instantiate(null, "", {prefabId: "foo", quantity: 12});
    expect(slotNode.leafs.values().map(node => node.data)).toEqual(["foo", 12]);
});

it("should get children", function () {
    // Object children
    const player = Player.create(snapshots.Fraktar);
    expect(getNode(player).children).toEqual([getNode(player.entity), getNode(player.inventory)]);

    // Primitives are stored in the leafs map
    const slotNode = Slot.instantiate(null, "", {prefabId: "foo", quantity: 12});
    const questLog = array(string).create();
    questLog.push("000", "001");
    expect(slotNode.children).toEqual([slotNode.leafs.get("prefabId"), slotNode.leafs.get("quantity")]);
    expect(getNode(questLog).leafs.size).toEqual(2);
    questLog.pop();
    expect(getNode(questLog).leafs.size).toEqual(1);
    expect(getNode(questLog).children).toEqual(getNode(questLog).leafs.values());

    // Mixed
    const Fraktar = object({
        name: string,
        questLog: array(string)
    }).create({
        name: "Fraktar",
        questLog: ["000", "001"]
    });
    expect(getNode(Fraktar).children.map(node => node.data)).toEqual(["Fraktar", observable(["000", "001"])]);
});

it("should not find any parent or children in a dead Instance", function () {
    const Fraktar = Player.create(snapshots.Fraktar);
    const Flamanoud = Slot.create({prefabId: "0A1", quantity: 1});
    Fraktar.inventory.slots.push(Flamanoud);
    Fraktar.inventory.slots.pop();
    expect(getNode(Flamanoud).isAlive).toBeFalsy();
    expect(() => getNode(Flamanoud).children).toThrowError("[chewing] This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type 'Slot') used to live at '/inventory/slots/0'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead.");
    expect(getNode(Flamanoud).leafs.size).toEqual(0);
    expect(getNode(Flamanoud).parent).toEqual(null);
});
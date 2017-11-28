import { object } from "../src/api/object";
import { canAttachNode, createNode, getNode, isInstance, mutationNodesIndex } from "../src/lib/core/Node";
import { number, string } from "../src/api/Primitives";
import { array } from "../src/api/Array";
import { optional } from "../src/api/Optional";
import { getChildType, getType, clone, getParent, hasParent, isAlive, getSnapshot, recordPatches, registerMutation, addInstanceMutation } from "../src/api/utils";
import { observable } from "mobx";
import { identifier } from "../src/api/Identifier";

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

beforeEach(function(){
    mutationNodesIndex.clear();
})

it("should check if a node can be attached to the value", function () {
    const Type = object("model", { foo: "" });
    expect(canAttachNode(null)).toBeFalsy();
    expect(canAttachNode("foo")).toBeFalsy();
    expect(canAttachNode(new Date())).toBeFalsy();
    expect(canAttachNode(Type.create({ foo: "bar" }))).toBeFalsy();
    expect(canAttachNode({ foo: "bar" })).toBeTruthy();
});

it("should check if it is a node", function () {
    const Type = object("foo", {});
    const node = Type.create({});
    expect(isInstance(node)).toBeTruthy();
    expect(isInstance({})).toBeFalsy();
});

it("should create a Node from an existing Node", function () {
    const Type = object("model", { foo: "foo" });
    const node = Type.create({ foo: "foo" });
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
    expect(() => getParent(row, 3)).toThrowError("[crafter] Failed to find the parent of [object Object] at depth 3");
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

it("should be possible to clone a dead object", function () {
    const Task = object("Task", {
        title: string
    });
    const a = Task.create({ title: "a" });
    const store = object("Store", {
        todos: optional(array(Task), [])
    }).create({ todos: [a] });

    expect(store.todos.slice()).toEqual([{ "title": "a" }]);

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
    }).create({ firstLvl: { scdLvl: { thirdLvl: {} } } });

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
    expect(() => doc.foos.push(row)).toThrowError("[crafter] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/foos/0', but it lives already at '/rows/0'");
});

it("should get the path", function () {
    const root = object("root", {
        firstLvl: object("firstLvl", {
            scdLvl: object("scdLvl", {
                thirdLvl: object("thirdLvl")
            })
        })
    }).create({ firstLvl: { scdLvl: { thirdLvl: {} } } });

    expect(getNode(root.firstLvl.scdLvl.thirdLvl).path).toEqual("/firstLvl/scdLvl/thirdLvl");
});

it("should get empty path because it is the root", function () {
    const root = object("root", {
        firstLvl: object("firstLvl", {
            scdLvl: object("scdLvl", {
                thirdLvl: object("thirdLvl")
            })
        })
    }).create({ firstLvl: { scdLvl: { thirdLvl: {} } } });

    expect(getNode(root).path).toEqual("");
});

it("should get children", function () {
    // Object children
    const player = Player.create(snapshots.Fraktar);
    expect(getNode(player).children).toEqual([getNode(player.entity), getNode(player.inventory)]);

    // Primitives are stored in the leafs map
    const slotNode = Slot.instantiate(null, "", { prefabId: "foo", quantity: 12 });
    const questLog = array(string).create();
    questLog.push("000", "001");
    expect(slotNode.children.length).toEqual(2);
    questLog.pop();
    expect(getNode(questLog).children.length).toEqual(1);

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

it("should not act nor find any parent or children in a dead Instance", function () {
    const Fraktar = Player.create(snapshots.Fraktar);
    const Flamanoud = Slot.create({ prefabId: "0A1", quantity: 1 });
    Fraktar.inventory.slots.push(Flamanoud);
    Fraktar.inventory.slots.pop();
    expect(getNode(Flamanoud).isAlive).toBeFalsy();
    expect(() => getNode(Flamanoud).children).toThrowError("[crafter] [object Object] cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value.");
    expect(getNode(Flamanoud).parent).toEqual(null);
});

it("should record and replay patches", function () {
    const Row = object({
        article_id: 0
    });
    const Document = object({
        customer_id: 0,
        rows: optional(array(Row), [])
    });
    const source = Document.create();
    const target = Document.create();
    const recorder = recordPatches(source);
    source.customer_id = 1;
    source.rows.push(Row.create({ article_id: 1 }));
    recorder.replay(target);
    expect(getSnapshot(source)).toEqual(getSnapshot(target));
});

test("Should register static mutations.", function () {
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        if (title) self.title = title;
    });

    registerMutation<typeof Todo.Type>("SET_TITLE_UPPERCASE", function (self) {
        self.title = self.title.toUpperCase();
    });

    Todo.addMutations(["SET_TITLE", "SET_TITLE_UPPERCASE"]);

    const todo = Todo.create({
        id: 0,
        title: "stop coding bugs",
        done: false
    });

    todo.$node.present([{ mutationType: "SET_TITLE_UPPERCASE", data: true }]);

    expect(todo.title === "STOP CODING BUGS").toBeTruthy();
});

test("Existing Instances should have their mutations updated when their type receives new mutations.", function () {
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    const todo = Todo.create({
        id: 0,
        title: "",
        done: false
    });

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        if (title) self.title = title;
    });

    Todo.addMutations(["SET_TITLE"]);

    todo.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);

    expect(todo.title === "stop coding bugs").toBeTruthy();

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        self.title = title.toUpperCase();
    });

    todo.$node.present([{ mutationType: "SET_TITLE", data: "new title" }]);

    expect(todo.title === "NEW TITLE").toBeTruthy();
});

it("should add a mutation only on a specific instance of the same Type.", function () {
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    const todo0 = Todo.create({
        id: 0,
        title: "",
        done: false
    });

    const todo1 = Todo.create({
        id: 1,
        title: "",
        done: false
    });

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        if (title) self.title = title;
    });

    registerMutation<typeof Todo.Type>("SET_TITLE_UPPERCASE", function (self) {
        self.title = self.title.toUpperCase();
    });

    Todo.addMutations(["SET_TITLE"]);
    addInstanceMutation(todo1, "SET_TITLE_UPPERCASE");
    expect(mutationNodesIndex.get("SET_TITLE_UPPERCASE")!.findIndex(node => node === todo1.$node)).toBeGreaterThan(-1);

    todo0.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);
    todo1.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);

    todo0.$node.present([{ mutationType: "SET_TITLE_UPPERCASE", data: "stop coding bugs" }]);
    todo1.$node.present([{ mutationType: "SET_TITLE_UPPERCASE", data: "stop coding bugs" }]);

    expect(todo0.title === "stop coding bugs").toBeTruthy();
    expect(todo1.title === "STOP CODING BUGS").toBeTruthy();
});

it("should remove a global mutation", function () {
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    const todo0 = Todo.create({
        id: 0,
        title: "",
        done: false
    });

    const todo1 = Todo.create({
        id: 1,
        title: "",
        done: false
    });

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        if (title) self.title = title;
    });

    registerMutation<typeof Todo.Type>("SET_TITLE_UPPERCASE", function (self) {
        self.title = self.title.toUpperCase();
    });

    Todo.addMutations(["SET_TITLE", "SET_TITLE_UPPERCASE"]);
    
    expect(mutationNodesIndex.has("SET_TITLE_UPPERCASE")).toBeTruthy();

    expect(mutationNodesIndex.get("SET_TITLE_UPPERCASE")!.findIndex(node => {
        return node === todo0.$node
    })).toBeGreaterThan(-1);

    todo0.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);
    todo0.$node.present([{ mutationType: "SET_TITLE_UPPERCASE" }]);

    Todo.removeMutations(["SET_TITLE_UPPERCASE"]);

    todo1.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);
    todo1.$node.present([{ mutationType: "SET_TITLE_UPPERCASE" }]);
    
    expect(mutationNodesIndex.has("SET_TITLE_UPPERCASE")).toBeFalsy();
    expect(todo0.title === "STOP CODING BUGS").toBeTruthy();
    expect(todo1.title === "stop coding bugs").toBeTruthy();
});

it("should not add a non registred mutation on an object", function () {
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    const todo = Todo.create({
        id: 0,
        title: "",
        done: false
    });

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        if (title) self.title = title;
    });


    Todo.addMutations(["SET_TITLE"]);

    todo.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);
    todo.$node.present([{ mutationType: "SET_TITLE_UPPERCASE" }]);

    expect(todo.title === "stop coding bugs").toBeTruthy();
    expect(todo.title === "STOP CODING BUGS").toBeFalsy();
});

it("should not add a forbidden mutation on an object", function () {
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    const todo = Todo.create({
        id: 0,
        title: "",
        done: false
    });

    registerMutation<typeof Todo.Type>("SET_TITLE", function (self, title: string) {
        if (title) self.title = title;
    });

    registerMutation<typeof Todo.Type>("SET_TITLE_UPPERCASE", function (self) {
        self.title = self.title.toUpperCase();
    });

    Todo.addMutations(["SET_TITLE"]);

    todo.$node.present([{ mutationType: "SET_TITLE", data: "stop coding bugs" }]);
    todo.$node.present([{ mutationType: "SET_TITLE_UPPERCASE" }]);

    expect(todo.title === "stop coding bugs").toBeTruthy();
    expect(todo.title === "STOP CODING BUGS").toBeFalsy();
});

it("should remove a node from the mutation nodes cache before destroy", function(){
    const Todo = object({
        id: identifier(number),
        title: string,
        done: false
    })

    const todo = Todo.create({
        id: 0,
        title: "stop coding bugs",
        done: false
    });

    registerMutation<typeof Todo.Type>("SET_TITLE_UPPERCASE", function (self) {
        self.title = self.title.toUpperCase();
    });

    addInstanceMutation(todo, "SET_TITLE_UPPERCASE");

    todo.$node.remove();

    expect(mutationNodesIndex.get("SET_TITLE_UPPERCASE")!.findIndex(node => node === todo.$node)).toEqual(-1);
});
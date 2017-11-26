import {object} from "../src/api/object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {observable, reaction} from "mobx";
import {identifier} from "../src/api/Identifier";

const Slot = object("Slot", {
    prefabId: string,
    quantity: number
});

describe("Factory", function() {
    it("should create an instance of an empty array", function () {
        const QuestLog = array(string);
        const log = QuestLog.create();
        expect(log).toEqual(observable([]));
    });

    it("should create an instance of an array with primitive", function () {
        const QuestLog = array(string);
        const log = QuestLog.create(["0"]);
        expect(log).toEqual(observable(["0"]));
    });

    it("should create an instance of an array with objects", function () {
/*        const QuestLog = array(string);
        const log = QuestLog.create();
        expect(log).toEqual(observable([]));*/
    });
});

describe("Mutations", function(){
    it("push", function () {
        const slots = array(Slot).create();
        slots.push({prefabId: "00", quantity: 1});
        expect(slots.length).toEqual(1);
    });

    it("pop", function () {
        const slots = array(Slot).create();
        slots.push({prefabId: "00", quantity: 1}, {prefabId: "01", quantity: 1});
        slots.pop();
        expect(slots.length).toEqual(1);
        expect(slots[0]!.prefabId).toEqual("00");
    });

    it("splice", function () {
        const slots = array(Slot).create();
        slots.push({prefabId: "00", quantity: 1}, {prefabId: "01", quantity: 1}, {prefabId: "02", quantity: 1});
        slots.splice(1, 1);
        expect(slots.length).toEqual(2);
        expect(slots[1]!.prefabId).toEqual("02");
    });

    it("shift", function () {
        const slots = array(Slot).create();
        slots.push({prefabId: "00", quantity: 1}, {prefabId: "01", quantity: 1});
        slots.shift();
        expect(slots.length).toEqual(1);
        expect(slots[0]!.prefabId).toEqual("01");
    });

    it("should react to array mutations", function () {
        const operations = [
            [(a: Array<any>) => a.push({prefabId: "00", quantity: 1}, {prefabId: "01", quantity: 1}, {prefabId: "02", quantity: 1}), 3],
            [(a: Array<any>) => a.pop(), 2],
            [(a: Array<any>) => a.splice(1, 1), 1],
            [(a: Array<any>) => a.shift(), 0]
        ];

        const slots = array(Slot).create();

        let i = 0;

        reaction(
            () => slots.length,
            () => {
                expect(slots.length).toEqual(operations[i][1]);
            }
        );

        for (let j = 0; j < operations.length; j ++) {
            (<any>operations[j][0])(slots);
            i ++;
        }
    });
});

describe("Snapshot", function(){

});

describe("Reconciliation", function(){
    /*test("Should properly reorder references", function() {
        const B = object("Block", {
            id: identifier(string)
        });

        const S = object("Store", {
            blocks: array(B),
            blockRefs: array(reference(B))
        });

        const a = S.create({
            blocks: [{id: "1"}, {id: "2"}],
            blockRefs: ["1", "2"]
        })

        a.blockRefs.move(0, 1);
    });*/

 /*   test("check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.");
    it("should keep paths correct when splicing", t => {
        const store = types
            .model({
                todos: types.array(
                    types.model("Task", {
                        done: false
                    })
                )
            })
            .create({
                todos: [{}]
            })
        unprotect(store)
        t.deepEqual(store.todos.map(getPath), ["/todos/0"])
        store.todos.push({} as any)
        t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1"])
        store.todos.unshift({} as any)
        t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
        store.todos.splice(0, 2)
        t.deepEqual(store.todos.map(getPath), ["/todos/0"])
        store.todos.splice(0, 1, {} as any, {} as any, {} as any)
        t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
        store.todos.remove(store.todos[1])
        t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1"])
    })

    it("should reconcile items correctly when splicing - 1", t => {
        const Task = object("Task", {
            x: string
        })
        const a = Task.create({ x: "a" }),
            b = Task.create({ x: "b" }),
            c = Task.create({ x: "c" }),
            d = Task.create({ x: "d" })
        const store = object({
                todos: optional(types.array(Task), [])
            }).create({
                todos: [a]
            });
        unprotect(store)
        t.deepEqual(store.todos.slice(), [a])
        t.is(isAlive(a), true)
        store.todos.push(b)
        t.deepEqual(store.todos.slice(), [a, b])
        store.todos.unshift(c)
        t.deepEqual(store.todos.slice(), [c, a, b])
        store.todos.splice(0, 2)
        t.deepEqual(store.todos.slice(), [b])
        t.is(isAlive(a), false)
        t.is(isAlive(b), true)
        t.is(isAlive(c), false)
        t.throws(
            () => store.todos.splice(0, 1, a, c, d),
            "[crafter] Task@<root>[dead] cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value"
        )
        store.todos.splice(0, 1, clone(a), clone(c), clone(d))
        t.deepEqual(store.todos.map(_ => _.x), ["a", "c", "d"])
    })

    it("should reconcile items correctly when splicing - 2", t => {
        const Task = types.model("Task", {
            x: types.string
        })
        const a = Task.create({ x: "a" }),
            b = Task.create({ x: "b" }),
            c = Task.create({ x: "c" }),
            d = Task.create({ x: "d" })
        const store = types
            .model({
                todos: types.array(Task)
            })
            .create({
                todos: [a, b, c, d]
            })
        unprotect(store)
        store.todos.splice(2, 1, { x: "e" }, { x: "f" })
        // becomes, a, b, e, f, d
        t.is(store.todos.length, 5)
        t.true(store.todos[0] === a)
        t.true(store.todos[1] === b)
        t.true(store.todos[2] !== c)
        t.is(store.todos[2].x, "e")
        t.true(store.todos[3] !== d)
        t.is(store.todos[3].x, "f")
        t.true(store.todos[4] === d) // preserved and moved
        t.is(store.todos[4].x, "d")
        t.deepEqual(store.todos.map(getPath), [
            "/todos/0",
            "/todos/1",
            "/todos/2",
            "/todos/3",
            "/todos/4"
        ])
        store.todos.splice(1, 3, { x: "g" })
        // becomes a, g, d
        t.is(store.todos.length, 3)
        t.true(store.todos[0] === a)
        t.is(store.todos[1].x, "g")
        t.is(store.todos[2].x, "d")
        t.true(store.todos[1] !== b)
        t.true(store.todos[2] === d) // still original d
        t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
    })

    it("should reconcile keyed instances correctly", t => {
        const Store = types.model({
            todos: types.optional(
                types.array(
                    types.model("Task", {
                        id: types.identifier(),
                        task: "",
                        done: false
                    })
                ),
                []
            )
        })
        const store = Store.create({
            todos: [
                { id: "1", task: "coffee", done: false },
                { id: "2", task: "tea", done: false },
                { id: "3", task: "biscuit", done: false }
            ]
        })
        t.deepEqual(store.todos.map(todo => todo.task), ["coffee", "tea", "biscuit"])
        t.deepEqual(store.todos.map(todo => todo.done), [false, false, false])
        t.deepEqual(store.todos.map(todo => todo.id), ["1", "2", "3"])
        const coffee = store.todos[0]
        const tea = store.todos[1]
        const biscuit = store.todos[2]
        applySnapshot(store, {
            todos: [
                { id: "2", task: "Tee", done: true },
                { id: "1", task: "coffee", done: true },
                { id: "4", task: "biscuit", done: false },
                { id: "5", task: "stuffz", done: false }
            ]
        })
        t.deepEqual(store.todos.map(todo => todo.task), ["Tee", "coffee", "biscuit", "stuffz"])
        t.deepEqual(store.todos.map(todo => todo.done), [true, true, false, false])
        t.deepEqual(store.todos.map(todo => todo.id), ["2", "1", "4", "5"])
        t.is(store.todos[0] === tea, true)
        t.is(store.todos[1] === coffee, true)
        t.is(store.todos[2] === biscuit, false)
    })

    it("should reconcile correctly when swapping", t => {
        const Task = types.model("Task", {})
        const Store = types.model({
            todos: types.optional(types.array(Task), [])
        })
        const s = Store.create()
        unprotect(s)
        const a = Task.create()
        const b = Task.create()
        s.todos.push(a, b)
        s.todos.replace([b, a])
        t.true(s.todos[0] === b)
        t.true(s.todos[1] === a)
        t.deepEqual(s.todos.map(getPath), ["/todos/0", "/todos/1"])
    })

    it("should reconcile correctly when swapping using snapshots", t => {
        const Task = types.model("Task", {})
        const Store = types.model({
            todos: types.optional(types.array(Task), [])
        })
        const s = Store.create()
        unprotect(s)
        const a = Task.create()
        const b = Task.create()
        s.todos.push(a, b)
        s.todos.replace([getSnapshot(b), getSnapshot(a)])
        t.true(s.todos[0] === b)
        t.true(s.todos[1] === a)
        t.deepEqual(s.todos.map(getPath), ["/todos/0", "/todos/1"])
        s.todos.push({})
        t.true(s.todos[0] === b)
        t.true(s.todos[1] === a)
        t.deepEqual(s.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
    })

    it("should not be allowed to add the same item twice to the same store", t => {
        const Task = types.model("Task", {})
        const Store = types.model({
            todos: types.optional(types.array(Task), [])
        })
        const s = Store.create()
        unprotect(s)
        const a = Task.create()
        s.todos.push(a)
        t.throws(() => {
            s.todos.push(a)
        }, "[crafter] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/todos/1', but it lives already at '/todos/0'")
        const b = Task.create()
        t.throws(() => {
            s.todos.push(b, b)
        }, "[crafter] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/todos/2', but it lives already at '/todos/1'")
    })

    it("should support observable arrays", t => {
        const TestArray = types.array(types.number)
        const testArray = TestArray.create(observable([1, 2]))
        t.true(testArray[0] === 1)
        t.true(testArray.length === 2)
        t.true(Array.isArray(testArray.slice()))
    })*/
});
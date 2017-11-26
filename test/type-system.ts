import {object} from "../src/api/object";
import {number, string} from "../src/api/Primitives";

const createTestFactories = () => {
    const Box = object({
        width: 0,
        height: 0
    })
    const Square = object({
        width: 0,
        height: 0
    })
    const Cube = object({
        width: 0,
        height: 0,
        depth: 0
    })
    return { Box, Square, Cube };
}

it("should recognize a valid snapshot", function() {
    const { Box } = createTestFactories();
    expect(Box.is({ width: 1, height: 2 })).toBeTruthy();
    expect(Box.is({ width: 1, height: 2, depth: 3 })).toBeTruthy();
});

it("should recognize an invalid snapshot", function() {
    const { Box } = createTestFactories()
    expect(Box.is({ width: "1", height: "2" })).toBeFalsy();
});

it("should check valid nodes as well", function() {
    const { Box } = createTestFactories();
    const doc = Box.create();
    expect(Box.is(doc)).toBeTruthy();
});

it("should check invalid nodes as well", function() {
    const { Box } = createTestFactories();
    const doc = Box.create();
    expect(object({ anotherAttr: number }).is(doc)).toBeFalsy();
});

/*
test("#66 - it should accept superfluous fields", t => {
    const Item = object({
        id: number,
        name: string
    })
    t.is(Item.is({}), false)
    t.is(Item.is({ id: 3 }), false)
    t.is(Item.is({ id: 3, name: "" }), true)
    t.is(Item.is({ id: 3, name: "", description: "" }), true)
    const a = Item.create({ id: 3, name: "", description: "bla" } as any)
    t.is((a as any).description, undefined)
})

test("#66 - it should not require defaulted fields", t => {
    const Item = object({
        id: number,
        name: optional(string, "boo")
    })
    t.is(Item.is({}), false)
    t.is(Item.is({ id: 3 }), true)
    t.is(Item.is({ id: 3, name: "" }), true)
    t.is(Item.is({ id: 3, name: "", description: "" }), true)
    const a = Item.create({ id: 3, description: "bla" } as any)
    t.is((a as any).description, undefined)
    t.is(a.name, "boo")
})

test("#66 - it should be possible to omit defaulted fields", t => {
    const Item = object({
        id: number,
        name: "boo"
    })
    t.is(Item.is({}), false)
    t.is(Item.is({ id: 3 }), true)
    t.is(Item.is({ id: 3, name: "" }), true)
    t.is(Item.is({ id: 3, name: "", description: "" }), true)
    const a = Item.create({ id: 3, description: "bla" } as any)
    t.is((a as any).description, undefined)
    t.is(a.name, "boo")
})

test("#66 - it should pick the correct type of defaulted fields", t => {
    const Item = object({
        id: number,
        name: "boo"
    })
    const a = Item.create({ id: 3 })
    unprotect(a)
    t.is(a.name, "boo")
    t.throws(
        () => (a.name = 3 as any),
        `[mobx-state-tree] Error while converting \`3\` to \`string\`:\nvalue \`3\` is not assignable to type: \`string\` (Value is not a string).`
    )
})

test("cannot create factories with null values", t => {
    t.throws(() =>
        object({
            x: null
        })
    )
})

test("can create factories with maybe primitives", t => {
    const F = object({
        x: maybe(string)
    })
    t.is(F.is(undefined as any), false)
    t.is(F.is({}), true)
    t.is(F.is({ x: null }), true)
    t.is(F.is({ x: "test" }), true)
    t.is(F.is({ x: 3 }), false)
    t.is(F.create().x, null)
    t.is(F.create({ x: undefined }).x, null)
    t.is(F.create({ x: "" }).x, "")
    t.is(F.create({ x: "3" }).x, "3")
})

test("it is possible to refer to a type", t => {
    const Todo = object({
            title: string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    function x(): typeof Todo.Type {
        return Todo.create({ title: "test" }) as any // as any to make sure the type is not inferred accidentally
    }
    const z = x()
    unprotect(z)
    z.setTitle("bla")
    z.title = "bla"
    // z.title = 3 // Test manual: should give compile error
    t.is(true, true) // supress no asserts warning
})

test(".Type should not be callable", t => {
    const Todo = object({
            title: string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    t.throws(() => Todo.Type)
})

test(".SnapshotType should not be callable", t => {
    const Todo = object({
            title: string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    t.throws(() => Todo.SnapshotType)
})

test("types instances with compatible snapshots should not be interchangeable", t => {
    const A = object("A", {}).actions(self => {
        function doA() {}
        return {
            doA
        }
    })
    const B = object("B", {}).actions(self => {
        function doB() {}
        return {
            doB
        }
    })
    const C = object("C", {
        x: maybe(A)
    })
    t.is(A.is({}), true)
    t.is(A.is(B.create()), false) // if thies yielded true, then `B.create().doA()` should work!
    t.is(A.is(getSnapshot(B.create())), true)
    const c = C.create()
    unprotect(c)
    t.notThrows(() => {
        c.x = null
    })
    t.notThrows(() => {
        c.x = {} as any
    })
    t.notThrows(() => {
        c.x = A.create()
    })
    t.throws(() => {
        c.x = B.create() as any
    })
})

test("it should provide detailed reasons why the value is not appicable", t => {
    const Todo = object({
            title: string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    const Store = object({
            todos: map(Todo)
        })
        .views(self => ({
            get amount() {
                return self.todos.size
            },
            getAmount(): number {
                return self.todos.size + self.todos.size
            }
        }))
        .actions(self => {
            function setAmount() {
                const x: number = self.todos.size + self.amount + self.getAmount()
            }
            return {
                setAmount
            }
        })
    t.throws(
        () =>
            Store.create({
                todos: { "1": { title: true, setTitle: "hello" } },
                amount: 1,
                getAmount: "hello"
            } as any),
        `[mobx-state-tree] Error while converting \`{"todos":{"1":{"title":true,"setTitle":"hello"}},"amount":1,"getAmount":"hello"}\` to \`AnonymousModel\`:
at path "/todos/1/title" value \`true\` is not assignable to type: \`string\` (Value is not a string).`

        // MWE: TODO: Ideally (like in MST =< 0.9):
        // at path "/todos/1/setTitle" value \`"hello"\` is not assignable  (Action properties should not be provided in the snapshot).
        // at path "/amount" value \`1\` is not assignable  (Computed properties should not be provided in the snapshot).
        // at path "/getAmount" value \`"hello"\` is not assignable  (View properties should not be provided in the snapshot).`
    )
})

test("it should type compose correctly", t => {
    const Car = object({
            wheels: 3
        })
        .actions(self => {
            var connection = (null as any) as Promise<any>
            function drive() {}
            function afterCreate() {
                connection = Promise.resolve(true)
            }
            return {
                drive,
                afterCreate
            }
        })
    const Logger = object({
            logNode: "test"
        })
        .actions(self => {
            function log(msg: string) {}
            return {
                log
            }
        })
    const LoggableCar = compose(Car, Logger)
    const x = LoggableCar.create({ wheels: 3, logNode: "test" })
    //x.test() // compile error
    x.drive()
    x.log("z")
    //x.connection.then(() => {}) // compile error
    t.pass()
})

test("it should extend types correctly", t => {
    const Car = object({
            wheels: 3
        })
        .actions(self => {
            function drive() {}
            return {
                drive
            }
        })
    const Logger = object("Logger")
        .props({
            logNode: "test"
        })
        .actions(self => {
            let connection: Promise<any>
            return {
                log(msg: string) {},
                afterCreate() {
                    connection = Promise.resolve(true)
                }
            }
        })
    const LoggableCar = compose("LoggableCar", Car, Logger)
    const x = LoggableCar.create({ wheels: 3, logNode: "test" })
    // x.test() // compile error
    x.drive()
    x.log("z")
    t.pass()
})*/

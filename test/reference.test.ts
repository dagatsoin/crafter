
import { identifier } from "../src/api/Identifier";
import { object } from "../src/api/object";
import { number, string } from "../src/api/Primitives";
import { array } from "../src/api/Array";
import { applySnapshot, detach, getSnapshot, resolveIdentifier } from "../src/api/utils";
import { reference } from "../src/api/Reference";
import { map } from "../src/api/Map";
import { refinement } from "../src/api/Refinement";
import { autorun } from "mobx";
import { union } from "../src/api/Union";
import { optional } from "../src/api/Optional";
import { late } from "../src/api/Late";
import { maybe } from "../src/api/maybe";

test("it should support prefixed paths in arrays", function () {
    const User = object("User", {
        id: identifier(),
        name: string
    });

    const UserStore = object("UserStore", {
        user: reference(User),
        users: array(User)
    });

    const store = UserStore.create({
        user: "17",
        users: [{ id: "17", name: "TheWen" }, { id: "18", name: "Fraktar" }]
    });

    expect(store.users.find(user => user.id === "17")!.name as string).toEqual("TheWen");
    expect(store.users.find(user => user.id === "18")!.name as string).toEqual("Fraktar");
    expect(store.user!.name).toEqual("TheWen");
    store.user = store.users.find(user => user.id === "18")!;
    expect(store.user.name).toEqual("Fraktar");
    store.users.find(user => user.id === "18")!.name = "Charlize";
    expect(store.user.name).toEqual("Charlize");
    expect(getSnapshot(store)).toEqual({
        user: "18",
        users: [{ id: "17", name: "TheWen" }, { id: "18", name: "Charlize" }]
    } as any);
});

test("it should support prefixed paths in maps", function () {
    const User = object({
        id: identifier(),
        name: string
    });
    const UserStore = object({
        user: reference(User),
        users: map(User)
    });
    const store = UserStore.create({
        user: "17",
        users: {
            "17": { id: "17", name: "Fraktar" },
            "18": { id: "18", name: "TheWen" }
        }
    });
    expect(store.users.get("17")!.name).toEqual("Fraktar");
    expect(store.users.get("18")!.name).toEqual("TheWen");
    expect(store.user!.name).toEqual("Fraktar");
    store.user = store.users.get("18")!;
    expect(store.user.name).toEqual("TheWen");
    store.users.get("18")!.name = "Charlize";
    expect(store.user.name).toEqual("Charlize");
    expect(getSnapshot(store)).toEqual({
        user: "18",
        users: { "17": { id: "17", name: "Fraktar" }, "18": { id: "18", name: "Charlize" } }
    });
});

test("identifiers are required", function () {
    const Todo = object({
        id: identifier()
    });
    expect(Todo.is({})).toBeFalsy();
    expect(Todo.is({ id: "x" })).toBeTruthy();
    expect(() => Todo.create()).toThrowError("[crafter] expected first argument to be a AnonymousModel, got `{}` instead.");
});

test("identifiers cannot be modified", function () {
    const Todo = object({
        id: identifier()
    });
    const todo = Todo.create({ id: "x" });

    expect(() => (todo.id = "stuff")).toThrowError("[crafter] Tried to change identifier from 'x' to 'stuff'. Changing identifiers is not allowed.");
    expect(() => applySnapshot(todo, { id: "stuff" })).toThrowError("[crafter] Tried to change identifier from 'x' to 'stuff'. Changing identifiers is not allowed.");
});

test("it should resolve refs during creation, when using path"); /*, t => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types
        .model({
            book: types.reference(Book)
        })
        .views(self => ({
            get price() {
                return self.book.price * 2
            }
        }))
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    reaction(() => s.entries.reduce((a, e) => a + e.price, 0), v => values.push(v))
    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)
    const entry = BookEntry.create({ book: s.books[0] }) // N.B. ref is initially not resolvable!
    s.entries.push(entry)
    t.is(s.entries[1].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 8)
    t.deepEqual(values, [4, 8])
})

test("it should resolve refs over late types"); /*, t => {
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types
        .model({
            book: types.reference(types.late(() => Book))
        })
        .views(self => ({
            get price() {
                return self.book.price * 2
            }
        }))
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)
})*/

test("it should resolve refs during creation, when using generic reference"); /*, t => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types
        .model({
            book: types.reference(Book)
        })
        .views(self => ({
            get price() {
                return self.book.price * 2
            }
        }))
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    reaction(() => s.entries.reduce((a, e) => a + e.price, 0), v => values.push(v))
    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)
    const entry = BookEntry.create({ book: s.books[0] }) // can refer to book, even when not part of tree yet
    t.deepEqual(getSnapshot(entry), { book: "3" })
    s.entries.push(entry)
    t.deepEqual(values, [4, 8])
})*/

test("identifiers should only support types.string and types.number", function () {
    expect(() => object({ id: identifier(object({ x: 1 })) }).create({ id: {} })).toThrow();
});

test("identifiers should support subtypes of types.string and types.number", function () {
    debugger;
    const M = object({
        id: identifier(refinement("Number greater then 5", number, n => n > 5))
    });
    expect(M.is({})).toBeFalsy();
    expect(M.is({ id: "test" })).toBeFalsy();
    expect(M.is({ id: 6 })).toBeTruthy();
    expect(M.is({ id: 4 })).toBeFalsy();
});

test("string identifiers should not accept numbers", function () {
    const F = object({
        id: identifier()
    });
    expect(F.is({ id: "4" })).toBeTruthy();
    expect(F.is({ id: 4 })).toBeFalsy();
    const F2 = object({
        id: identifier(string)
    });
    expect(F2.is({ id: "4" })).toBeTruthy();
    expect(F2.is({ id: 4 })).toBeFalsy();
});

test("identifiers should support numbers as well", function () {
    const F = object({
        id: identifier(number)
    });
    expect(F.create({ id: 3 }).id).toEqual(3);
    expect(F.is({ id: 4 })).toBeTruthy();
    expect(F.is({ id: "4" })).toBeFalsy();
});

test("self reference with a late type"); /*, function() {
    interface IBook {
        id: string;
        genre: string;
        reference: IBook;
    }
    const Book = types.model("Book", {
        id: types.identifier(),
        genre: types.string,
        reference: types.reference(types.late<any, IBook>(() => Book))
    })
    const Store = types
        .model("Store", {
            books: types.array(Book)
        })
        .actions(self => {
            function addBook(book) {
                self.books.push(book)
            }
            return {
                addBook
            }
        })
    const s = Store.create({
        books: [{ id: "1", genre: "thriller", reference: "" }]
    })
    const book2 = Book.create({
        id: "2",
        genre: "romance",
        reference: s.books[0]
    })
    s.addBook(book2)
    t.is((s as any).books[1].reference.genre, "thriller")
})*/

test("when applying a snapshot, reference should resolve correctly if value added after", function () {
    const Box = object({
        id: identifier(number),
        name: string
    });
    const Factory = object({
        selected: reference(Box),
        boxes: array(Box)
    });
    expect(() => Factory.create({
        selected: 1,
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    })
    ).not.toThrow();
});

test("it should fail when reference snapshot is ambiguous", function () {
    const Box = object("Box", {
        id: identifier(number),
        name: string
    });
    const Arrow = object("Arrow", {
        id: identifier(number),
        name: string
    });
    const BoxOrArrow = union(Box, Arrow);
    const Factory = object({
        selected: reference(BoxOrArrow),
        boxes: array(Box),
        arrows: array(Arrow)
    });
    const store = Factory.create({
        selected: 2,
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }],
        arrows: [{ id: 2, name: "arrow" }]
    });
    expect(() => {
        store.selected; // store.boxes[1] // throws because it can't know if you mean a box or an arrow!
    }).toThrowError("[crafter] Cannot resolve a reference to type '(Arrow | Box)' with id: '2' unambigously, there are multiple candidates: /boxes/1, /arrows/0");

    // first update the reference, than create a new matching item! Ref becomes ambigous now...
    store.selected = 1 as any;
    expect(store.selected).toEqual(store.boxes[0]); // unambigous identifier
    let err;
    autorun(() => store.selected).onError(e => (err = e));
    expect(store.selected).toEqual(store.boxes[0]); // unambigous identifier
    store.arrows.push({ id: 1, name: "oops" });
    expect(err.message).toEqual(
        "[crafter] Cannot resolve a reference to type '(Arrow | Box)' with id: '1' unambigously, there are multiple candidates: /boxes/0, /arrows/1"
    );
});

test("it should support array of references", function () {
    const Box = object({
        id: identifier(number),
        name: string
    });
    const Factory = object({
        selected: array(reference(Box)),
        boxes: array(Box)
    });
    const store = Factory.create({
        selected: [],
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    });
    expect(() => store.selected.push(store.boxes[0])).not.toThrow();
    expect(getSnapshot(store.selected)).toEqual([1]);
    expect(() => store.selected.push(store.boxes[1])).not.toThrow();
    expect(getSnapshot(store.selected)).toEqual([1, 2]);
});

test("it should restore array of references from snapshot", function () {
    const Box = object({
        id: identifier(number),
        name: string
    });
    const Factory = object({
        selected: array(reference(Box)),
        boxes: array(Box)
    });
    const store = Factory.create({
        selected: [1, 2],
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    });
    expect(store.selected[0] === store.boxes[0]).toBeTruthy();
    expect(store.selected[1] === store.boxes[1]).toBeTruthy();
});

test("it should support map of references", function () {
    const Box = object({
        id: identifier(number),
        name: string
    });
    const Factory = object({
        selected: map(reference(Box)),
        boxes: array(Box)
    });
    const store = Factory.create({
        selected: {},
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    });
    expect(() => store.selected.set("from", store.boxes[0])).not.toThrow();
    expect(getSnapshot(store.selected)).toEqual({ from: 1 });
    expect(() => store.selected.set("to", store.boxes[1])).not.toThrow();
    expect(getSnapshot(store.selected)).toEqual({ from: 1, to: 2 });
});

test("it should restore map of references from snapshot", function () {
    const Box = object({
        id: identifier(number),
        name: string
    });
    const Factory = object({
        selected: map(reference(Box)),
        boxes: array(Box)
    });
    const store = Factory.create({
        selected: { from: 1, to: 2 },
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    });
    expect(store.selected.get("from") === store.boxes[0]).toBeTruthy();
    expect(store.selected.get("to") === store.boxes[1]).toBeTruthy();
});

test("it should support relative lookups", function () {
    const Node = object({
        id: identifier(number),
        children: optional(array(late(() => Node)), [])
    });
    const root = Node.create({
        id: 1,
        children: [
            {
                id: 2,
                children: [
                    {
                        id: 4
                    }
                ]
            },
            {
                id: 3
            }
        ]
    });

    expect(getSnapshot(root)).toEqual({
        id: 1,
        children: [{ id: 2, children: [{ id: 4, children: [] }] }, { id: 3, children: [] }]
    });
    expect(resolveIdentifier(Node, root, 1)).toEqual(root);
    expect(resolveIdentifier(Node, root, 4)).toEqual(root.children[0].children[0]);
    expect(resolveIdentifier(Node, root.children[0].children[0], 3)).toEqual(root.children[1]);
    const n2 = detach(root.children[0]);
    expect(resolveIdentifier(Node, n2, 2)).toEqual(n2);
    expect(resolveIdentifier(Node, root, 2)).toEqual(undefined);
    expect(resolveIdentifier(Node, root, 4)).toEqual(undefined);
    expect(resolveIdentifier(Node, n2, 3)).toEqual(undefined);
    expect(resolveIdentifier(Node, n2, 4)).toEqual(n2.children[0]);
    expect(resolveIdentifier(Node, n2.children[0], 2)).toEqual(n2);
    const n5 = Node.create({ id: 5 });
    expect(resolveIdentifier(Node, n5, 4)).toEqual(undefined);
    n2.children.push(n5);
    expect(resolveIdentifier(Node, n5, 4)).toEqual(n2.children[0]);
    expect(resolveIdentifier(Node, n2.children[0], 5)).toEqual(n5);
});

test("References are non-nullable by default", function () {
    const Todo = object({
        id: identifier(number)
    })
    const Store = object({
        todo: maybe(Todo),
        ref: reference(Todo),
        maybeRef: maybe(reference(Todo))
    })
    expect(Store.is({})).toBeFalsy();
    expect(Store.is({ ref: 3 })).toBeTruthy();
    expect(Store.is({ ref: null })).toBeFalsy();
    expect(Store.is({ ref: undefined })).toBeFalsy();
    expect(Store.is({ ref: 3, maybeRef: 3 })).toBeTruthy();
    expect(Store.is({ ref: 3, maybeRef: null })).toBeTruthy();
    expect(Store.is({ ref: 3, maybeRef: undefined })).toBeTruthy();
    let store = Store.create({
        todo: { id: 3 },
        ref: 3
    })
    expect(store.ref).toEqual(store.todo);
    expect(store.maybeRef).toEqual(null);
    store = Store.create({
        todo: { id: 3 },
        ref: 4
    })
    expect(store.maybeRef).toEqual(null);
    expect(() => store.ref).toThrow();
    store.maybeRef = 3 as any
    expect(store.maybeRef).toEqual(store.todo);
    store.maybeRef = 4 as any
    expect(() => store.maybeRef).toThrow();
    store.maybeRef = null
    expect(store.maybeRef).toEqual(null);
    expect(() => (store.ref = null as any)).toThrow();
});

test("References are described properly", function () {
    const Todo = object({
        id: identifier(number)
    })
    const Store = object({
        todo: maybe(Todo),
        ref: reference(Todo),
        maybeRef: maybe(reference(Todo))
    })
    expect(Store.describe()).toEqual("{ todo: ({ id: identifier(number) } | null?); ref: reference(AnonymousModel); maybeRef: (reference(AnonymousModel) | null?) }");
});

test("References in recursive structures"); /*, t => {
    const Folder = types.model("Folder", {
        id: types.identifier(),
        name: types.string,
        files: types.array(types.string)
    })
    const Tree = types
        .model("Tree", {
            children: types.array(types.late(() => Tree)),
            data: types.maybe(types.reference(Folder))
        })
        .actions(self => {
            function addFolder(data) {
                const folder = Folder.create(data)
                getRoot(self).putFolderHelper(folder)
                self.children.push(Tree.create({ data: folder, children: [] }))
            }
            return {
                addFolder
            }
        })
    const Storage = types
        .model("Storage", {
            objects: types.map(Folder),
            tree: Tree
        })
        .actions(self => ({
            putFolderHelper(folder) {
                self.objects.put(folder)
            }
        }))
    const store = Storage.create({ objects: {}, tree: { children: [], data: null } })
    const folder = { id: "1", name: "Folder 1", files: ["a.jpg", "b.jpg"] }
    store.tree.addFolder(folder)
    t.deepEqual(getSnapshot(store), {
        objects: {
            "1": {
                files: ["a.jpg", "b.jpg"],
                id: "1",
                name: "Folder 1"
            }
        },
        tree: {
            children: [
                {
                    children: [],
                    data: "1"
                }
            ],
            data: null
        }
    })
    t.is(store.objects.get("1"), store.tree.children[0].data)
    const folder2 = { id: "2", name: "Folder 2", files: ["c.jpg", "d.jpg"] }
    store.tree.children[0].addFolder(folder2)
    t.deepEqual(getSnapshot(store), {
        objects: {
            "1": {
                files: ["a.jpg", "b.jpg"],
                id: "1",
                name: "Folder 1"
            },
            "2": {
                files: ["c.jpg", "d.jpg"],
                id: "2",
                name: "Folder 2"
            }
        },
        tree: {
            children: [
                {
                    children: [
                        {
                            children: [],
                            data: "2"
                        }
                    ],
                    data: "1"
                }
            ],
            data: null
        }
    })
    t.is(store.objects.get("1"), store.tree.children[0].data)
    t.is(store.objects.get("2"), store.tree.children[0].children[0].data)
})*/

test("it should applyPatch references in array"); /*, t => {
    const Item = types.model("Item", {
        id: types.identifier(),
        name: types.string
    })
    const Folder = types
        .model("Folder", {
            id: types.identifier(),
            objects: types.map(Item),
            hovers: types.array(types.reference(Item))
        })
        .actions(self => {
            function addObject(item) {
                self.objects.put(item)
            }
            function addHover(item) {
                self.hovers.push(item)
            }
            function removeHover(item) {
                self.hovers.remove(item)
            }
            return {
                addObject,
                addHover,
                removeHover
            }
        })
    const folder = Folder.create({ id: "folder 1", objects: {}, hovers: [] })
    folder.addObject({ id: "item 1", name: "item name 1" })
    const item = folder.objects.get("item 1")
    const snapshot = getSnapshot(folder)
    const newStore = Folder.create(snapshot)
    onPatch(folder, data => {
        applyPatch(newStore, data)
    })
    folder.addHover(item)
    t.deepEqual(getSnapshot(newStore), {
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["item 1"]
    })
    folder.removeHover(item)
    t.deepEqual(getSnapshot(newStore), {
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: []
    })
})*/

test("it should applySnapshot references in array", function () {
    const Item = object("Item", {
        id: identifier(),
        name: string
    });
    const Folder = object("Folder", {
        id: identifier(),
        objects: map(Item),
        hovers: array(reference(Item))
    });
    const folder = Folder.create({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["folder 1"]
    });
    const snapshot = JSON.parse(JSON.stringify(getSnapshot(folder)));
    expect(snapshot).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["folder 1"]
    });
    snapshot.hovers = [];
    applySnapshot(folder, snapshot);
    expect(getSnapshot(folder)).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: []
    });
});

test("array of references should work fine"); /*, t => {
    const B = types.model("Block", { id: types.identifier(types.string) })

    const S = types
        .model("Store", { blocks: types.array(B), blockRefs: types.array(types.reference(B)) })
        .actions(self => {
            return {
                order() {
                    self.blockRefs.move(0, 1)
                }
            }
        })

    const a = S.create({ blocks: [{ id: "1" }, { id: "2" }], blockRefs: ["1", "2"] })

    t.notThrows(() => a.order())
})
*/
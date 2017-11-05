import {object} from "../src/api/Object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {isObservable, observable, reaction} from "mobx";
import {applySnapshot, getSnapshot} from "../src/api/utils";
import {optional} from "../src/api/Optional";

const Entity = object("Entity", {
    name: "",
    stats: object("Stats", {
        aura: 0,
        phase: 0
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
    slots: optional(array(Slot), []),
    currencies: optional(array(Currency), [{type: "gold", quantity: 0}])
});

const Player = object("Player", {
    entity: Entity,
    inventory: Inventory,
});

const snapshots = {
    player: {
        entity: {
            name: "",
            stats: {
                aura: 0,
                phase: 0
            }
        },
        inventory: {
            slots: [],
            currencies: [{type: "gold", quantity: 0}]
        }
    },
    Fraktar: {
        entity: {
            name: "Fraktar",
            stats: {
                aura: 20,
                phase: 3
            }
        },
        inventory: {
            slots: [{prefabId: "gd78hj62c", quantity: 1}],
            currencies: [{type: "gold", quantity: 100}]
        }
    }
};

describe("Factory", function(){
    describe("Props check", function () {
        it("should not accept an object property", function () {
            expect(() => object("wrong", {wrong: {foo: "bar"}})).toThrowError();
        });

        it("should not accept an null property", function () {
            expect(() => object("wrong", {wrong: null})).toThrowError();
        });

        it("should not accept an undefined property", function () {
            expect(() => object("wrong", {wrong: undefined})).toThrowError();
        });

        it("should not accept an getter/setter property", function () {
            const noGetter = function () {

                Object.defineProperty(this, "foo", {
                    get: function () {
                        return "bar";
                    }
                });
                return this;
            };

            expect(() => object("noGetter", noGetter())).toThrowError();
        });

        it("should not accept an function property", function () {
            expect(() => object("wrong", {wrong: () => null})).toThrowError();
        });
    });
    describe("Creation", function(){
        it("should replace primitive value of props by optional prop with default value", function(){
            const Model = object("model", {foo: "foo"});
            expect(Model.create().foo).toEqual("foo");
        });

        it("should create a complex object with a snapshot", function () {
            const Fraktar = Player.create(snapshots.Fraktar);
            expect(Fraktar).toEqual(observable(snapshots.Fraktar));
        });

        it("should create an simple object with a snapshot", function () {
            const foo = Slot.create(snapshots.Fraktar.inventory.slots[0]);
            expect(foo).toEqual(observable(snapshots.Fraktar.inventory.slots[0]));
            expect(foo.prefabId).toEqual("gd78hj62c");
        });

        it("should not create an instance without snapshot", function () {
            expect(() => Player.create()).toThrow();
        });

        test("primitive props are not observable", function () {
            expect(isObservable(Entity.create(snapshots.Fraktar.entity).name)).toBeFalsy();
        });
    });
});

describe("Mutations", function () {
    it("should mutate an object prop", function () {
        const Fraktar = Player.create(snapshots.Fraktar);
        Fraktar.entity.stats.aura = 30;
        expect(Fraktar.entity.stats.aura).toEqual(30);
    });

    it("should react to object mutation", function () {
        let mutated = false;
        const Fraktar = Player.create(snapshots.Fraktar);

        reaction(
            () => Fraktar.entity.stats.aura,
            () => mutated = true
        );

        Fraktar.entity.stats.aura = 30;
        expect(mutated).toBeTruthy();
    });
});

describe("Snapshot", function(){
    it("should be a valid snapshot", function () {
        expect(Currency.validate({type: "wizar", quantity: 10})).toBeTruthy();
    });

    it("should be an invalid snapshot", function () {
        expect(() => Player.create({wrongField: new Date()}, true)).toThrow();
    });

    it("should extract a snapshot from an instance of Object", function () {
        const Fraktar = Player.create(snapshots.Fraktar);
        const snapshot = getSnapshot(Fraktar);
        expect(snapshot).toEqual(snapshots.Fraktar);
    });

    it("should restore an instance with a snapshot of Object", function () {
        const initialSnapshot = JSON.parse(JSON.stringify(snapshots.Fraktar));
        initialSnapshot.entity.name = "TheWen";
        const player = Player.create(initialSnapshot);
        applySnapshot(player, snapshots.Fraktar);
        expect(player).toEqual(observable(snapshots.Fraktar));
    });

    it("should accept an optional field", function(){
        expect(Inventory.validate({slots: []}));
    });
});
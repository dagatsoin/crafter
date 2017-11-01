import {object} from "../src/api/Object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {observable, reaction} from "mobx";
import {applySnapshot, getSnapshot} from "../src/api/utils";
import {optional} from "../src/api/Optional";
import {isInstance} from "../src/lib/Node";


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

        it("should replace primitive value of props by optional prop with default value", function(){
            const Model = object("model", {foo: "foo"});
            expect(Model.create().foo).toEqual("foo");
        });
    });
    describe("Creation", function(){
        it("should create a complex object with a snapshot", function () {
            const Fraktar = Player.create(snapshots.Fraktar);
            expect(Fraktar).toEqual(observable(snapshots.Fraktar));
        });

        it("should create an simple object with a snapshot", function () {
            const foo = Slot.create(snapshots.Fraktar.inventory.slots[0]);
            expect(foo).toEqual(observable(snapshots.Fraktar.inventory.slots[0]));
            expect(isInstance(foo.prefabId)).toBeTruthy();
        });

        it("should create an instance of object without snapshot", function () {
            const player = Player.create();
            expect(player).toEqual(observable(snapshots.player));
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
        expect(Player.validate({wrongField: new Date()})).toBeFalsy();
    });

    it("should extract a snapshot from an instance of Object", function () {
        const Fraktar = Player.create(snapshots.Fraktar);
        const snapshot = getSnapshot(Fraktar);
        expect(snapshot).toEqual(snapshots.Fraktar);
    });

    it("should restore an instance with a snapshot of Object", function () {
        const Fraktar = Player.create({});
        applySnapshot(Fraktar, snapshots.Fraktar);
        expect(Fraktar.inventory).toEqual(snapshots.Fraktar.inventory);
    });

    it("should accept an optional field", function(){
        expect(Inventory.validate({slots: []}));
    });
});
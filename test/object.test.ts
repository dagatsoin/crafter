import {object} from "../src/api/Object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {restore, serialize} from "../src/lib/utils";
import {observable, toJS} from "mobx";


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

it("should not accept an object property");
it("should not accept an null property");
it("should not accept an undefined property");
it("should not accept an getter/setter property");
it("should not accept an function property");

it("should create an instance of object", function () {
    const Fraktar = Player.create(snapshots.Fraktar);
    expect(toJS(Fraktar)).toEqual(observable(snapshots.Fraktar));
});

it("should extract a snapshot from an instance of Object", function () {
    const Fraktar = Player.create(snapshots.Fraktar);
    const snapshot = serialize(Fraktar);
    expect(snapshot).toEqual(snapshots.Fraktar);
});

it("should restore an instance with a snapshot of Object", function () {
    const Fraktar = Player.create({});
    restore(Fraktar, snapshots.Fraktar);
    expect(Fraktar.inventory).toEqual(snapshots.Fraktar.inventory);
});

it("should be a valid snapshot", function () {
    expect(Currency.validate({type: "wizar", quantity: 10})).toBeTruthy();
});

it("should be an invalid snapshot", function () {
    expect(Player.validate({wrongField: new Date()})).toBeFalsy();
});

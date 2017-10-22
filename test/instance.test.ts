import {object} from "../src/api/Object";
import {canAttachInstance, createInstance, isNode} from "../src/lib/Instance";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {applySnapshot, getSnapshot} from "../src/lib/utils";
import {reaction} from "mobx";

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

it("should check if a instance can be attached to the value", function () {
    const Type = object("model", {foo: string});
    const instance = Type.instantiate({});
    expect(canAttachInstance(instance)).toBeFalsy();
    expect(canAttachInstance({foo: "bar"})).toBeTruthy();
});

it("should check if it is a node", function () {
    const Type = object("foo", {});
    const node = Type.create({});
    expect(isNode(node)).toBeTruthy();
    expect(isNode({})).toBeFalsy();
});

it("should not create an Instance from an existing Instance", function () {
    const Type = object("model", {});
    const node = Type.create({});
    expect(() => createInstance(Type, node)).toThrowError();
});

it("should retrieve the children of an object instance");
it("should retrieve the children of an array instance");
it("should retrieve the children of an map instance");
import {object} from "../src/api/Object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {restore, serialize} from "../src/lib/utils";
import {toJS} from "mobx";

describe("Object type", function () {
    const Entity = object("Entity", {
        name: string,
        aura: number,
        phase: number
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
                aura: 20,
                phase: 3
            },
            inventory: {
                slots: [],
                currencies: []
            }
        }
    };

    it("should create an instance of Object from a snapshot", function () {
        const Fraktar = Player.create(snapshots.Fraktar);
        expect(toJS(Fraktar.entity)).toEqual(snapshots.Fraktar.entity);
        expect(toJS(Fraktar.inventory)).toEqual(snapshots.Fraktar.inventory);
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

    it("should be a valid snapshot", function(){
        expect(Currency.validate({type: "wizar",  quantity: 10})).toBeTruthy();
    });

    it("should be an invalid snapshot", function(){
        expect(Player.validate({wrongField: new Date()})).toBeFalsy();
    });
});
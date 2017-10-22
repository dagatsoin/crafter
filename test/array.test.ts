import {object} from "../src/api/Object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {reaction} from "mobx";

const Slot = object("Slot", {
    prefabId: string,
    quantity: number
});

describe("Factory", function(){

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
            console.log(slots.length, i);
            i ++;
        }
    });
});

describe("Snapshot", function(){

});
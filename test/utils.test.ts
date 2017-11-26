import {clone, getRoot, isAlive} from "../src/api/utils";
import {object} from "../src/api/object";
import {number, string} from "../src/api/Primitives";
import {array} from "../src/api/Array";
import {identity} from "../src/lib/utils";

// API utils
test("getRoot", function() {
    const root = object("root", {
        firstLvl: object("firstLvl", {
            scdLvl: object("scdLvl", {
                thirdLvl: object("thirdLvl")
            })
        })
    }).create({firstLvl: {scdLvl: {thirdLvl: {}}}});

    expect(getRoot(root.firstLvl.scdLvl.thirdLvl)).toEqual(root);
    expect(getRoot(root)).toEqual(root);
});

test("clone", function(){
    const Slot = object({prefabId: string, quantity: number});
    const inventory = array(Slot).create();
    const a = Slot.create({prefabId: "000", quantity: 1});
    inventory.push(a);
    expect(isAlive(a)).toBeTruthy();
    inventory.pop();
    expect(isAlive(a)).toBeFalsy();
    const b = clone(a);
    expect(isAlive(a)).toBeFalsy();
    expect(isAlive(b)).toBeTruthy();
});

test("applySnapshot");
test("getSnapshot");
test("hasParent");
test("getParent");
test("isAlive");
test("getType");
test("getChildType");


// Interal Utils
test("identity", function() {
    expect(typeof identity("foo")).toEqual("string");
});

test("isPrimitive");
test("applySnapshot");
test("getSnapshot");
test("fail");
test("isPlainObject");
test("isMutable");
test("walk");
test("assertType");
test("escapeJsonPath");
test("unescapeJsonPath");
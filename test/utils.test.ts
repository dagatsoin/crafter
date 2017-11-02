import {getRoot} from "../src/api/utils";
import {object} from "../src/api/Object";

it("should get the root of the tree", function() {
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

test("identity");
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
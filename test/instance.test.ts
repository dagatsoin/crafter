import {object} from "../src/api/Object";
import {canAttachInstance, createInstance, isNode} from "../src/lib/Instance";
import {string} from "../src/api/Primitives";

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
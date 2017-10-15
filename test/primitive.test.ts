import {boolean, number, string} from "../src/api/Primitives";

describe("All primitives", function () {
    it("should not support applying snapshots because they are immutable", function () {
        const instance = string.instantiate("foo");
        expect(() => string.restore(instance, "bar")).toThrowError();
    });

    it("should create an undefined primitive", function () {
        const name = string.create();
        expect(typeof name).toEqual("undefined");
    });
})

describe("String", function () {
    it("should create a string", function () {
        const name = string.create("Fraktar");
        expect(typeof name).toEqual("string");
    });
});

describe("Number", function () {
    it("should create a number", function () {
        const force = number.create(123);
        expect(typeof force).toEqual("number");
    });
});

describe("Boolean", function () {
    it("should create a boolean", function () {
        const isAdmin = boolean.create(true);
        expect(typeof isAdmin).toEqual("boolean");
    });
});
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

    it("should not be an invalid string", function () {
        expect(string.validate(0)).toBeFalsy();
    });

    it("should be a valid string", function () {
        expect(string.validate("Fraktar")).toBeTruthy();
    });
});

describe("Number", function () {
    it("should create a number", function () {
        const force = number.create(123);
        expect(typeof force).toEqual("number");
    });

    it("should not be an invalid number", function () {
        expect(number.validate("0")).toBeFalsy();
    });

    it("should be a valid number", function () {
        expect(number.validate(0)).toBeTruthy();
    });
});

describe("Boolean", function () {
    it("should create a boolean", function () {
        const isAdmin = boolean.create(true);
        expect(typeof isAdmin).toEqual("boolean");
    });

    it("should not be an invalid boolean", function () {
        expect(boolean.validate(0)).toBeFalsy();
    });

    it("should be a valid boolean", function () {
        expect(boolean.validate(false)).toBeTruthy();
    });
});
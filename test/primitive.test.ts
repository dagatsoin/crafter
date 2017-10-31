import {boolean, number, string} from "../src/api/Primitives";
import {optional} from "../src/api/Optional";

describe("All primitives", function () {
    it("should not support applying snapshots because they are immutable", function () {
        const instance = string.instantiate(null, "", "foo");
        expect(() => string.applySnapshot(instance, "bar")).toThrowError();
    });

    it("should not create an undefined primitive", function () {
        expect(() => string.create()).toThrowError("Error while instantiating string. Expected a string, got undefined");
    });

    it("should create an optional primitive", function(){
        const name = optional(string, "ghost");
        expect(name.create()).toEqual("ghost");
    });
});

describe("String", function () {
    it("should throw because initial value is not a String", function () {
        expect(() => string.create(123 as any as string)).toThrowError();
    });

    it("should create a string", function () {
        const name = string.create("Fraktar");
        expect(typeof name).toEqual("string");
    });

    it("should not be a valid string", function () {
        expect(string.validate(0)).toBeFalsy();
    });

    it("should be a valid string", function () {
        expect(string.validate("Fraktar")).toBeTruthy();
    });
});

describe("Number", function () {
    it("should throw because initial value is not a Number", function () {
        expect(() => number.create("hj" as any as number)).toThrowError();
    });

    it("should create a number", function () {
        const force = number.create(123);
        expect(typeof force).toEqual("number");
    });

    it("should not be a valid number", function () {
        expect(number.validate("0")).toBeFalsy();
    });

    it("should be a valid number", function () {
        expect(number.validate(0)).toBeTruthy();
    });
});

describe("Boolean", function () {
    it("should throw because initial value is not a Boolean", function () {
        expect(() => boolean.create(9 as any as boolean)).toThrowError();
    });

    it("should create a boolean", function () {
        const isAdmin = boolean.create(true);
        expect(typeof isAdmin).toEqual("boolean");
    });

    it("should not be a valid boolean", function () {
        expect(boolean.validate(0)).toBeFalsy();
    });

    it("should be a valid boolean", function () {
        expect(boolean.validate(false)).toBeTruthy();
    });
});
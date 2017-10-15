import {object} from "../src/api/Object";
import {createInstance} from "../src/lib/Instance";

describe("Instance of types", function () {
    it("should not create an Instance from an existing Instance", function () {
        const Type = object("model", {});
        const instance = Type.create({});
        expect(() => createInstance(Type, instance)).toThrowError();
    });
});
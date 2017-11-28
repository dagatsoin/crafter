import {object} from "../src/api/object";
import {number, string} from "../src/api/primitives";
import {identifier} from "../src/api/identifier";

it("should throw if multiple identifiers provided", function() {
    expect(() => {
        const Model = object("Model", {
            id: identifier(number),
            pk: identifier(number)
        });
        Model.create({ id: 1, pk: 2 });
    }).toThrowError(`[crafter] Cannot define property 'pk' as object identifier, property 'id' is already defined as identifier property`);
});

it( "should throw if identifier of wrong type", function() {
    expect(() => {
        const Model = object("Model", { id: identifier(number) });
        Model.create({ id: "1" }, true);
    }).toThrowError(`[crafter] expected first argument to be a Model, got \`{"id":"1"}\` instead.`);
});

it("should be used only on model types - no parent provided", function() {
    expect(() => {
        const Model = identifier(number);
        Model.create(1);
    }).toThrowError(`[crafter] Identifier types can only be instantiated as direct child of an object type`);
});

it("should accept any string character", function() {
    const Todo = object("Todo", {
        id: identifier(string),
        title: string
    });

    expect(() => {
        ["coffee", "cof$fee", "cof|fee", "cof/fee"].forEach(id => {
            Todo.create({
                id: id,
                title: "Get coffee"
            });
        });
    }).not.toThrow();
});

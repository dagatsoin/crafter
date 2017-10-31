import {object} from "../src/api/Object";
import {number, string} from "../src/api/Primitives";
import {identifier} from "../src/api/Identifier";

it("should throw if multiple identifiers provided", function() {
    expect(() => {
        const Model = object("Model", {
            id: identifier(number),
            pk: identifier(number)
        });
        Model.create({ id: 1, pk: 2 });
    }).toThrowError(`[chewing] Cannot define property 'pk' as object identifier, property 'id' is already defined as identifier property`);
});

it( "should throw if identifier of wrong type", function() {
    expect(() => {
        const Model = object("Model", { id: identifier(number) });
        Model.create({ id: "1" });
    }).toThrowError(`[chewing] Error while converting \`{\"id\":\"1\"}\` to \`Model\`:\nat path \"/id\" value \`\"1\"\` is not assignable to type: \`identifier(number)\` (Value is not a number), expected an instance of \`identifier(number)\` or a snapshot like \`identifier(number)\` instead.`);
});

it("should be used only on model types - no parent provided", function() {
    expect(() => {
        const Model = identifier(number);
        Model.create(1);
    }).toThrowError(`[chewing] Identifier types can only be instantiated as direct child of a model type`);
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

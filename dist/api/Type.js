"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("../lib/core/Node");
var utils_1 = require("../lib/utils");
var mobx_1 = require("mobx");
var Type = /** @class */ (function () {
    function Type(name) {
        this.isType = true;
        this.mutations = [];
        this.name = name;
    }
    Object.defineProperty(Type.prototype, "Type", {
        get: function () {
            return utils_1.fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Register an allowed mutation for an ObjectType instance
     * @param mutationType
     */
    Type.registerMutation = function (mutationType, mutation) {
        var index = Type.allowedMutations.findIndex(function (m) { return m.mutationType === mutationType; });
        if (index === -1)
            Type.allowedMutations.push({ mutationType: mutationType, mutation: mutation });
        else
            Type.allowedMutations[index].mutation = mutation;
    };
    Type.prototype.addMutations = function (mutationTypes) {
        var _this = this;
        mutationTypes.forEach(function (type) {
            // Check if it is an allowed mutation.
            if (!Type.allowedMutations.find(function (m) { return m.mutationType === type; }))
                console.warn("The mutation " + type + " is not allowed.");
            else {
                var index = _this.mutations.indexOf(type);
                if (index === -1) {
                    Node_1.mutationNodesIndex.set(type, []);
                    _this.mutations.push(type);
                }
            }
        });
    };
    ;
    Type.prototype.removeMutations = function (mutationTypes) {
        var _this = this;
        mutationTypes.forEach(function (type) {
            var index = _this.mutations.indexOf(type);
            if (index > -1) {
                _this.mutations.splice(index, 1);
                Node_1.mutationNodesIndex.delete(type);
            }
        });
    };
    ;
    Type.prototype.getMutation = function (type) {
        var allowedMutation = Type.allowedMutations.find(function (m) { return m.mutationType === type; });
        return allowedMutation ? allowedMutation.mutation : null;
    };
    Type.prototype.getChildNode = function (node, key) {
        return utils_1.fail("No child '" + key + "' available in type: " + this.name);
    };
    Type.prototype.is = function (value) {
        return this.validate(value);
    };
    Type.prototype.validate = function (thing) {
        return this.isValidSnapshot(thing);
    };
    Type.prototype.create = function (snapshot, check) {
        utils_1.assertType(snapshot, this, "first", check);
        return this.instantiate(null, "", snapshot).value;
    };
    Type.prototype.applyPatchLocally = function (node, subpath, patch) {
        utils_1.fail("Immutable types do not support applying patches");
    };
    Type.prototype.applySnapshot = function (node, snapshot) {
        utils_1.fail("Error from abstract class Type. Immutable value can't be restored.");
    };
    Type.prototype.getValue = function (node) {
        return node.data;
    };
    Type.prototype.reconcile = function (current, newValue) {
        // reconcile only if type and value are still the same
        if (current.type === this && current.data === newValue)
            return current;
        var res = this.instantiate(current.parent, current.subPath, newValue);
        current.remove();
        return res;
    };
    Type.prototype.getChildType = function (key) {
        return utils_1.fail("No child '" + key + "' available in type: " + this.name);
    };
    Type.prototype.isAssignableFrom = function (type) {
        return type === this;
    };
    Type.allowedMutations = [];
    __decorate([
        mobx_1.observable
    ], Type.prototype, "mutations", void 0);
    return Type;
}());
exports.Type = Type;
var ComplexType = /** @class */ (function (_super) {
    __extends(ComplexType, _super);
    function ComplexType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComplexType.prototype.create = function (snapshot, check) {
        if (snapshot === void 0) { snapshot = this.getDefaultSnapshot(); }
        return _super.prototype.create.call(this, snapshot, check);
    };
    ComplexType.prototype.applySnapshot = function (node, snapshot) {
        utils_1.fail("Immutable types do not support applying snapshots");
    };
    ComplexType.prototype.applyPatch = function (node, patch) {
        throw new Error("Method not implemented.");
    };
    ComplexType.prototype.getChildNode = function (node, key) {
        return utils_1.fail("No child '" + key + "' available in type: " + this.name);
    };
    return ComplexType;
}(Type));
exports.ComplexType = ComplexType;
//# sourceMappingURL=Type.js.map
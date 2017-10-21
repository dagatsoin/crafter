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
Object.defineProperty(exports, "__esModule", { value: true });
var Type_1 = require("../api/Type");
var Instance_1 = require("./Instance");
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var Primitives_1 = require("../api/Primitives");
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType(opts) {
        var _this = _super.call(this, opts.name || "AnonymousObject") || this;
        _this.properties = {};
        /**
         * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
         * @param {Instance} instance
         * @param {S} snapshot
         */
        _this.buildInstance = function (instance, snapshot) {
            _this.forAllProps(function (name, type) {
                mobx_1.extendShallowObservable(instance.storedValue, (_a = {},
                    _a[name] = mobx_1.observable.ref(type.instantiate(snapshot ? snapshot[name] : null).storedValue),
                    _a));
                var _a;
            });
        };
        _this.forAllProps = function (fn) {
            _this.propertiesNames.forEach(function (key) { return fn(key, _this.properties[key]); });
        };
        _this.properties = sanitizeProperties(opts.properties || {});
        _this.propertiesNames = Object.keys(_this.properties);
        return _this;
    }
    ObjectType.prototype.isValidSnapshot = function (value) {
        var _this = this;
        return !utils_1.isPlainObject(value) ? false : this.propertiesNames.some(function (key) { return _this.properties[key].validate(value[key]); });
    };
    ObjectType.prototype.instantiate = function (snapshot) {
        return Instance_1.createInstance(this, snapshot, this.createEmptyInstance, this.buildInstance);
    };
    ObjectType.prototype.getSnapshot = function (instance) {
        var value = {};
        this.forAllProps(function (name, type) {
            value[name] = instance.getChildren()[name].snapshot;
        });
        return value;
    };
    ObjectType.prototype.applySnapshot = function (instance, snapshot) {
        var _this = this;
        mobx_1.transaction(function () {
            _this.forAllProps(function (name, type) {
                instance.storedValue[name] = snapshot[name];
            });
        });
    };
    ObjectType.prototype.getValue = function (instance) {
        return instance.storedValue;
    };
    ObjectType.prototype.createEmptyInstance = function () {
        var object = mobx_1.observable.shallowObject({});
        return object;
    };
    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Instance>}
     */
    ObjectType.prototype.getChildren = function (instance) {
        var children = [];
        this.forAllProps(function (name, type) { return children.push(instance.storedValue[name].$instance); });
        return children;
    };
    return ObjectType;
}(Type_1.ComplexType));
exports.ObjectType = ObjectType;
/**
 * Return safe to use properties.
 * 1- Remove function, complex object, null/undefined, getter/setter
 * 2- As the user can define primitive type directly with value, we must convert primitive to Type.
 * @param {IObjectProperties<T>} properties
 * @return {{[K in keyof T]:IType<any, T>}}
 */
function sanitizeProperties(properties) {
    // loop through properties and ensures that all items are types
    return Object.keys(properties).reduce(function (properties, key) {
        // the user intended to use a view
        var descriptor = Object.getOwnPropertyDescriptor(properties, key);
        if ("get" in descriptor) {
            utils_1.fail("Getters are not supported as properties. Please use views instead");
        }
        // undefined and null are not valid
        var value = descriptor.value;
        if (value === null || undefined) {
            utils_1.fail("The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?");
        }
        else if (utils_1.isPrimitive(value)) {
            // its a primitive, convert to its type
            return Object.assign({}, properties, (_a = {},
                _a[key] = Primitives_1.getPrimitiveFactoryFromValue(value) // todo set optional
            ,
                _a));
        }
        else if (Type_1.isType(value)) {
            // its already a type
            return properties;
        }
        else if (typeof value === "object") {
            // no other complex values
            utils_1.fail("In property '" + key + "': base model's should not contain complex values: '" + value + "'");
        }
        else {
            utils_1.fail("Unexpected value for property '" + key + "'");
        }
        var _a;
    }, properties);
}
//# sourceMappingURL=Object.js.map
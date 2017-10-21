"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var Instance = /** @class */ (function () {
    function Instance(type, initialValue, initBaseType, buildType) {
        if (initBaseType === void 0) { initBaseType = utils_1.identity; }
        if (buildType === void 0) { buildType = function () {
        }; }
        this.parents = new Map();
        this.children = new Map();
        this.type = type;
        /* 1 - Init an empty instance of the type. If the type is an primitive type it will get its value.
         * If it it an object return {}, if it is an array it return  [], etc...
         * We also test if the node ref could be attached to the type. // todo put this as a static prop of the type */
        this.storedValue = initBaseType(initialValue);
        var canAttachInstanceRef = canAttachInstance(this.storedValue);
        /* 2 - // todo Observe the stored value to transform the Node tree in a Instance tree.*/
        /* 3 - Build and hydration phase. Only needed for complex type instance */
        if (!utils_1.isPrimitive(this.storedValue))
            buildType(this, initialValue);
        /* 4 - Add a reference to this node to the storedValue. This will allow to recognize this value as a Instance
         and use functions like restore, snapshot, type check, etc.*/
        if (canAttachInstanceRef) {
            Object.defineProperty(this.storedValue, "$instance", {
                enumerable: false,
                writable: false,
                configurable: true,
                value: this,
            });
        }
    }
    Instance.prototype.applySnapshot = function (snapshot) {
        if (snapshot !== this.snapshot)
            this.type.applySnapshot(this, snapshot);
    };
    Object.defineProperty(Instance.prototype, "snapshot", {
        get: function () {
            return this.type.getSnapshot(this);
        },
        enumerable: true,
        configurable: true
    });
    Instance.prototype.isRoot = function () {
    };
    Object.defineProperty(Instance.prototype, "value", {
        get: function () {
            return this.type.getValue(this);
        },
        enumerable: true,
        configurable: true
    });
    Instance.prototype.getChildren = function () {
        return this.type.getChildren(this);
    };
    __decorate([
        mobx_1.computed
    ], Instance.prototype, "snapshot", null);
    __decorate([
        mobx_1.computed
    ], Instance.prototype, "value", null);
    return Instance;
}());
exports.Instance = Instance;
/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Instance}
 */
function getInstance(value) {
    if (isNode(value))
        return value.$instance;
    else
        throw new Error("Value " + value + " is not a graph Node");
}
exports.getInstance = getInstance;
/**
 * Returns true if the given value is a node in a graph.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is ValueInstance}
 */
function isNode(value) {
    return !!(value && value.$instance);
}
exports.isNode = isNode;
function createInstance(type, initialValue, createEmptyInstance, hydrateInstance) {
    if (createEmptyInstance === void 0) { createEmptyInstance = utils_1.identity; }
    if (hydrateInstance === void 0) { hydrateInstance = function () {
    }; }
    if (isNode(initialValue))
        utils_1.fail("Passed value is already an a node: " + initialValue);
    return new Instance(type, initialValue, createEmptyInstance, hydrateInstance);
}
exports.createInstance = createInstance;
function canAttachInstance(value) {
    return (value &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value.storedValue && isNode(value.storedValue)) &&
        !isNode(value) &&
        !Object.isFrozen(value));
}
exports.canAttachInstance = canAttachInstance;
//# sourceMappingURL=Instance.js.map
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
    function Instance(type, initialValue, createNewInstance) {
        if (createNewInstance === void 0) { createNewInstance = utils_1.identity; }
        this.type = type;
        this.storedValue = createNewInstance(initialValue);
        /* Add the instance of this node to the storedValue. This will allow to recognize this value as a Instance
         and use functions like restore, snapshot, type check, etc.*/
        if (this.storedValue &&
            typeof this.storedValue === "object" &&
            !(this.storedValue instanceof Date) &&
            !utils_1.isInstance(this.storedValue) &&
            !Object.isFrozen(this.storedValue))
            Object.defineProperty(this.storedValue, "$instance", {
                enumerable: false,
                writable: false,
                configurable: true,
                value: this,
            });
    }
    Instance.prototype.restore = function (snapshot) {
        if (snapshot !== this.snapshot)
            this.type.restore(this, snapshot);
    };
    Object.defineProperty(Instance.prototype, "snapshot", {
        get: function () {
            return this.type.serialize(this);
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
    __decorate([
        mobx_1.computed
    ], Instance.prototype, "snapshot", null);
    __decorate([
        mobx_1.computed
    ], Instance.prototype, "value", null);
    return Instance;
}());
exports.Instance = Instance;
function createInstance(type, initialValue, createNewInstance) {
    if (createNewInstance === void 0) { createNewInstance = utils_1.identity; }
    if (utils_1.isInstance(initialValue))
        utils_1.fail("Passed value is already an Instance: " + initialValue);
    return new Instance(type, initialValue, createNewInstance);
}
exports.createInstance = createInstance;
//# sourceMappingURL=Instance.js.map
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
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType(opts) {
        var _this = _super.call(this, opts.name || "AnonymousObject") || this;
        _this.properties = {};
        _this.createNewInstance = function (snapshot) {
            var object = mobx_1.observable.object(snapshot);
            return object;
        };
        Object.assign(_this.properties, (opts.properties));
        _this.propertiesNames = Object.keys(_this.properties);
        return _this;
    }
    ObjectType.prototype.isValidSnapshot = function (value) {
        throw new Error("Method not implemented.");
    };
    ObjectType.prototype.instantiate = function (snapshot) {
        return Instance_1.createInstance(this, snapshot, this.createNewInstance);
    };
    ObjectType.prototype.serialize = function (instance) {
        return mobx_1.toJS(instance.storedValue);
    };
    ObjectType.prototype.restore = function (instance, snapshot) {
        var _this = this;
        mobx_1.transaction(function () {
            _this.propertiesNames.forEach(function (name) {
                instance.storedValue[name] = snapshot[name];
            });
        });
    };
    return ObjectType;
}(Type_1.ComplexType));
exports.ObjectType = ObjectType;
//# sourceMappingURL=Object.js.map
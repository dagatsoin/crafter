import {ComplexType, IObjectType,} from "../api/Type";
import {createInstance, Instance} from "./Instance";
import {observable, toJS, transaction} from "mobx";
import {isPlainObject} from "./utils";

export class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    private readonly propertiesNames: string[];
    private properties: { [K: string]: ComplexType<any, any> } = {};

    constructor(opts: {
        name?: string;
        properties?: object;
    }) {
        super(opts.name || "AnonymousObject");
        Object.assign(this.properties, (opts.properties));
        this.propertiesNames = Object.keys(this.properties);
    }

    isValidSnapshot(value: any): boolean {
        return !isPlainObject(value) ? false : this.propertiesNames.some(key => this.properties[key].validate(value[key]));
    }

    instantiate(snapshot: S): Instance {
        return createInstance(
            this,
            snapshot,
            this.createNewInstance
        );
    }

    serialize(instance: Instance): S {
        return toJS(instance.storedValue);
    }

    restore(instance: Instance, snapshot: S) {
        transaction(() => {
            this.propertiesNames.forEach((name: string) => {
                instance.storedValue[name] = (<any>snapshot)[name];
            });
        });
    }

    private createNewInstance = (snapshot: S) => {
        const object = observable.object(snapshot);
        return object as Object;
    }
}
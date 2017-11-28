import {IObjectProperties, IObjectType, Snapshot} from "./type";
import {ObjectType} from "../lib/Object";

export function object<T = {}>(
    name: string,
    properties?: IObjectProperties<T>
): IObjectType<Snapshot<T>, T>;

export function object<T = {}>(
    properties?: IObjectProperties<T>
): IObjectType<Snapshot<T>, T>;

export function object(
    ...args: any[]
) {
    const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel";
    const properties = args.shift() || {};
    return new ObjectType({name, properties});
}
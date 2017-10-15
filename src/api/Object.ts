import {IObjectProperties, IObjectType, Snapshot} from "./Type";
import {ObjectType} from "../lib/Object";

export function object<T = {}>(name?: string, properties?: IObjectProperties<T>): IObjectType<Snapshot<T>, T> {
    return new ObjectType({name, properties});
}
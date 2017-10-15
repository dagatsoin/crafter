import { IObjectProperties, IObjectType, Snapshot } from "./Type";
export declare function object<T = {}>(name?: string, properties?: IObjectProperties<T>): IObjectType<Snapshot<T>, T>;

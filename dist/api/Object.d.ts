import { IObjectProperties, IObjectType, Snapshot } from "./type";
export declare function object<T = {}>(name: string, properties?: IObjectProperties<T>): IObjectType<Snapshot<T>, T>;
export declare function object<T = {}>(properties?: IObjectProperties<T>): IObjectType<Snapshot<T>, T>;

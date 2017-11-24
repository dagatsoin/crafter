import { IMapChange, IMapWillChange, ObservableMap } from "mobx";
import { ComplexType, IType } from "../api/Type";
import { TypeFlag } from "../api/TypeFlags";
import { Node } from "./core/Node";
import { IJsonPatch } from "./core/jsonPatch";
export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T | any): this;
}
export declare function mapToString(this: ObservableMap<any>): string;
export declare class MapType<S, T> extends ComplexType<{
    [key: string]: S;
}, IExtendedObservableMap<T>> {
    shouldAttachNode: boolean;
    subType: IType<any, any>;
    readonly flags: TypeFlag;
    constructor(name: string, subType: IType<any, any>);
    instantiate(parent: Node | any, subPath: string, initialValue?: any): Node;
    describe(): string;
    createNewInstance: () => ObservableMap<{}>;
    finalizeNewInstance: (node: Node, snapshot: any) => void;
    getChildren(node: Node): Node[];
    getChildNode(node: Node, key: string): Node;
    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null;
    private verifyIdentifier(expected, node);
    getValue(node: Node): any;
    getSnapshot(node: Node): {
        [key: string]: any;
    };
    didChange(change: IMapChange<any>): void;
    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void;
    applySnapshot(node: Node, snapshot: any): void;
    getChildType(key: string): IType<any, any>;
    isValidSnapshot(value: any): boolean;
    getDefaultSnapshot(): {};
    removeChild(node: Node, subpath: string): void;
}

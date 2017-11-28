import { fail } from "./utils";
import { Node } from "./core/node";
import {IType, Type} from "../api/type";
import {TypeFlag} from "../api/typeFlags";

export type ITypeDispatcher = (snapshot: any) => IType<any, any>;

export class Union extends Type<any, any> {
    readonly dispatcher: ITypeDispatcher | null = null;
    readonly types: IType<any, any>[];

    constructor(name: string, types: IType<any, any>[], dispatcher: ITypeDispatcher | null) {
        super(name);
        this.dispatcher = dispatcher;
        this.types = types;
    }

    getSnapshot(node: Node): any {
        return node.data;
    }

    getChildren(node: Node): Array<Node> {
        return [];
    }

    get flag() {
        let result: TypeFlag = TypeFlag.Union;

        this.types.forEach(type => {
            result |= type.flag;
        });

        return result;
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.types.some(subType => subType.isAssignableFrom(type));
    }

    describe() {
        return "(" + this.types.map(factory => factory.describe()).join(" | ") + ")";
    }

    instantiate(parent: Node | any, subPath: string, initialValue?: any): Node {
        return this.determineType(initialValue).instantiate(parent, subPath, initialValue);
    }

    reconcile(current: Node, newValue: any): Node {
        return this.determineType(newValue).reconcile(current, newValue);
    }

    determineType(value: any): IType<any, any> {
        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value);
        }

        // find the most accomodating type
        const applicableTypes = this.types.filter(type => type.is(value));
        if (applicableTypes.length > 1)
            return fail(
                `Ambiguos snapshot ${JSON.stringify(value)} for union ${this
                    .name}. Please provide a dispatch in the union declaration.`
            );

        return applicableTypes[0];
    }

    isValidSnapshot(value: any): boolean {
        if (this.dispatcher !== null) {
            return this.dispatcher(value).validate(value);
        }
        return true;
    }
}
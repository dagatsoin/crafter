import {IType, Type} from "../api/Type";
import {getNode, isInstance, Node} from "./Node";
import {assertType} from "./utils";

export type IFunctionReturn<T> = () => T;
export type IOptionalValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>;

export class OptionalValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>;
    readonly defaultValue: IOptionalValue<S, T>;

    constructor(type: IType<S, T>, defaultValue: IOptionalValue<S, T>) {
        super(type.name);
        this.type = type;
        this.defaultValue = defaultValue;
    }

    instantiate(parent: Node, subPath: string, value: S): Node {
        if (value === undefined) {
            const defaultValue = this.getDefaultValue();
            const defaultSnapshot = isInstance(defaultValue)
                ? getNode(defaultValue).snapshot
                : defaultValue;
            return this.type.instantiate(parent, subPath, defaultSnapshot);
        }
        return this.type.instantiate(parent, subPath, value);
    }

    reconcile(current: Node, newValue: any): Node {
        return this.type.reconcile(
            current,
            this.type.is(newValue) ? newValue : this.getDefaultValue()
        );
    }

    private getDefaultValue() {
        const defaultValue =
            typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue;
        if (typeof this.defaultValue === "function") assertType(this, defaultValue);
        return defaultValue;
    }

    isValidSnapshot(value: any): boolean {
        // defaulted values can be skipped
        if (value === undefined) return true;
        // bounce validation to the sub-type
        return this.type.validate(value);
    }

    getSnapshot(node: Node): S {
        return this.type.getSnapshot(node);
    }

    getChildren(node: Node): Node[] {
        return this.type.getChildren(node);
    }
}
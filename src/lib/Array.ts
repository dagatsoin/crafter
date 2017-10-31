import {ComplexType, IType} from "../api/Type";
import {fail} from "./utils";
import {IArrayWillChange, IArrayWillSplice, intercept, IObservableArray, observable} from "mobx";
import {areSame, getNode, isInstance, Instance, valueAsNode, createNode, Node} from "./Node";

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;

    constructor(name: string, itemType: IType<any, any>) {
        super(name);
        this.itemType = itemType;
    }

    getSnapshot(node: Node): S[] {
        return node.data.map((item: Instance) => item.$node!.snapshot);
    }

    instantiate(parent: Node, subPath: string, initialValue?: any): Node {
        return createNode(
            this,
            parent,
            "",
            initialValue,
            this.createEmptyInstance,
            this.buildInstance
        );
    }

    private createEmptyInstance = (snapshot: S[]) => {
        return observable.array();
    }

    private buildInstance = (node: Node, snapshot: S[]) => {
        intercept(node.data as IObservableArray<any>, change => this.willChange(change) as any);
        if (snapshot && snapshot.length) snapshot.forEach((item: S, index: number) => {
            const subInstance = this.itemType.instantiate(node, index.toString(), item);
            node.data.push(subInstance.data);
        });
    }

    isValidSnapshot(value: any): boolean {
        return value.constructor.name !== "array" ? false : value.some((item: any, index: any) => this.itemType.validate(item));
    }

    applySnapshot(node: Node, snapshot: any[]): void {
        const target = node.data as IObservableArray<any>;
        target.replace(snapshot);
    }

    getChildren(node: Node): Node[] {
        return node.data.map((item: Instance) => item.$node);
    }

    private willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        const node = getNode(change.object as Instance);
        const children = node.children;

        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index]) return null;
                change.newValue = this.reconcileArrayChildren(
                    node,
                    this.itemType,
                    [children[change.index]],
                    [change.newValue],
                    [change.index]
                )[0].data;
                break;
            case "splice":
                const { index, removedCount, added } = change;
                change.added = this.reconcileArrayChildren(
                    node,
                    this.itemType,
                    children.slice(index, index + removedCount),
                    added,
                    added.map((_, i) => index + i)
                ).map(node => node.data);

                // update paths of remaining items
                for (let i = index + removedCount; i < children.length; i++) {
                    children[i].setParent(node, "" + (i + added.length - removedCount));
                }
                break;
        }
        return change;
    }

    private reconcileArrayChildren<T>(
        parent: Node,
        childType: IType<any, T>,
        currentNodes: Node[],
        newValues: T[],
        newPaths: (string | number)[]
    ): Node[] {
        let currentNode: Node,
            newValue: any,
            hasNewNode = false,
            currentMatch: Node | undefined = undefined;

        for (let i = 0; ; i++) {
            currentNode = currentNodes[i];
            newValue = newValues[i];

            hasNewNode = i <= newValues.length - 1;

            // both are empty, end
            if (!currentNode && !hasNewNode) {
                break;
                // new one does not exists, old one dies
            } else if (!hasNewNode) {
                currentNode.remove();
                currentNodes.splice(i, 1);
                i--;
                // there is no old node, create it
            } else if (!currentNode) {
                // check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.
                if (isInstance(newValue) && getNode(newValue).parent === parent) {
                    console.log(newValue, parent)
                    // this node is owned by this parent, but not in the reconcilable set, so it must be double
                    fail(
                        `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent.path}${newPaths[
                            i
                            ]}', but it lives already at '${getNode(newValue).path}'`
                    );
                }
                currentNodes.splice(i, 0, valueAsNode(childType, parent, newPaths[i].toString(), newValue));
                // both are the same, reconcile
            } else if (areSame(currentNode, newValue)) {
                currentNodes[i] = valueAsNode(childType, parent, "" + newPaths[i], newValue, currentNode);
                // nothing to do, try to reorder
            } else {
                currentMatch = undefined;

                // find a possible candidate to reuse
                for (let j = i; j < currentNodes.length; j++) {
                    if (areSame(currentNodes[j], newValue)) {
                        currentMatch = currentNodes.splice(j, 1)[0];
                        break;
                    }
                }

                currentNodes.splice(
                    i,
                    0,
                    valueAsNode(childType, parent, "" + newPaths[i], newValue, currentMatch)
                );
            }
        }

        return currentNodes;
    }
}
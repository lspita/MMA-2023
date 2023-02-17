import BaseElement from "../core/elements/base"
import ModelElement from "../core/elements/modelElement"

export default class Tree extends ModelElement {
    constructor(name: string, callback?: (element: BaseElement) => void) {
        super(name, "assets/tree/", "tree.glb", callback)
    }
}
import ModelElement from "../core/elements/modelElement"

export default class Tree extends ModelElement {
    constructor(name: string) {
        super(name, "assets/tree/", "tree.glb")
    }
}
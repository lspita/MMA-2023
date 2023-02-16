import ModelElement from "../core/elements/modelElement"

export default class WiseTree extends ModelElement {
    constructor(name: string) {
        super(name, "assets/wisetree/", "wisetree.obj")
    }
}
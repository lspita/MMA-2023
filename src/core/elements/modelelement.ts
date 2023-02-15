import ModelImporter from "../importer"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, model: string) {
        super(name)
        ModelImporter.fromObj(model, this.mesh)
    }
}
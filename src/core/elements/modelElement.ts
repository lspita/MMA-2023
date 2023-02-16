import ModelImporter from "../importer"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string) {
        super(name)
        this.mesh.dispose()
        this.mesh = ModelImporter.fromObj(name, root, model)
    }
}
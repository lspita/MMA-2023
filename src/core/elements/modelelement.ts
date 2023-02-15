import { Mesh } from "@babylonjs/core"
import ModelImporter from "../importer"
import BaseElement from "./base"

export default class ModelElement extends BaseElement {
    static importedModels: { [model: string]: Mesh } = {}

    constructor(name: string, model: string) {
        super(name)
        if (ModelElement.importedModels[model] == undefined) {
            ModelImporter.fromObj(model, this.mesh)
            ModelElement.importedModels[model] = this.mesh
        }
        else {
            this.mesh = ModelElement.importedModels[model]
            this.mesh.name = name
        }
    }
}
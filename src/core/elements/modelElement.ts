import { Vector3 } from "@babylonjs/core"
import ModelImporter from "../importer"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, model: string, parentPosition = Vector3.Zero()) {
        super(name)
        this.mesh.dispose()
        this.mesh = ModelImporter.fromObj(model, name)
        this.mesh.position = parentPosition
    }
}
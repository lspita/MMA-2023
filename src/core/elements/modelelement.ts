import { Mesh } from "@babylonjs/core"
import ModelImporter from "../importer"
import BaseElement from "./base"

export default class ModelElement extends BaseElement {
    constructor(name: string, model: string) {
        super(name)
        ModelImporter.fromObj(model, this.mesh)
    }
}
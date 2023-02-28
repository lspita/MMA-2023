import { Mesh, SceneLoader, Vector3 } from "@babylonjs/core"
import Utils from "../utils"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string, importCallback?: (element: BaseElement) => void) {
        super()
        SceneLoader.ImportMesh("", root, model, undefined, (meshes) => {
            this.mesh = Utils.mergeWithCollisions(...meshes as Mesh[])
            this.mesh.name = name
            if (importCallback != null && importCallback != undefined) {
                importCallback(this)
            }
        })
    }
}
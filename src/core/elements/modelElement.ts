import { Mesh, SceneLoader } from "@babylonjs/core"
import Utils from "../utils"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string, importCallback?: (element: BaseElement) => void) {
        super()
        this.mesh = new Mesh(name)
        SceneLoader.ImportMeshAsync("", root, model).then((result) => {
            result.meshes.forEach((mesh) => {
                mesh.parent = this.mesh
            })
            if (importCallback != null && importCallback != undefined) {
                importCallback(this)
            }

        })
    }
}
import { Mesh, SceneLoader, Vector3 } from "@babylonjs/core"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string, importCallback?: (element: BaseElement) => void) {
        super()
        this.mesh = new Mesh(name)
        SceneLoader.ImportMesh("", root, model, undefined, (meshes) => {
            meshes.forEach((mesh) => {
                this.mesh.addChild(mesh)
                mesh.name = mesh.name + "Model"
                mesh.position = Vector3.Zero()
            })
            if (importCallback != null && importCallback != undefined) {
                importCallback(this)
            }
        })
    }
}
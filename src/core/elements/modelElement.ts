import { Mesh, SceneLoader, Vector3 } from "@babylonjs/core"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string, importCallback?: (element: BaseElement) => void) {
        super()
        this.mesh = new Mesh(name)
        ModelElement.fromObj(this, root, model, importCallback)
    }
    static async fromObj(parent: BaseElement, root: string, model: string, callback?: (element: BaseElement) => void) {
        SceneLoader.ImportMesh("", root, model, undefined, (meshes) => {
            meshes.forEach((mesh) => {
                parent.mesh.addChild(mesh)
                mesh.name = mesh.name + "Model"
                mesh.position = Vector3.Zero()
                if (callback != null && callback != undefined) {
                    callback(parent)
                }
            })
        })
    }
}
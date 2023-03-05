import { Mesh, SceneLoader } from "@babylonjs/core"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement { // base class for 3d Model importing
    constructor(name: string, root: string, model: string, importCallback?: (element: ModelElement) => void) {
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
import { Mesh, PhysicsImpostor, SceneLoader } from "@babylonjs/core"
import Utils from "../utils"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string, importCallback?: (element: BaseElement) => void) {
        super()
        SceneLoader.ImportMesh("", root, model, undefined, (meshes) => {
            this.mesh = meshes[0] as Mesh
            this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.MeshImpostor, { mass: 0 })
            this.mesh.name = name
            if (importCallback != null && importCallback != undefined) {
                importCallback(this)
            }
        })
    }
}
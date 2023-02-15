import { Mesh, SceneLoader, Vector3 } from "@babylonjs/core"
import "@babylonjs/loaders"

export default class ModelImporter {
    static fromObj(model: string, name: string) {
        let parent = new Mesh(name)
        SceneLoader.ImportMesh("", "", model, undefined, (meshes) => meshes.forEach((mesh) => {
            parent.addChild(mesh)
            mesh.name = mesh.name + "Model"
            mesh.position = Vector3.Zero()
        }))
        return parent
    }
}
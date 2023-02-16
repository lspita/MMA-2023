import { Mesh, SceneLoader, Vector3 } from "@babylonjs/core"
import "@babylonjs/loaders"

export default class ModelImporter {
    static fromObj(name: string, root: string, model: string) {
        let parent = new Mesh(name)
        SceneLoader.ImportMesh("", root, model, undefined, (meshes) => meshes.forEach((mesh) => {
            parent.addChild(mesh)
            mesh.name = mesh.name + "Model"
            mesh.position = Vector3.Zero()
        }), undefined, (_, m, __) => alert(m))
        return parent
    }
}
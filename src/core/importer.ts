import { Mesh, SceneLoader } from "@babylonjs/core"
import "@babylonjs/loaders"

export default class ModelImporter {
    static async fromObj(model: string, parent: Mesh) {
        let { meshes } = await SceneLoader.ImportMeshAsync("", "", model)
        meshes.forEach(mesh => parent.addChild(mesh))
    }
}
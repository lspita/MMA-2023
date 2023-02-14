import { Mesh, SceneLoader } from "@babylonjs/core"
import "@babylonjs/loaders"
import State from "./state"

export default class ModelImporter {
    static async fromObj(model: string, parent: Mesh, scene = State.scene) {
        let { meshes } = await SceneLoader.ImportMeshAsync("", "", model, scene)
        meshes.forEach(mesh => parent.addChild(mesh))
    }
}
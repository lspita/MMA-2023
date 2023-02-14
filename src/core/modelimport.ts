import { SceneLoader } from "@babylonjs/core"
import "@babylonjs/loaders"
import State from "./state"

export default class ModelImporter {
    static fromObj(filename: string, root: string = "./assets/models/") {
        SceneLoader.ImportMesh("", root, filename, State.scene, (meshes) => {
            alert("success")
        }, undefined, (s, m, e) => alert(m))
    }
}
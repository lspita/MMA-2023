import { Mesh, SceneLoader } from "@babylonjs/core"
import Utils from "../utils"
import BaseElement from "./base"

export default abstract class ModelElement extends BaseElement {
    constructor(name: string, root: string, model: string, importCallback?: (element: BaseElement) => void) {
        super()
        SceneLoader.ImportMeshAsync("", root, model).then(() => {
            if (importCallback != null && importCallback != undefined) {
                importCallback(this)
            }

        })
    }
}
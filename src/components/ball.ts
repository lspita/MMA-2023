import { MeshBuilder } from "@babylonjs/core"
import BaseComponent from "../core/base"
import ModelImporter from "../core/modelimport"

export default class Ball extends BaseComponent {
    constructor() {
        super()
        ModelImporter.fromObj("golfball.obj")
        // this.mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 })
    }
}
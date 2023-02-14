import { MeshBuilder } from "@babylonjs/core"
import BaseComponent from "../core/base"
import State from "../core/state"

export default class Sphere extends BaseComponent {
    constructor() {
        super()
        this.mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 })
    }
}
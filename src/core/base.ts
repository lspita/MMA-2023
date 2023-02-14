import { Mesh } from "@babylonjs/core"
import State from "./state"

export default class BaseElement {
    mesh: Mesh
    constructor(name: string) {
        this.mesh = new Mesh(name)
    }
    render() {
        State.scene.addMesh(this.mesh, true)
    }
}
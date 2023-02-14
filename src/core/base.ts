import { Mesh } from "@babylonjs/core"
import State from "./state"

export default class BaseElement {
    mesh: Mesh
    render() {
        State.scene.addMesh(this.mesh, true)
    }
}
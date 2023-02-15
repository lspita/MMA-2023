import { Mesh } from "@babylonjs/core"
import State from "../state"

export default class BaseElement {
    mesh: Mesh
    scene = State.scene
    constructor(name: string) {
        this.mesh = new Mesh(name)
    }
    render() {
        this.scene.addMesh(this.mesh, true)
    }
}
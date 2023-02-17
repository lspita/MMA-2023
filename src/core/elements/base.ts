import { Material, Mesh, StandardMaterial } from "@babylonjs/core"
import State from "../state"

export default abstract class BaseElement {
    mesh: Mesh
    static material: StandardMaterial = null
    scene = State.scene

    render() {
        this.scene.addMesh(this.mesh, true)
    }

    createMaterial(mat: Material, callback?: () => void) {
        if (mat == null) {
            callback()
        }
        this.mesh.material = mat
    }
}
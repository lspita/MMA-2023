import { Material, Mesh, StandardMaterial } from "@babylonjs/core"
import State from "../state"

export default abstract class BaseElement {
    mesh: Mesh
    static material: StandardMaterial = null
    scene = State.scene

    createMaterial(mat: Material, callback?: () => Material) {
        if (mat == null) {
            mat = callback()
        }
        this.mesh.material = mat
    }
}
import { Mesh, StandardMaterial } from "@babylonjs/core"
import State from "../state"

export default abstract class BaseElement { // Base class for every element
    mesh: Mesh = null
    static material: StandardMaterial = null
    scene = State.scene
}
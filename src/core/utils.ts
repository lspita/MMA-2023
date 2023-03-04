import { Mesh, PhysicsImpostor, StandardMaterial } from "@babylonjs/core"

export default class Utils {
    static random<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }

    static createMaterial(mat: StandardMaterial, callback?: () => StandardMaterial) {
        if (mat == null || mat == undefined) {
            mat = callback()
        }
        return mat
    }
}
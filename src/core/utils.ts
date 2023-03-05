import { StandardMaterial } from "@babylonjs/core"

export default class Utils {
    static random<T>(array: T[]): T { // Quick random item pick
        return array[Math.floor(Math.random() * array.length)]
    }

    static createMaterial(mat: StandardMaterial, creationFunction?: () => StandardMaterial) { // Create material only if null
        if (mat == null || mat == undefined) {
            mat = creationFunction()
        }
        return mat
    }
}
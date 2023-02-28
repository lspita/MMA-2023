import { Mesh, PhysicsImpostor } from "@babylonjs/core"
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh"

export default class Utils {
    static random<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }
    static mergeWithCollisions(...meshes: Mesh[]) {
        const merged = Mesh.MergeMeshes(meshes, true, true, undefined, false, true)
        merged.name = meshes[0].name + "Merged"
        merged.physicsImpostor = new PhysicsImpostor(merged, PhysicsImpostor.MeshImpostor, { mass: 0, friction: 1, restitution: 0.5 })
        return merged
    }
}
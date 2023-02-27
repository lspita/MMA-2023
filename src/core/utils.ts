import { Mesh, PhysicsImpostor } from "@babylonjs/core"

export default class Utils {
    static random<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }
    static mergeWithCollisions(mesh: Mesh) {
        const stepMerged = Mesh.MergeMeshes([mesh, ...mesh.getChildMeshes() as Mesh[]], true, true, undefined, false, true)
        mesh.dispose()
        mesh = stepMerged
        mesh.name = mesh.name + "Merged"
        mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.MeshImpostor, { mass: 0, friction: 1, restitution: 0.5 })
        return mesh
    }
}
import { MeshBuilder, StandardMaterial, Vector3, Mesh } from "@babylonjs/core"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"

export function RotateObstacle(name: string, size: number) {
    let pivot = MeshBuilder.CreateCylinder(name, { height: size * 0.1, diameter: size * 0.03 })
    pivot.position.y = 0

    let mid = MeshBuilder.CreateCylinder("center", { height: size * 0.08, diameter: size * 0.09 })
    mid.material = Tile.wallMat
    mid.parent = pivot
    mid.position = new Vector3(0, -size * 0.01, 0)

    let wall = MeshBuilder.CreateBox("wall", { height: size * 0.07, width: size * 0.9, depth: size * 0.05 })
    wall.material = Tile.wallMat
    wall.parent = mid
    wall.position = Vector3.Zero()

    State.scene.registerBeforeRender(() => {
        pivot.rotation.y += 5 * State.deltaTime
    })
    return pivot
}
import { MeshBuilder, Mesh, Vector3, PhysicsImpostor } from "@babylonjs/core"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"
import Utils from "../core/utils"

export type Obstacle = {
    curve: boolean
    builder: (name: string, size: number) => Mesh
}

export const Wheel: Obstacle = {
    curve: true,
    builder: (name: string, size: number) => {
        let pivot = MeshBuilder.CreateCylinder(name, { height: size * 0.1, diameter: size * 0.03 })
        pivot.position.y = 0

        let mid = MeshBuilder.CreateCylinder("center", { height: size * 0.08, diameter: size * 0.09 })
        mid.material = Tile.wallMat
        mid = Utils.mergeWithCollisions(mid)
        mid.parent = pivot
        mid.position = new Vector3(0, -size * 0.01, 0)

        let wall = MeshBuilder.CreateBox("wall", { height: size * 0.07, width: size * 0.9, depth: size * 0.05 })
        wall.material = Tile.wallMat
        wall = Utils.mergeWithCollisions(wall)
        wall.parent = mid
        wall.position = new Vector3(0, -size * 0.01, 0)

        State.scene.registerBeforeRender(() => {
            pivot.rotation.y += 2 * State.deltaTime
        })

        return pivot
    }
}

export const Barriers: Obstacle = {
    curve: true,
    builder: (name: string, size: number) => {
        const boxSize = size / 5
        const pivot = new Mesh(name)
        pivot.position.y = 0.5

        let box1 = MeshBuilder.CreateBox(name + "Box1", { height: 1, width: boxSize, depth: boxSize })
        let box2 = MeshBuilder.CreateBox(name + "Box2", { height: 1, width: boxSize, depth: boxSize })
        box1 = Utils.mergeWithCollisions(box1)
        box2 = Utils.mergeWithCollisions(box2)
        pivot.addChild(box1)
        pivot.addChild(box2)
        box1.position.y = box2.position.y = 0
        box1.material = box2.material = Tile.wallMat

        const side = ((size - boxSize) / 2) - 1.5

        State.scene.registerBeforeRender(() => {
            box1.position.x = side * (
                Math.abs(Math.cos(State.time)) * Math.cos(State.time) +
                Math.abs(Math.sin(State.time)) * Math.sin(State.time)
            )
            box1.position.z = side * (
                Math.abs(Math.cos(State.time)) * Math.cos(State.time) -
                Math.abs(Math.sin(State.time)) * Math.sin(State.time)
            )

            box2.position.x = -box1.position.x
            box2.position.z = -box1.position.z
        })
        return pivot
    }
}
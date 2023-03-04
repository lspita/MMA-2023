import { MeshBuilder, Mesh, Vector3, PhysicsImpostor } from "@babylonjs/core"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"

export type Obstacle = {
    curve: boolean
    builder: (name: string, tile: Tile) => Mesh
}

export const Wheel: Obstacle = {
    curve: true,
    builder: (name: string, tile: Tile) => {
        let pivot = MeshBuilder.CreateCylinder(name, { height: tile.wallSize * 1.7, diameter: tile.groundSize * 0.02 })
        pivot.physicsImpostor = new PhysicsImpostor(pivot, PhysicsImpostor.NoImpostor, { mass: 0 })
        pivot.position.y = 0

        let mid = MeshBuilder.CreateCylinder("center", { height: tile.wallSize * 1.5, diameter: tile.groundSize * 0.05 })
        mid.material = Tile.wallMat
        mid.physicsImpostor = new PhysicsImpostor(mid, PhysicsImpostor.CylinderImpostor, { mass: 0 })
        mid.parent = pivot
        mid.position = new Vector3(0, -tile.wallSize * 0.15, 0)

        let wall = MeshBuilder.CreateBox("wall", { height: tile.wallSize * 1.4, width: tile.groundSize * 0.9, depth: tile.groundSize * 0.04 })
        wall.material = Tile.wallMat
        wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.BoxImpostor, { mass: 0 })
        wall.parent = mid
        wall.position = new Vector3(0, -tile.wallSize * 0.15, 0)
        State.scene.registerBeforeRender(() => {
            wall.rotate(Vector3.Up(), State.deltaTime)
        })

        return pivot
    }
}

export const Barriers: Obstacle = {
    curve: true,
    builder: (name: string, tile: Tile) => {
        const boxSize = tile.groundSize / 5
        const pivot = new Mesh(name)
        pivot.position.y = 0.5

        let box1 = MeshBuilder.CreateBox(name + "Box1", { height: tile.wallSize * 1.5, width: boxSize, depth: boxSize })
        let box2 = MeshBuilder.CreateBox(name + "Box2", { height: tile.wallSize * 1.5, width: boxSize, depth: boxSize })
        box1.physicsImpostor = new PhysicsImpostor(box1, PhysicsImpostor.BoxImpostor, { mass: 0 })
        box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor, { mass: 0 })
        box1.parent = box2.parent = pivot
        box1.position.y = box2.position.y = 0
        box1.material = box2.material = Tile.wallMat

        const side = ((tile.groundSize - boxSize) / 2) - tile.wallSize * 1.5
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

export const Pendolum: Obstacle = {
    curve: false,
    builder: (name: string, tile: Tile) => {
        let step = tile.wallSize * 2
        const pivot = new Mesh(name)
        pivot.position.y = tile.groundSize
        for (let i = -(tile.groundSize / 2) + (step / 2), n = (tile.groundSize / 2) - (step / 2); i <= n; i += step) {
            const wall = MeshBuilder.CreateBox(name + "Wall" + i, {
                height: pivot.position.y / 2,
                width: step / 2,
                depth: step
            })
            wall.material = Tile.wallMat
            wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.BoxImpostor, { mass: 0 })
            wall.parent = pivot
            let initialPos = -pivot.position.y / 4
            wall.position.y = initialPos
            wall.position.z = i
            State.scene.registerBeforeRender(() => {
                wall.position.y = (Math.abs(Math.sin(State.time + i)) * initialPos * 2) + initialPos
            })
        }


        return pivot
    }
}
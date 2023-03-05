import { MeshBuilder, Mesh, Vector3, PhysicsImpostor } from "@babylonjs/core"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"

export type Obstacle = {
    onlyStraightTiles: boolean // Identifies if mesh can stay only on straight tiles
    id: string // Identifier of the obstacle type
    builder: (name: string, tile: Tile) => Mesh // Contructor
}

export const Wheel: Obstacle = { // Spinning ground wheel
    onlyStraightTiles: false,
    id: "wheel",
    builder: (name: string, tile: Tile) => {
        let pivot = MeshBuilder.CreateCylinder(name, { height: tile.wallSize * 1.7, diameter: tile.groundSize * 0.02 })
        pivot.physicsImpostor = new PhysicsImpostor(pivot, PhysicsImpostor.NoImpostor, tile.impostorParams)
        pivot.position.y = 0

        let mid = MeshBuilder.CreateCylinder("center", { height: tile.wallSize * 1.5, diameter: tile.groundSize * 0.05 })
        mid.material = Tile.wallMat
        mid.physicsImpostor = new PhysicsImpostor(mid, PhysicsImpostor.CylinderImpostor, tile.impostorParams)
        mid.parent = pivot
        mid.position = new Vector3(0, -tile.wallSize * 0.15, 0)

        let wall = MeshBuilder.CreateBox("wall", { height: tile.wallSize * 1.4, width: tile.groundSize * 0.9, depth: tile.groundSize * 0.04 })
        wall.material = Tile.wallMat
        wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.BoxImpostor, tile.impostorParams)
        wall.parent = mid
        wall.position = new Vector3(0, -tile.wallSize * 0.15, 0)
        State.scene.registerBeforeRender(() => {
            wall.rotate(Vector3.Up(), State.deltaTime)
        })

        return pivot
    }
}

export const Barriers: Obstacle = { // Moving squares on ground
    onlyStraightTiles: false,
    id: "barriers",
    builder: (name: string, tile: Tile) => {
        const boxSize = tile.groundSize / 5
        const pivot = new Mesh(name)
        pivot.position.y = 0.5

        let box1 = MeshBuilder.CreateBox(name + "Box1", { height: tile.wallSize * 1.5, width: boxSize, depth: boxSize })
        let box2 = MeshBuilder.CreateBox(name + "Box2", { height: tile.wallSize * 1.5, width: boxSize, depth: boxSize })
        box1.physicsImpostor = new PhysicsImpostor(box1, PhysicsImpostor.BoxImpostor, tile.impostorParams)
        box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor, tile.impostorParams)
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

export const Wallterfall: Obstacle = { // Walls wave
    onlyStraightTiles: true,
    id: "wallterfall",
    builder: (name: string, tile: Tile) => {
        let nWalls = 30
        let step = tile.groundSize / nWalls
        const pivot = new Mesh(name)
        pivot.position.y = tile.groundSize / 4

        let start = -(tile.groundSize / 2) + (step / 2)
        let end = -start
        let initialPos = -pivot.position.y / 6
        let offSet = initialPos * 2
        for (let i = 0; i < nWalls; i++) {
            let wallZ = start + (i * step)
            const wallFar = MeshBuilder.CreateBox(name + "WallFar" + wallZ, {
                height: pivot.position.y * 2 / 3,
                width: step * 2,
                depth: step
            })
            const wallNear = MeshBuilder.CreateBox(name + "WallNear" + wallZ, {
                height: pivot.position.y * 2 / 3,
                width: step * 2,
                depth: step
            })

            wallFar.material = wallNear.material = Tile.wallMat

            wallFar.physicsImpostor = new PhysicsImpostor(wallFar, PhysicsImpostor.BoxImpostor, tile.impostorParams)
            wallNear.physicsImpostor = new PhysicsImpostor(wallNear, PhysicsImpostor.BoxImpostor, tile.impostorParams)

            wallFar.parent = wallNear.parent = pivot

            wallFar.position = new Vector3(
                tile.groundSize / 8,
                initialPos,
                wallZ
            )
            wallNear.position = wallFar.position.clone()
            wallNear.position.x *= -1

            State.scene.registerBeforeRender(() => {
                let val = Math.sin(State.time + (wallZ * Math.PI / (end - start))) * offSet
                wallFar.position.y = val + offSet
                wallNear.position.y = -val + offSet
            })
        }

        for (let i = 0; i < 4; i++) {
            const pole = MeshBuilder.CreateBox(name + "Pole" + (i + 1), {
                height: pivot.position.y * 4 / 3,
                width: step * 2.5,
                depth: tile.wallSize
            })
            pole.physicsImpostor = new PhysicsImpostor(pole, PhysicsImpostor.BoxImpostor, tile.impostorParams)
            pole.parent = pivot
            pole.position = new Vector3(
                tile.groundSize / 8 * (i % 2 == 0 ? 1 : -1),
                -pivot.position.y / 3,
                (tile.groundSize / 2) * (i < 2 ? 1 : -1)
            )
        }

        return pivot
    }
}

export const Propeller: Obstacle = { // Tile size propeller
    onlyStraightTiles: true,
    id: "propeller",
    builder: (name: string, tile: Tile) => {
        const pivot = new Mesh(name)

        const center = MeshBuilder.CreateCylinder(name + "Center", {
            height: tile.wallSize,
            diameter: tile.groundSize / 6
        })

        center.physicsImpostor = new PhysicsImpostor(center, PhysicsImpostor.CylinderImpostor, tile.impostorParams)
        center.parent = pivot
        center.rotate(Vector3.Forward(), Math.PI / 2)

        const torus = MeshBuilder.CreateTorus(name + "Arc", {
            diameter: tile.size,
            thickness: tile.wallSize,
            tessellation: 40
        })

        torus.physicsImpostor = new PhysicsImpostor(torus, PhysicsImpostor.MeshImpostor, tile.impostorParams)
        torus.parent = pivot
        torus.rotate(Vector3.Forward(), Math.PI / 2)

        const blade1 = MeshBuilder.CreateBox(name + "Blade1", {
            width: tile.wallSize / 2,
            height: tile.size,
            depth: tile.groundSize / 6
        })

        const blade2 = MeshBuilder.CreateBox(name + "Blade2", {
            width: tile.wallSize / 2,
            height: tile.size,
            depth: tile.groundSize / 6
        })

        blade1.rotate(Vector3.Right(), Math.PI / 2)
        blade2.rotate(Vector3.Right(), Math.PI)

        blade2.rotation.y = Math.PI / 2

        blade1.material = blade2.material = Tile.wallMat

        blade1.physicsImpostor = new PhysicsImpostor(blade1, PhysicsImpostor.BoxImpostor, tile.impostorParams)
        blade2.physicsImpostor = new PhysicsImpostor(blade2, PhysicsImpostor.BoxImpostor, tile.impostorParams)
        blade1.parent = blade2.parent = pivot

        State.scene.registerBeforeRender(() => {
            blade1.rotate(Vector3.Right(), State.deltaTime)
            blade2.rotate(Vector3.Right(), State.deltaTime)
            center.rotate(Vector3.Down(), State.deltaTime)
        })

        return pivot
    }
}
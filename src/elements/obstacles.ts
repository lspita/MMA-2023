import { MeshBuilder, Mesh, Vector3, PhysicsImpostor } from "@babylonjs/core"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"

export type Obstacle = {
    curve: boolean
    builder: (name: string, tile: Tile) => Mesh
}

// export const Wheel: Obstacle = {
//     curve: true,
//     builder: (name: string, tile: Tile) => {
//         let pivot = MeshBuilder.CreateCylinder(name, { height: tile.wallSize * 1.7, diameter: tile.groundSize * 0.02 })
//         pivot.physicsImpostor = new PhysicsImpostor(pivot, PhysicsImpostor.NoImpostor, tile.impostorParams)
//         pivot.position.y = 0

//         let mid = MeshBuilder.CreateCylinder("center", { height: tile.wallSize * 1.5, diameter: tile.groundSize * 0.05 })
//         mid.material = Tile.wallMat
//         mid.physicsImpostor = new PhysicsImpostor(mid, PhysicsImpostor.CylinderImpostor, tile.impostorParams)
//         mid.parent = pivot
//         mid.position = new Vector3(0, -tile.wallSize * 0.15, 0)

//         let wall = MeshBuilder.CreateBox("wall", { height: tile.wallSize * 1.4, width: tile.groundSize * 0.9, depth: tile.groundSize * 0.04 })
//         wall.material = Tile.wallMat
//         wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.BoxImpostor, tile.impostorParams)
//         wall.parent = mid
//         wall.position = new Vector3(0, -tile.wallSize * 0.15, 0)
//         State.scene.registerBeforeRender(() => {
//             wall.rotate(Vector3.Up(), State.deltaTime)
//         })

//         return pivot
//     }
// }

export const Barriers: Obstacle = {
    curve: true,
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

export const Wallterfall: Obstacle = {
    curve: false,
    builder: (name: string, tile: Tile) => {
        let step = tile.wallSize / 2
        console.log(step)
        const pivot = new Mesh(name)
        pivot.position.y = tile.groundSize / 4

        let start = -(tile.groundSize / 2) + (step / 2)
        let end = (tile.groundSize / 2) - (step / 2)
        for (let i = start; i <= end; i += step) {
            let initialPos = -pivot.position.y / 6

            const wall1 = MeshBuilder.CreateBox(name + "Wall" + i, {
                height: pivot.position.y * 2 / 3,
                width: step * 2,
                depth: step
            })
            wall1.material = Tile.wallMat
            wall1.physicsImpostor = new PhysicsImpostor(wall1, PhysicsImpostor.BoxImpostor, tile.impostorParams)
            wall1.parent = pivot
            wall1.position = new Vector3(
                tile.groundSize / 8,
                initialPos,
                i
            )

            const wall2 = MeshBuilder.CreateBox(name + "Wall" + i, {
                height: pivot.position.y * 2 / 3,
                width: step * 2,
                depth: step
            })
            wall2.material = Tile.wallMat
            wall2.physicsImpostor = new PhysicsImpostor(wall2, PhysicsImpostor.BoxImpostor, tile.impostorParams)
            wall2.parent = pivot
            wall2.position = new Vector3(
                -tile.groundSize / 8,
                initialPos,
                i
            )

            State.scene.registerBeforeRender(() => {
                wall1.position.y = (Math.sin(State.time + (i * Math.PI / (end - start))) * initialPos * 2) + (initialPos * 2)
                wall2.position.y = (Math.cos(State.time + (i * Math.PI / (end - start)) + Math.PI / 2) * initialPos * 2) + (initialPos * 2)
            })
        }

        for (let i = 0; i < 4; i++) {
            const pole = MeshBuilder.CreateBox(name + "Pole" + i, {
                height: pivot.position.y * 5 / 3,
                width: step * 2.5,
                depth: tile.wallSize * 0.9
            })
            pole.physicsImpostor = new PhysicsImpostor(pole, PhysicsImpostor.BoxImpostor, tile.impostorParams)
            pole.parent = pivot
            pole.position = new Vector3(
                tile.groundSize / 8 * (i % 2 == 0 ? 1 : -1),
                -pivot.position.y / 2,
                (start - tile.wallSize * 0.9 + (step / 2)) * (i < 2 ? 1 : -1)
            )
        }

        return pivot
    }
}
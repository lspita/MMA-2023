import { MeshBuilder, Mesh, Vector3, PhysicsImpostor } from "@babylonjs/core"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"
import Utils from "../core/utils"

export type Obstacle = {
    curve: boolean
    builder: (name: string, tile: Tile) => Mesh
}

export const Wheel: Obstacle = {
    curve: true,
    builder: (name: string, tile: Tile) => {
        let pivot = MeshBuilder.CreateCylinder(name, { height: tile.wallSize * 1.2, diameter: tile.wallSize * 0.5 })
        pivot.physicsImpostor = new PhysicsImpostor(pivot, PhysicsImpostor.CylinderImpostor, { mass: 0 })
        pivot.position.y = 0

        let mid = MeshBuilder.CreateCylinder("center", { height: tile.wallSize * 1, diameter: tile.wallSize * 1.5 })
        mid.material = Tile.wallMat
        mid.physicsImpostor = new PhysicsImpostor(mid, PhysicsImpostor.CylinderImpostor, { mass: 0 })
        mid.parent = pivot
        mid.position = new Vector3(0, -tile.wallSize * 0.15, 0)

        let wall = MeshBuilder.CreateBox("wall", { height: tile.wallSize * 0.9, width: tile.groundSize * 0.9, depth: tile.wallSize * 0.9 })
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

        let box1 = MeshBuilder.CreateBox(name + "Box1", { height: tile.wallSize, width: boxSize, depth: boxSize })
        let box2 = MeshBuilder.CreateBox(name + "Box2", { height: tile.wallSize, width: boxSize, depth: boxSize })
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

let dongMat: StandardMaterial
export const Pendolum: Obstacle = {
    curve: false,
    builder: (name: string, tile: Tile) => {
        let pivot = MeshBuilder.CreateBox(name, { height: tile.wallSize / 2, width: tile.wallSize * 0.35, depth: tile.wallSize * 0.75 })

        dongMat = Utils.createMaterial(dongMat, () => {
            dongMat = new StandardMaterial("dongMat")
            dongMat.diffuseColor.set(1, 215 / 255, 0)
            return dongMat
        })

        pivot.position.y = (tile.groundSize * (2 / 3))
        const support = MeshBuilder.CreateBox(name + "support", { height: tile.groundSize * (2 / 3), width: tile.wallSize * 0.2, depth: tile.wallSize * 0.6 })
        const dong = MeshBuilder.CreateCylinder(name + "dong", { height: tile.wallSize * 0.35, diameter: tile.wallSize * tile.wallSize })
        dong.rotation.z = Math.PI / 2
        dong.material = dongMat

        pivot.material = dongMat
        support.material = Tile.wallMat


        pivot.addChild(dong)
        pivot.addChild(support)

        support.position.y = (-tile.groundSize * (1 / 3))
        pivot.position.y += (tile.wallSize * tile.wallSize) / 2

        const pendolum = Utils.merge(support, dong)
        pivot.addChild(pendolum)


        State.scene.registerBeforeRender(() => {
            pivot.rotate(Vector3.Right(), (Math.cos(State.time * 2) * 0.7) - pivot.absoluteRotationQuaternion.toEulerAngles().x)
        })

        return pivot
    }
}
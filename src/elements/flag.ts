import { Color3, CSG, Mesh, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core"
import BaseElement from "../core/elements/base"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"
import Utils from "../core/utils"

export default class Flag extends BaseElement {
    static clothMat: StandardMaterial
    private groundPortion: Mesh
    private pole: Mesh
    private cloth: Mesh
    tileMesh: Mesh

    constructor(name: string, tile: Tile) {
        super()
        this.createMaterial(Flag.material, () => {
            Flag.material = new StandardMaterial("poleMat")
            Flag.material.diffuseColor = new Color3(130 / 255, 135 / 255, 136 / 255)
            Flag.clothMat = new StandardMaterial("clothMat")
            Flag.clothMat.diffuseColor = Color3.Red()
            return Flag.material
        })
        this.pole = MeshBuilder.CreateCylinder(name + "Pole", { diameter: tile.wallSize * 0.3, height: tile.groundSize * 0.5 })
        this.pole.material = Flag.material

        this.cloth = MeshBuilder.CreateBox(name + "CLoth", { height: tile.groundSize / 10, width: tile.groundSize / 6, depth: tile.wallSize * 0.2 })
        this.cloth.parent = this.pole
        this.cloth.position.y = (tile.groundSize / 4) - tile.groundSize / 19
        this.cloth.position.x = tile.groundSize / 12
        this.cloth.material = Flag.clothMat

        this.groundPortion = MeshBuilder.CreateCylinder(name + "Ground", { diameter: 4, height: 5 })
        this.groundPortion.parent = this.pole
        this.groundPortion.position.y = -((tile.groundSize / 4) + (tile.wallSize / 2))
        this.groundPortion.material = Tile.material

        this.pole.position.y = - (tile.groundSize / 4) - (tile.wallSize / 2)
        this.pole.rotation.y = Math.PI / 2

        this.mesh = this.pole
        this.mesh.position.y = -(9 + tile.wallSize)
        this.mesh = Utils.merge(this.mesh, ...this.mesh.getChildMeshes() as Mesh[])
    }

    createHole(tile: Tile) {
        // const tileCSG = CSG.FromMesh(tile.mesh)
        // const groundCSG = CSG.FromMesh(this.groundPortion)
        // tileCSG.subtract(groundCSG)

        // const tileSubtract = tileCSG.toMesh(tile.mesh.name, tile.mesh.material)
        const tileSubtract = tile.mesh
        return Utils.merge(tileSubtract, ...tileSubtract.getChildMeshes() as Mesh[])
    }

    follow(mesh: Mesh, radius: number) {
        const startY = mesh.position.y
        const flagStartY = this.mesh.position.y

        State.scene.registerBeforeRender(() => {
            const relativePos = mesh.position.subtract(this.mesh.position)
            this.mesh.addRotation(
                0,
                Math.atan2(-relativePos.z, relativePos.x) -
                this.mesh.absoluteRotationQuaternion.toEulerAngles().y,
                0
            )
            const baseFlagPos = new Vector3(this.mesh.position.x, startY, this.mesh.position.z)
            const distance = Vector3.Distance(baseFlagPos, mesh.position)
            console.log(distance)

            if (distance <= radius) {
                this.mesh.position.y = flagStartY + (Math.cos((Math.PI * distance) / (2 * radius)) * 15)
            }
        })
    }
}
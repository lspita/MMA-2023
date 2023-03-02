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

        this.pole = MeshBuilder.CreateCylinder(name + "Pole", { diameter: tile.wallSize * 0.3, height: tile.groundSize * 0.5 })
        this.pole.material = Utils.createMaterial(Flag.material, () => {
            Flag.material = new StandardMaterial("poleMat")
            Flag.material.diffuseColor = new Color3(130 / 255, 135 / 255, 136 / 255)
            return Flag.material
        })

        this.cloth = this.createFlag(tile)
        this.cloth.parent = this.pole
        this.cloth.position.y = (tile.groundSize / 4) - tile.groundSize / 15
        this.cloth.rotation.y = Math.PI / 2

        this.groundPortion = MeshBuilder.CreateCylinder(name + "Ground", { diameter: 5, height: 1 })
        this.groundPortion.parent = this.pole
        this.groundPortion.position.y = -(tile.groundSize / 4)
        this.groundPortion.material = Tile.wallMat

        this.pole.position.y = -tile.wallSize * 4
        this.pole.rotation.y = Math.PI / 2

        this.mesh = this.pole
    }

    private createFlag(tile: Tile) {
        let flag1 = MeshBuilder.CreateBox('f1', { height: tile.wallSize * 3.5, width: tile.wallSize * 1.75, depth: tile.wallSize * 0.43 })
        let flag3 = MeshBuilder.CreateBox('f3', { height: tile.wallSize * 3.5, width: tile.wallSize * 1.75, depth: tile.wallSize * 0.43 })
        let flag2 = MeshBuilder.CreateBox('f2', { height: tile.wallSize * 3.5, width: tile.wallSize * 1.75, depth: tile.wallSize * 0.43 })

        Utils.createMaterial(Flag.clothMat, () => {
            Flag.clothMat = new StandardMaterial("clothMat")
            Flag.clothMat.diffuseColor = Color3.Red()
            return Flag.clothMat
        })

        flag1.material = Flag.clothMat
        flag2.material = Flag.clothMat
        flag3.material = Flag.clothMat

        let hinge0 = MeshBuilder.CreateCylinder('cyl0', { diameter: tile.wallSize * 0.35, height: tile.wallSize * 2.625 })
        let pern1 = new Mesh('f', State.scene)
        let pern2 = new Mesh('f', State.scene)
        hinge0.rotation.y = Math.PI / 2

        this.addFlag(flag1, hinge0, pern1, true, tile)
        this.addFlag(flag2, pern1, pern2, true, tile)
        this.addFlag(flag3, pern2, null, false, tile)

        State.scene.registerBeforeRender(() => {
            hinge0.rotation.y = Math.sin(State.time) / 4
            pern1.rotation.y = Math.cos(State.time) / 3
            pern2.rotation.y = Math.sin(State.time) / 2
        })

        return hinge0
    }

    private addFlag(flag: Mesh, pivot: Mesh, nextPivot: Mesh, addHinges: Boolean, tile: Tile) {
        flag.parent = pivot
        flag.position.x = tile.wallSize * 0.9
        if (nextPivot != null) {
            nextPivot.parent = flag
            nextPivot.position.x = tile.wallSize
        }

        if (addHinges) {
            let hinge1 = MeshBuilder.CreateCylinder('cyl1', { diameter: tile.wallSize * 0.35, height: tile.wallSize * 0.84 })
            let hinge2 = MeshBuilder.CreateCylinder('cyl2', { diameter: tile.wallSize * 0.35, height: tile.wallSize * 0.84 })

            hinge1.parent = flag
            hinge2.parent = flag

            hinge1.position.x = tile.wallSize
            hinge2.position.x = tile.wallSize
            hinge1.position.y = tile.wallSize
            hinge2.position.y = -tile.wallSize
        }
    }
    createHole(tile: Tile, height: number = 5) {
        const holemesh = MeshBuilder.CreateCylinder("", { diameter: 5, height: height + 1 })
        const endPos = new Vector3(
            this.mesh.position.x,
            -height / 2,
            this.mesh.position.z
        )
        holemesh.position = endPos
        holemesh.setEnabled(false)

        const tileCSG = CSG.FromMesh(tile.mesh)
        const holeCSG = CSG.FromMesh(holemesh)
        const subtraction = tileCSG.subtract(holeCSG)
        holemesh.dispose()
        const tileSubtract = subtraction.toMesh(tile.mesh.name, tile.mesh.material)
        const exMesh = tile.mesh
        tile.mesh = Utils.merge(tileSubtract, ...exMesh.getChildMeshes() as Mesh[])
        exMesh.dispose()
        return endPos
    }

    follow(mesh: Mesh, radius: number) {
        const startY = mesh.position.y
        const flagStartY = this.mesh.position.y
        const startRotY = this.mesh.rotation.y

        State.scene.registerBeforeRender(() => {
            const relativePos = mesh.position.subtract(this.mesh.position)
            this.mesh.addRotation(
                0,
                Math.atan2(-relativePos.z, relativePos.x) -
                this.mesh.absoluteRotationQuaternion.toEulerAngles().y +
                startRotY,
                0
            )
            const baseFlagPos = new Vector3(this.mesh.position.x, startY, this.mesh.position.z)
            const distance = Vector3.Distance(baseFlagPos, mesh.position)

            if (distance <= radius) {
                this.mesh.position.y = flagStartY + (Math.cos((Math.PI * distance) / (2 * radius)) * 15)
            }
        })
    }
}
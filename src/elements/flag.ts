import { Color3, CSG, Mesh, MeshBuilder, PhysicsImpostor, StandardMaterial, Vector3 } from "@babylonjs/core"
import BaseElement from "../core/elements/base"
import State from "../core/state"
import Tile from "../core/tileSystem/tile"
import Utils from "../core/utils"

export default class Flag extends BaseElement {
    //materials and meshes
    static clothMat: StandardMaterial
    private groundPortion: Mesh
    private pole: Mesh
    private cloth: Mesh
    holeDiameter: number

    constructor(name: string, tile: Tile, holeDiameter: number = 8) {
        super()
        // Create the pole
        this.pole = MeshBuilder.CreateCylinder(name + "Pole", { diameter: tile.wallSize * 0.3, height: tile.groundSize * 0.5 })
        this.pole.material = Utils.createMaterial(Flag.material, () => {
            Flag.material = new StandardMaterial("poleMat")
            Flag.material.diffuseColor = new Color3(130 / 255, 135 / 255, 136 / 255)
            return Flag.material
        })
        this.holeDiameter = holeDiameter

        // Create the flag
        this.cloth = this.createFlag(tile)
        this.cloth.parent = this.pole
        this.cloth.position.y = (tile.groundSize / 4) - tile.groundSize / 15
        this.cloth.rotation.y = Math.PI / 2

        // Create ground portion
        this.groundPortion = MeshBuilder.CreateCylinder(name + "Ground", { diameter: this.holeDiameter, height: 1 })
        this.groundPortion.parent = this.pole
        this.groundPortion.position.y = -(tile.groundSize / 4)
        this.groundPortion.material = Tile.wallMat

        this.pole.position.y = -tile.wallSize * 4
        this.pole.rotation.y = Math.PI / 2
        this.mesh = this.pole
    }

    private createFlag(tile: Tile) { // Create the different parts of the flag
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

        // Flag pivot
        let hinge = MeshBuilder.CreateCylinder('cyl0', { diameter: tile.wallSize * 0.35, height: tile.wallSize * 2.625 })
        let piv1 = new Mesh('f', State.scene)
        let piv2 = new Mesh('f', State.scene)
        hinge.rotation.y = Math.PI / 2

        this.addFlag(flag1, hinge, piv1, true, tile)
        this.addFlag(flag2, piv1, piv2, true, tile)
        this.addFlag(flag3, piv2, null, false, tile)

        // Flag movement
        State.scene.registerBeforeRender(() => {
            hinge.rotation.y = Math.sin(State.time) / 4
            piv1.rotation.y = Math.cos(State.time) / 3
            piv2.rotation.y = Math.sin(State.time) / 2
        })

        return hinge
    }

    private addFlag(flag: Mesh, pivot: Mesh, nextPivot: Mesh, addHinges: Boolean, tile: Tile) { // Connect the different parts of the flag
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
    createHole(tile: Tile, height: number = 5) { // Create hole in tile
        const holemesh = MeshBuilder.CreateCylinder("", { diameter: this.holeDiameter, height: height + 1 })
        const endPos = new Vector3(
            this.mesh.position.x,
            -height / 2,
            this.mesh.position.z
        )
        holemesh.position = endPos
        holemesh.setEnabled(false)

        const groundCSG = CSG.FromMesh(tile.ground)
        const holeCSG = CSG.FromMesh(holemesh)
        const subtraction = groundCSG.subtract(holeCSG)
        holemesh.dispose()

        // Mesh reassignement
        let name = tile.ground.name
        let pos = tile.ground.position
        let impostorParams = tile.impostorParams
        tile.ground.dispose()
        tile.ground = subtraction.toMesh(name, tile.ground.material)
        tile.ground.physicsImpostor = new PhysicsImpostor(tile.ground, PhysicsImpostor.MeshImpostor, impostorParams)
        tile.ground.parent = tile.mesh
        tile.ground.position = pos

        return endPos
    }

    follow(mesh: Mesh) { // Rotate flag to follow mesh
        const startY = mesh.position.y
        const flagStartY = this.mesh.position.y
        const startRotY = this.mesh.rotation.y
        const radius = this.holeDiameter * 3

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
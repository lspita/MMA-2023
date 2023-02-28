import { Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core"
import BaseElement from "../core/elements/base"
import Tile from "../core/tileSystem/tile"
import Utils from "../core/utils"

export default class Flag extends BaseElement {
    static clothMat: StandardMaterial
    groundPortion: any
    constructor(name: string, tile: Tile) {
        super()
        this.createMaterial(Flag.material, () => {
            Flag.material = new StandardMaterial("poleMat")
            Flag.material.diffuseColor = new Color3(130 / 255, 135 / 255, 136 / 255)
            Flag.clothMat = new StandardMaterial("clothMat")
            Flag.clothMat.diffuseColor = Color3.Red()
            return Flag.material
        })
        const pole = MeshBuilder.CreateCylinder(name + "Pole", { diameter: tile.wallSize * 0.3, height: tile.groundSize })
        pole.material = Flag.material
        const cloth = MeshBuilder.CreateBox(name + "CLoth", { height: tile.groundSize / 10, width: tile.groundSize / 6, depth: tile.wallSize * 0.2 })
        cloth.parent = pole
        cloth.position.y = (tile.groundSize / 2) - tile.groundSize / 19
        cloth.position.x = tile.groundSize / 12
        cloth.material = Flag.clothMat

        this.groundPortion = MeshBuilder.CreateCylinder(name + "GroundPortion", { diameter: 4, height: 5 })
        this.groundPortion.material = Tile.material
        this.groundPortion.parent = pole
        this.groundPortion.position.y = -(tile.groundSize / 2)
        pole.position.y = -5

        this.mesh = Utils.mergeWithCollisions(pole, cloth, this.groundPortion)
    }
}
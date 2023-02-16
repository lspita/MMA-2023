import { Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core"
import BaseElement from "../core/elements/base"

export default class Ball extends BaseElement {
    constructor(name: string) {
        super(name)
        this.mesh = MeshBuilder.CreateSphere(name, { diameter: 0.5 })
        this.createMaterial(Ball.material, () => {
            Ball.material = new StandardMaterial("ballMat")
            Ball.material.diffuseColor = Color3.White()
        })
    }
}
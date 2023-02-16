import { Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core"
import BaseElement from "../core/elements/base"

export default class Ball extends BaseElement {
    constructor(name: string, size = 0.75) {
        super(name)
        this.mesh = MeshBuilder.CreateSphere(name, { diameter: size })
        this.createMaterial(Ball.material, () => {
            Ball.material = new StandardMaterial("ballMat")
            Ball.material.diffuseColor = Color3.White()
        })
    }
}
import { Color3, MeshBuilder, PhysicsImpostor, StandardMaterial } from "@babylonjs/core"
import BaseElement from "../core/elements/base"

export default class Ball extends BaseElement {
    constructor(name: string, size = 0.75) {
        super()
        // this.mesh = MeshBuilder.CreateSphere(name, { diameter: size })
        this.mesh = MeshBuilder.CreateIcoSphere(name, { radius: size / 2 })
        this.createMaterial(Ball.material, () => {
            Ball.material = new StandardMaterial("ballMat")
            Ball.material.diffuseColor = Color3.White()
            return Ball.material
        })
        this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.SphereImpostor, { mass: 1 })
    }
}
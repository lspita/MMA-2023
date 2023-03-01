import { Color3, MeshBuilder, PhysicsImpostor, StandardMaterial } from "@babylonjs/core"
import BaseElement from "../core/elements/base"

export default class Ball extends BaseElement {
    constructor(name: string, size: number = 1.5) {
        super()
        // this.mesh = MeshBuilder.CreateSphere(name, { diameter: size })
        this.mesh = MeshBuilder.CreateIcoSphere(name, { radius: size, subdivisions: 3 })
        this.createMaterial(Ball.material, () => {
            Ball.material = new StandardMaterial("ballMat")
            Ball.material.diffuseColor = Color3.White()
            return Ball.material
        })
        this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.SphereImpostor, { mass: 15 })
        this.mesh.physicsImpostor.physicsBody.linearDamping = 0.6
        this.mesh.physicsImpostor.physicsBody.angularDamping = 0.6
    }
}
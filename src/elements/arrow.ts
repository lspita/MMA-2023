import { Color3, StandardMaterial, Vector3 } from "@babylonjs/core"
import { MeshBuilder } from "@babylonjs/core"
import BaseElement from "../core/elements/base"
import State from "../core/state"
import Utils from "../core/utils"

export default class Arrow extends BaseElement {
    Pivot: Vector3
    private currentFunction: () => void
    direction: Vector3
    force: number

    constructor(name: string, pivotPosition: Vector3) {
        super()
        this.Pivot = pivotPosition
        this.currentFunction = this.scale.bind(this)

        this.mesh = MeshBuilder.CreatePolyhedron(name, {
            sizeX: 5,
            sizeY: 2,
            sizeZ: 3,
            custom: {
                "vertex": [
                    [-0.5, 0, -0.5], [0, 0, 1], [0.5, 0, -0.5],
                    [-0.5, 1, -0.5], [0, 1, 1], [0.5, 1, -0.5]
                ],
                "face": [
                    [0, 1, 2], [3, 4, 5],
                    [0, 1, 4, 3], [1, 2, 5, 4],
                    [2, 0, 3, 5]
                ]
            }
        })

        this.mesh.material = Utils.createMaterial(Arrow.material, () => {
            Arrow.material = new StandardMaterial("arrowMat")
            Arrow.material.diffuseColor = Color3.Yellow()
            return Arrow.material
        })

        this.mesh.position.z = 5
        State.scene.registerBeforeRender(this.currentFunction)
    }

    spin() {
        this.mesh.rotateAround(this.Pivot, Vector3.Up(), State.deltaTime * 1.5)
    }
    private lastValue: number = 0
    scale() {
        this.force = Math.sin(State.time)
        this.mesh.translate(Vector3.Forward(), this.force - this.lastValue)
        this.lastValue = this.force
    }
}
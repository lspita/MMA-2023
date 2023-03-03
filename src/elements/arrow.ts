import { Color3, StandardMaterial, Vector3 } from "@babylonjs/core"
import { MeshBuilder } from "@babylonjs/core"
import BaseElement from "../core/elements/base"
import State from "../core/state"
import Utils from "../core/utils"

export default class Arrow extends BaseElement {
    pivot: Vector3
    private currentFunction: () => void
    direction: Vector3
    force: number
    maxForce: number
    onThrow: (direction: Vector3) => void

    constructor(name: string, pivotPosition: Vector3, onThrow: (direction: Vector3) => void, maxForce = 10) {
        super()
        this.pivot = pivotPosition
        this.maxForce = maxForce
        this.currentFunction = this.spin.bind(this)
        this.onThrow = onThrow

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

        this.mesh.position = new Vector3(
            this.pivot.x,
            this.pivot.y,
            this.pivot.z + 5
        )
        this.mesh.registerBeforeRender(this.currentFunction)
    }

    spin() {
        this.mesh.rotateAround(this.pivot, Vector3.Up(), State.deltaTime * 1.5)
        this.direction = this.mesh.position.subtract(this.pivot)
        if (State.keys[" "]) {
            this.mesh.unregisterBeforeRender(this.currentFunction)
            this.currentFunction = this.scale.bind(this)
            State.keys[" "] = false
            this.mesh.registerBeforeRender(this.currentFunction)
        }
    }

    private lastValue: number = 0
    scale() {
        this.force = Math.abs(Math.sin(State.time * 2) * 10)

        this.mesh.translate(Vector3.Forward(), this.force - this.lastValue)
        this.lastValue = this.force

        if (State.keys[" "]) {
            this.mesh.unregisterBeforeRender(this.currentFunction)
            this.mesh.dispose()
            this.onThrow(this.direction.scale(this.force * this.maxForce))
        }
    }
}
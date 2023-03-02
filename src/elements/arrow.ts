import { Color3, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Mesh, MeshBuilder } from "@babylonjs/core";
import { Axis } from "babylonjs";
import { textChangeRangeIsUnchanged } from "typescript";
import BaseElement from "../core/elements/base";
import State from "../core/state";
import Utils from "../core/utils";

export default class Arrow extends BaseElement {
    Pivot: Vector3
    private BoundedSpin: () => void

    constructor(name: string, pivotPosition: Vector3) {
        super()
        this.Pivot = pivotPosition
        this.BoundedSpin = this.spin.bind(this)

        this.mesh = MeshBuilder.CreatePolyhedron(`arrow`, {
            sizeX: 5,
            sizeY: 2,
            sizeZ: 3,
            custom: {
                "vertex": [
                    [1, 0, -1], [1, 0, 1], [-1, 0, 0],
                    [1, 1, -1], [1, 1, 1], [-1, 1, 0]
                ],
                "face": [
                    [0, 1, 2], [3, 5, 4],
                    [0, 3, 4, 1], [1, 4, 5, 2],
                    [2, 5, 3, 0]
                ]
            }
        })

        this.mesh.material = Utils.createMaterial(Arrow.material, () => {
            Arrow.material = new StandardMaterial("arrowMat")
            Arrow.material.diffuseColor = Color3.Yellow()
            return Arrow.material
        })
        
        this.mesh.translate(Vector3.Left(), 10)
        State.scene.registerBeforeRender(this.BoundedSpin)
    }

    spin() {
        this.mesh.rotateAround(this.Pivot, Vector3.Up(), State.deltaTime * 1.5)
    }
}
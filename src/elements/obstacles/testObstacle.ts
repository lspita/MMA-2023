import { MeshBuilder } from "@babylonjs/core"
import State from "../../core/state"

export default function TestObstacle(name: string, size: number) {
    const box = MeshBuilder.CreateBox(name, { size: size })
    const box2 = MeshBuilder.CreateBox(name, { height: 1, width: size + 1, depth: size + 1 })
    box.addChild(box2)
    box2.position.y = size / 2

    State.scene.registerBeforeRender(() => {
        box2.rotation.y += 5 * State.deltaTime
    })
    return box
}
import { ArcRotateCamera, Engine, Scene } from "@babylonjs/core"

export default class State { // Shared objects between elements
    static scene: Scene
    static engine: Engine
    static camera: ArcRotateCamera
    static deltaTime: number
    static time: number
    static keys: { [x: string]: boolean } = {}
}
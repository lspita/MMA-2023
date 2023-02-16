import { ArcRotateCamera, Engine, Scene } from "@babylonjs/core"

class State {
    static scene: Scene
    static engine: Engine
    static camera: ArcRotateCamera
    static deltaTime: number
}

export default State
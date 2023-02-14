import { Camera, Engine, Light, Scene } from "@babylonjs/core"

class State {
    static scene: Scene
    static engine: Engine
    static camera: Camera
    static light: Light
    static deltaTime: number
}

export default State
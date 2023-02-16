import { ArcRotateCamera, Engine, Scene } from "@babylonjs/core"

class State {
    static scene: Scene
    static engine: Engine
    static camera: ArcRotateCamera
    static time: number
    static keys: {[x: string]: boolean} = {}
}

export default State
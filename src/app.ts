import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core"
import State from "./state"

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas")
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.id = "gameCanvas"
        document.body.appendChild(canvas)

        // initialize babylon scene and engine
        const engine = new Engine(canvas, true)
        State.scene = new Scene(engine)

        const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), State.scene)
        camera.attachControl(canvas, true)
        const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), State.scene)
        const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, State.scene)

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            if (ev.key === 'i') {
                if (State.scene.debugLayer.isVisible()) {
                    State.scene.debugLayer.hide()
                } else {
                    State.scene.debugLayer.show()
                }
            }
        })

        // run the main render loop
        engine.runRenderLoop(() => {
            State.scene.render()
        })
    }
}
new App()
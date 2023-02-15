import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import { Engine, Scene, ArcRotateCamera, Vector3, Color3, DirectionalLight } from "@babylonjs/core"
import State from "./core/state"
import Ball from "./elements/ball"
import createGrid from "./core/debug"
import TileGenerator from "./core/tiles/tilegenerator"

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas")
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.id = "gameCanvas"
        document.body.appendChild(canvas)

        // initialize babylon scene, engine and camera
        State.engine = new Engine(canvas, true)
        State.scene = new Scene(State.engine)

        State.camera = new ArcRotateCamera(
            'cam',
            -Math.PI / 4, 0.75,
            50,
            Vector3.Zero(),
            State.scene, true
        )
        State.camera.attachControl(canvas, true)
        State.light = new DirectionalLight("light", new Vector3(0, 0, 1), State.scene)
        State.light.parent = State.camera

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
        window.addEventListener("resize", _ => {
            State.engine.resize(true)
        })
        // run the main render loop
        State.scene.registerBeforeRender(() => {
            State.deltaTime = performance.now() * 0.001
        })

        const tileGenerator = new TileGenerator(5)
        tileGenerator.startGeneration()

        const ball = new Ball("golfball")
        ball.mesh.position.y = 5
        ball.render()

        // createGrid(State.scene, 200)
        State.scene.createDefaultEnvironment({
            skyboxColor: Color3.Teal(),
        })
        State.engine.runRenderLoop(() => {
            State.scene.render()
        })
    }
}

new App()
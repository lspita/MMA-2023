import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import { Engine, Scene, ArcRotateCamera, Vector3, PointLight } from "@babylonjs/core"
import State from "./core/state"
import Ball from "./elements/ball"
import createGrid from "./core/debug"
import Tile from "./core/tiles/tile"

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
            -Math.PI / 2, 0.7,
            30,
            Vector3.Zero(),
            State.scene, true
        )
        State.camera.attachControl(canvas, true)
        State.light = new PointLight("light", Vector3.Up(), State.scene)
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

        const ball = new Ball("golfball")
        ball.mesh.position.y = 5
        ball.render()

        let distance = 8

        const tile = new Tile("testtile")
        tile.destroyWall("north")
        tile.render()

        const tile2 = new Tile("testtile2")
        tile2.destroyWall("south")
        tile2.destroyWall("east")
        tile2.mesh.position.z = distance
        tile2.render()

        const tile3 = new Tile("testtile3")
        tile3.destroyWall("west")
        tile3.mesh.position.z = distance
        tile3.mesh.position.x = distance
        tile3.render()

        createGrid(State.scene, 20)

        State.engine.runRenderLoop(() => {
            State.scene.render()
        })
    }
}

new App()
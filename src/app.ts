import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import { Engine, Scene, ArcRotateCamera, Vector3, Color3, DirectionalLight, KeyboardEventTypes, Scalar, PhysicsImpostor, KeyboardInfo } from "@babylonjs/core"
import State from "./core/state"
import Ball from "./elements/ball"
import { CannonJSPlugin } from "@babylonjs/core"
import createGrid from "./core/debug"
import LevelGenerator from "./core/tileSystem/levelGenerator"
import * as CANNON from "cannon"

function startGame() {

    // Create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.id = "gameCanvas"
    document.body.appendChild(canvas)

    // Initialize babylon scene, engine and camera
    State.engine = new Engine(canvas, true)
    State.scene = new Scene(State.engine)

    const gravityVector = new Vector3(0, -9.81 * 4, 0)

    State.scene.enablePhysics(gravityVector, new CannonJSPlugin(true, 10, CANNON))
    State.camera = new ArcRotateCamera(
        'cam',
        -Math.PI / 4, // Alpha
        0.75, // Beta
        100,
        Vector3.Zero(),
        State.scene, true
    )

    State.camera.upperRadiusLimit = State.camera.radius
    State.camera.lowerRadiusLimit = State.camera.radius / 2

    let lastKey: string
    State.scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                State.keys[kbInfo.event.key] = true
                break
            case KeyboardEventTypes.KEYUP:
                State.keys[kbInfo.event.key] = false
                break
        }

        lastKey = kbInfo.event.key
    })

    const light = new DirectionalLight("light", new Vector3(0, 0, 1), State.scene)
    const light2 = new DirectionalLight("light2", new Vector3(0, 0, -1), State.scene)
    light.parent = State.camera
    light2.parent = State.camera

    // Hide/show the Inspector
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

    // Get delta time and time
    let lastTime = 0
    State.scene.registerBeforeRender(() => {
        State.time = performance.now() * 0.001
        State.deltaTime = State.time - lastTime
        lastTime = State.time
    })

    // Camera movement
    let cameraSpeedY: number = 0.0
    let cameraSpeedX: number = 0.0
    State.scene.registerBeforeRender(() => {
        if (State.keys["ArrowDown"])
            cameraSpeedY = Math.min(1, cameraSpeedY + 0.05)
        else if (State.keys["ArrowUp"])
            cameraSpeedY = Math.max(-1, cameraSpeedY - 0.05)
        else cameraSpeedY = 0

        if (State.keys["ArrowRight"])
            cameraSpeedX = Math.min(1, cameraSpeedX + 0.05)
        else if (State.keys["ArrowLeft"])
            cameraSpeedX = Math.max(-1, cameraSpeedX - 0.05)
        else cameraSpeedX = 0

        State.camera.beta += cameraSpeedY * State.deltaTime
        State.camera.beta = Scalar.Clamp(State.camera.beta, Math.PI / 8, Math.PI / 2.42)

        State.camera.alpha += cameraSpeedX * 2 * State.deltaTime
    })

    const levelGenerator = new LevelGenerator(3, 100, 50)
    levelGenerator.createLevel()


    const ball = new Ball("golfball")
    ball.mesh.position.y = 5

    State.scene.registerBeforeRender(() => {

    })

    let throwForce = 500
    State.scene.onKeyboardObservable.add(() => {
        const position = ball.mesh.getAbsolutePosition()
        if (State.keys["w"]) {
            ball.mesh.physicsImpostor.applyImpulse(new Vector3(0, 0, throwForce), position)
        }
        if (State.keys["s"]) {
            ball.mesh.physicsImpostor.applyImpulse(new Vector3(0, 0, -throwForce), position)
        }
        if (State.keys["a"]) {
            ball.mesh.physicsImpostor.applyImpulse(new Vector3(-throwForce, 0, 0), position)
        }
        if (State.keys["d"]) {
            ball.mesh.physicsImpostor.applyImpulse(new Vector3(throwForce, 0, 0), position)
        }
        if (State.keys[" "]) {
            ball.mesh.physicsImpostor.applyImpulse(new Vector3(throwForce, 0, 0), position)
        }
    })

    /*
    ⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⠏⠀⢠⣦⡀⣤⣠⡄⢠⠦⡄⣠⠤⠀⣤⠀⡆⣤⣶⡀⠀⠈⠻⣿
    ⣿⣿⣿⣿⣿⣿⠀⠀⠟⠻⠃⠏⠉⠇⠸⠶⠋⠻⠾⠇⠙⠒⠃⠘⠾⠃⠀⠀⢀⣿
    ⣿⣿⣿⣿⣿⣿⣷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣴⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠷⣶⣶⣶⣶⣶⡆⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⠟⠉⠀⠀⠒⠀⠀⠀⠀⠉⢻⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⠀⠀⠀⠦⣀⣶⡶⠀⢤⣠⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣷⣤⣀⡲⠶⣶⣤⣔⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⠿⠿⠃⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⠏⢀⠤⠄⠀⠀⢀⡈⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⡟⠀⠸⠦⣠⠘⠁⢨⠃⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⠃⠀⠑⠤⠤⠔⠚⢥⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⡿⠀⠀⠀⣀⣀⡀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⡇⠀⠀⣰⣿⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣧⣀⡀⠉⣻⣿⣧⣤⣤⣤⣤⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    */

    createGrid(State.scene, 200)
    State.scene.createDefaultEnvironment({
        skyboxColor: Color3.Teal(),
    })
    canvas.focus()
    State.engine.runRenderLoop(() => {
        State.scene.render()
    })
}


startGame()
import "@babylonjs/loaders"
import { Engine, Scene, ArcRotateCamera, Vector3, Color3, DirectionalLight, KeyboardEventTypes, Scalar, MeshBuilder, Mesh } from "@babylonjs/core"
import State from "./core/state"
import { CannonJSPlugin } from "@babylonjs/core"
import LevelGenerator from "./core/tileSystem/levelGenerator"
import * as CANNON from "cannon"
import Tree from "./elements/tree"
import { Color4 } from "@babylonjs/core/Maths/math.color"
import ThrowIndicator from "./elements/throwIndicator"

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement
const messageHeading = document.getElementById("message") as HTMLHeadElement
const menu = document.getElementById("menu") as HTMLDivElement
const controls = document.getElementById("controls") as HTMLDivElement

function startGame(tilesNumber: number, wigglines: number, tileSize: number) {
    // Show controls tip from html
    controls.style.visibility = "visible"

    // Get delta time and time
    let lastTime = 0
    State.scene.registerBeforeRender(() => {
        State.time = performance.now() * 0.001
        State.deltaTime = State.time - lastTime
        lastTime = State.time
    })

    // Dispose of the previous meshes
    State.scene.meshes.forEach(mesh => mesh.dispose())

    // Save pressed keys
    State.scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                State.keys[kbInfo.event.key] = true
                break
            case KeyboardEventTypes.KEYUP:
                State.keys[kbInfo.event.key] = false
                break
        }
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

    // Enable physics
    const gravityVector = new Vector3(0, -9.81, 0).scale(3)
    State.scene.enablePhysics(gravityVector, new CannonJSPlugin(true, 10, CANNON))

    // Level creation
    const levelGenerator = new LevelGenerator(tilesNumber, wigglines, tileSize)
    const { ball, endPos, holeDiameter } = levelGenerator.createLevel()

    // Ball logic
    let checkpoint = ball.mesh.position
    let ballCenter: Vector3 = checkpoint
    const velocityMargin = 0.5
    const lowerHeightLimit = -3
    const holeRange = (holeDiameter / 2) + 1
    let throwIndicator: ThrowIndicator = null
    let throwMeshSpawned = false

    function ballLogic() {
        // Camera follow
        ballCenter = ball.mesh.physicsImpostor.getObjectCenter()
        State.camera.lockedTarget = ballCenter

        // Ball position check for out-of-bounds and victory control
        if (ballCenter.y <= lowerHeightLimit) {
            if (ballCenter.x < endPos.x + holeRange &&
                ballCenter.x > endPos.x - holeRange &&
                ballCenter.z < endPos.z + holeRange &&
                ballCenter.z > endPos.z - holeRange) {
                // Victory logic
                State.scene.unregisterBeforeRender(ballLogic)
                ball.mesh.dispose()
                messageHeading.style.visibility = "visible"
                messageHeading.classList.add("pulse")
                return
            }
            else {
                // Checkpoint return
                ball.mesh.position = checkpoint
                ball.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
                ball.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
                ball.mesh.physicsImpostor.setAngularVelocity(Vector3.Zero())
            }
        }

        // Throw indicator
        let linearVelocity = ball.mesh.physicsImpostor.getLinearVelocity().length()
        let angularVelocity = ball.mesh.physicsImpostor.getAngularVelocity().length()

        if (
            linearVelocity <= velocityMargin &&
            angularVelocity <= velocityMargin
        ) {
            if (throwIndicator == null) {
                checkpoint = ball.mesh.position
                ball.mesh.physicsImpostor.setLinearVelocity(Vector3.Zero())
                ball.mesh.physicsImpostor.setAngularVelocity(Vector3.Zero())
                throwIndicator = new ThrowIndicator("direction", ball.mesh, () => throwMeshSpawned = true, (direction) => {
                    ball.mesh.physicsImpostor.applyImpulse(direction, ballCenter)
                    controls.style.visibility = "collapse"
                }, 8)
            }
        }
        else if (throwMeshSpawned && throwIndicator != null) {
            throwIndicator.destroy()
            throwIndicator = null
            throwMeshSpawned = false
        }

    }
    State.scene.registerBeforeRender(ballLogic)

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

    // Final touchs
    State.scene.createDefaultEnvironment({
        skyboxColor: new Color3(State.scene.clearColor.r, State.scene.clearColor.g, State.scene.clearColor.b)
    })
    canvas.focus()
}

const startButton = (document.getElementById("start") as HTMLButtonElement)

// Value update in input's specific labels
document.querySelectorAll("#menu input").forEach((value) => {
    const element = value as HTMLInputElement
    let nextVal = window.localStorage.getItem(element.name)
    if (nextVal != undefined && nextVal != "" && nextVal != null) {
        element.value = nextVal
    }
    element.addEventListener("input", () => {
        window.localStorage.setItem(element.name, element.value)
    })
    document.querySelectorAll(`label[for=${element.name}]`).forEach(label => {
        const lbl = label as HTMLLabelElement
        const startText = lbl.innerHTML
        element.addEventListener("input", () => {
            lbl.innerText = startText + element.value
        })
        element.dispatchEvent(new Event("input"))
    })
})

// Babylon initialization
State.engine = new Engine(canvas, true)
State.scene = new Scene(State.engine)

State.camera = new ArcRotateCamera(
    'cam',
    -Math.PI / 2, // Alpha
    Math.PI / 2.5, // Beta
    100,
    Vector3.Zero(),
    State.scene, true
)

const light = new DirectionalLight("light", new Vector3(0, 0, 1), State.scene)
light.parent = State.camera
light.intensity = 3
window.addEventListener("resize", _ => {
    State.engine.resize(true)
})

// Tree mouse follow
const mousePos: { x: number, y: number } = {
    x: 0,
    y: 0
}

window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX
    mousePos.y = e.clientY
})

const pickPlane = MeshBuilder.CreatePlane("pickPlane", { height: canvas.height, width: canvas.width })
pickPlane.position.z = -10
pickPlane.isVisible = false
pickPlane.isPickable = true

function followMouse(mesh: Mesh) {
    const mousePosScene = State.scene.pick(mousePos.x, mousePos.y, (mesh) => mesh === pickPlane).pickedPoint
    mesh.lookAt(mousePosScene)
}

let followFunc: () => void
try {
    new Tree("wisetree", (element) => {
        element.mesh.position.y = 5
        element.mesh.scaling.scaleInPlace(3)
        followFunc = () => {
            followMouse(element.mesh)
        }
        State.scene.registerBeforeRender(followFunc)
        startButton.disabled = false
    })
} catch (error) {
    startButton.disabled = false
}

// Scene bg color
State.scene.clearColor = new Color4(2 / 255, 204 / 255, 254 / 255)

// Start game on click
startButton.onclick = () => {
    messageHeading.classList.remove("title")
    messageHeading.classList.add("victory")
    messageHeading.innerText = "VITTORIA"
    menu.remove()
    State.camera.beta = Math.PI / 4
    State.camera.alpha = -Math.PI / 4
    State.scene.unregisterBeforeRender(followFunc)
    light.intensity = 1.3

    const tilesNumber = parseInt(window.localStorage.getItem("tilesNumber"))
    const wigglines = tilesNumber / 100 * parseInt(window.localStorage.getItem("wiggliness"))
    const tileSize = parseInt(window.localStorage.getItem("tileSize"))

    startGame(tilesNumber, wigglines, tileSize)
}

// Menu scene start
State.engine.runRenderLoop(() => {
    State.scene.render()
})
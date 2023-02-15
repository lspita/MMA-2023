import { Mesh, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core"
import BaseElement from "./base"

const directions = ["east", "north", "west", "south"] as const
type Direction = typeof directions[number]

export default class Tile extends BaseElement {
    #floor: Mesh
    constructor(name: string, size = 10) {
        super(name)
        let boxSize = size - 2

        let groundMat = new StandardMaterial("groundMat")
        let groundTexture = new Texture(require("/assets/textures/tilefloor.png"))
        groundTexture.uScale = 2
        groundTexture.vScale = 2
        groundMat.diffuseTexture = groundTexture
        this.mesh.dispose()
        this.#floor = MeshBuilder.CreateBox(`${this.mesh.name}Floor`, { size: boxSize })
        this.#floor.material = groundMat
        this.mesh.addChild(this.#floor)

        let wallMat = new StandardMaterial("wallMat")
        wallMat.diffuseColor.set(139 / 255, 69 / 255, 19 / 255)

        for (let i = 0; i < 4; i++) {
            let wall = MeshBuilder.CreateBox(
                `${this.mesh.name}${directions[i]}Wall`,
                { width: 1, height: size, depth: size - 2 }
            )
            let angle = i * Math.PI / 2
            wall.rotation.y = angle
            wall.position.x = Math.cos(angle) * (boxSize + 1) / 2
            wall.position.z = Math.sin(angle) * (boxSize + 1) / 2
            wall.material = wallMat
            this.#floor.addChild(wall)
            let nextDir = directions[(i + 1 == directions.length ? 0 : i + 1)]
            let wallAngle = MeshBuilder.CreateBox(
                `${this.mesh.name}${directions[i]}${nextDir}WallAngle`,
                { width: 1, height: size, depth: 1 }
            )
            let edgeAngle = angle + (Math.PI / 4)
            wallAngle.position.x = Math.round(Math.cos(edgeAngle)) * (boxSize + 1) / 2
            wallAngle.position.z = Math.round(Math.sin(edgeAngle)) * (boxSize + 1) / 2
            wallAngle.material = wallMat
            this.#floor.addChild(wallAngle)
        }
    }

    destroyWall(direction: Direction) {
        this.#floor.getChildMeshes(true).forEach(mesh => {
            if (mesh.name.includes(direction)) {
                this.#floor.removeChild(mesh)
                mesh.dispose()
            }
        })
    }
}

export { Direction }
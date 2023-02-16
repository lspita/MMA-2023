import { MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core"
import BaseElement from "../elements/base"

type Direction = typeof Tile.directions[number]

export default class Tile extends BaseElement {
    static readonly directions = ["east", "north", "west", "south"] as const
    static wallMat: StandardMaterial = null

    readonly walls: { [x in Direction]: boolean } = {
        east: false,
        north: false,
        west: false,
        south: false,
    }
    x: number
    y: number

    #size: number

    constructor(name: string, size = 10) {
        super(name)
        this.#size = size
        this.createMaterial(Tile.material, () => {
            Tile.material = Tile.#generateGroundMat()
            Tile.wallMat = Tile.#generateWallMat()
        })

        this.mesh.dispose()
        this.mesh = MeshBuilder.CreateBox(name, { size: this.#size - 2 })
        this.mesh.material = Tile.material

        for (let i = 0; i < 4; i++) {
            this.createWall(Tile.directions[i])
        }
    }

    static #generateGroundMat() {
        let groundMat = new StandardMaterial("groundMat")
        let groundTexture = new Texture(require("/public/assets/textures/tilefloor.png"))
        groundTexture.uScale = 2
        groundTexture.vScale = 2
        groundMat.diffuseTexture = groundTexture
        return groundMat
    }

    static #generateWallMat() {
        let wallMat = new StandardMaterial("wallMat")
        wallMat.diffuseColor.set(165 / 255, 42 / 255, 42 / 255)
        return wallMat
    }

    destroyWall(direction: Direction) {
        this.mesh.getChildMeshes(true).forEach(mesh => {
            if (mesh.name.includes(direction)) {
                this.mesh.removeChild(mesh)
                mesh.dispose()
            }
        })
        this.walls[direction] = false
    }

    createWall(direction: Direction) {
        let i = Tile.directions.indexOf(direction)
        let wall = MeshBuilder.CreateBox(
            `${this.mesh.name}${direction}Wall`,
            { width: 1, height: this.#size, depth: this.#size - 2 }
        )
        let angle = i * Math.PI / 2
        wall.rotation.y = angle
        wall.position.x = Math.cos(angle) * (this.#size - 1) / 2
        wall.position.z = Math.sin(angle) * (this.#size - 1) / 2
        wall.material = Tile.wallMat
        this.mesh.addChild(wall)

        let nextDir = Tile.directions[(i + 1 === Tile.directions.length ? 0 : i + 1)]
        let wallAngle = MeshBuilder.CreateBox(
            `${this.mesh.name}${direction}${nextDir}WallAngle`,
            { width: 1, height: this.#size, depth: 1 }
        )
        let edgeAngle = angle + (Math.PI / 4)
        wallAngle.position.x = Math.round(Math.cos(edgeAngle)) * (this.#size - 1) / 2
        wallAngle.position.z = Math.round(Math.sin(edgeAngle)) * (this.#size - 1) / 2
        wallAngle.material = Tile.wallMat
        this.mesh.addChild(wallAngle)

        let prevDir = Tile.directions[(i - 1 === -1 ? Tile.directions.length - 1 : i - 1)]
        let prevWallAngle = MeshBuilder.CreateBox(
            `${this.mesh.name}${prevDir}${direction}WallAngle`,
            { width: 1, height: this.#size, depth: 1 }
        )

        let prevAngle = edgeAngle - (Math.PI / 2)
        prevWallAngle.position.x = Math.round(Math.cos(prevAngle)) * (this.#size - 1) / 2
        prevWallAngle.position.z = Math.round(Math.sin(prevAngle)) * (this.#size - 1) / 2
        prevWallAngle.material = Tile.wallMat
        this.mesh.addChild(prevWallAngle)

        this.walls[direction] = true
    }

    getDirections() {
        return Object.keys(this.walls).filter((value: Direction) => this.walls[value] === false) as Direction[]
    }
}

export { Direction }
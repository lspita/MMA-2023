import { Material, Mesh, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core"
import BaseElement from "../elements/base"

type Direction = typeof Tile.directions[number]

export default class Tile extends BaseElement {
    static readonly directions = ["east", "north", "west", "south"] as const
    readonly walls: { [x in Direction]: boolean } = {
        east: false,
        north: false,
        west: false,
        south: false,
    }
    #size: number

    static groundMat: StandardMaterial = null
    static wallMat: StandardMaterial = null

    constructor(name: string, size = 10) {
        super(name)
        this.#size = size
        if (Tile.groundMat === null) {
            Tile.#generateGroundMat()
        }
        if (Tile.wallMat === null) {
            Tile.#generateWallMat()
        }


        this.mesh.dispose()
        this.mesh = MeshBuilder.CreateBox(name, { size: this.#size - 2 })
        this.mesh.material = Tile.groundMat

        for (let i = 0; i < 4; i++) {
            this.createWall(Tile.directions[i])
        }
    }

    static #generateGroundMat() {
        Tile.groundMat = new StandardMaterial("groundMat")
        let groundTexture = new Texture(require("/assets/textures/tilefloor.png"))
        groundTexture.uScale = 2
        groundTexture.vScale = 2
        Tile.groundMat.diffuseTexture = groundTexture
    }

    static #generateWallMat() {
        Tile.wallMat = new StandardMaterial("wallMat")
        Tile.wallMat.diffuseColor.set(139 / 255, 69 / 255, 19 / 255)
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
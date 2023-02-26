import { MeshBuilder, StandardMaterial, Texture, Vector3 } from "@babylonjs/core"
import BaseElement from "../elements/base"

export type Direction = typeof Tile.directions[number]
export type DirInfo = {
    opposite: Direction
    coordinates: { x: number, y: number }
}
export const dirInfo: {
    [x in Direction]: DirInfo
} = {
    east: {
        opposite: "west",
        coordinates: { x: 1, y: 0 }
    },
    north: {
        opposite: "south",
        coordinates: { x: 0, y: 1 }
    },
    west: {
        opposite: "east",
        coordinates: { x: -1, y: 0 }
    },
    south: {
        opposite: "north",
        coordinates: { x: 0, y: -1 }
    }
}

export default class Tile extends BaseElement {
    static readonly directions = ["east", "north", "west", "south"] as const
    static wallMat: StandardMaterial = null
    private size: number
    hasObstacle: boolean = false

    public get groundSize(): number {
        return this.size - 2
    }


    constructor(name: string, size = 10) {
        super()
        this.size = size
        this.mesh = MeshBuilder.CreateBox(name, { size: this.groundSize })
        this.createMaterial(Tile.material, () => {
            Tile.material = Tile.generateGroundMat()
            Tile.wallMat = Tile.generateWallMat()
            return Tile.material
        })

        for (let i = 0; i < 4; i++) {
            this.createWall(Tile.directions[i])
        }
        this.mesh.position.y = -(this.groundSize) / 2
    }

    private static generateGroundMat() {
        let groundMat = new StandardMaterial("groundMat")
        let groundTexture = new Texture(require("/public/assets/textures/tilefloor.png"))
        groundTexture.uScale = 2
        groundTexture.vScale = 2
        groundMat.diffuseTexture = groundTexture
        return groundMat
    }

    private static generateWallMat() {
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
    }

    private createWall(direction: Direction) {
        let i = Tile.directions.indexOf(direction)
        let wall = MeshBuilder.CreateBox(
            `${this.mesh.name}${direction}Wall`,
            { width: 1, height: this.size, depth: this.groundSize }
        )
        let angle = i * Math.PI / 2
        wall.rotation.y = angle
        wall.position.x = Math.cos(angle) * (this.size - 1) / 2
        wall.position.z = Math.sin(angle) * (this.size - 1) / 2
        wall.material = Tile.wallMat
        this.mesh.addChild(wall)

        let nextDir = Tile.directions[(i + 1 === Tile.directions.length ? 0 : i + 1)]
        this.createWallAngle(direction, nextDir, angle + (Math.PI / 4))

        let prevDir = Tile.directions[(i - 1 === -1 ? Tile.directions.length - 1 : i - 1)]
        this.createWallAngle(prevDir, direction, angle - (Math.PI / 4))
    }

    private createWallAngle(dir1: Direction, dir2: Direction, edgeAngle: number) {
        let wallAngle = MeshBuilder.CreateBox(
            `${this.mesh.name}${dir1}${dir2}WallAngle`,
            { width: 1, height: this.size, depth: 1 }
        )
        let coordinates = {
            x: Math.cos(edgeAngle),
            y: Math.sin(edgeAngle)
        }
        wallAngle.position.x = Math.round(coordinates.x) * (this.size - 1) / 2
        wallAngle.position.z = Math.round(coordinates.y) * (this.size - 1) / 2
        wallAngle.material = Tile.wallMat
        this.mesh.addChild(wallAngle)

        let diagonalSize = 2
        let wallDiagonal = MeshBuilder.CreatePolyhedron(`${dir1}${dir2}DiagonalAngle`, {
            sizeX: 2,
            sizeY: this.size / 2,
            sizeZ: 2,
            custom: {
                "vertex": [
                    [0, 1, -1], [0, 1, 1], [1, 1, 0],
                    [0, -1, -1], [0, -1, 1], [1, -1, 0]
                ],
                "face": [
                    [0, 1, 2], [3, 4, 5],
                    [0, 2, 5, 3],
                    [2, 1, 4, 5],
                    [1, 0, 3, 4]
                ]
            }
        })
        wallDiagonal.material = Tile.wallMat
        wallDiagonal.rotation.y = -edgeAngle
        wallAngle.addChild(wallDiagonal)
        wallDiagonal.position = new Vector3(-coordinates.x * diagonalSize, 0, -coordinates.y * diagonalSize)
    }
}
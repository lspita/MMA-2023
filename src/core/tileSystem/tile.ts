import { Mesh, MeshBuilder, PhysicsImpostor, PhysicsImpostorParameters, StandardMaterial, Texture, Vector3 } from "@babylonjs/core"
import BaseElement from "../elements/base"
import Utils from "../utils"

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
    public groundSize: number
    public wallSize: number
    ground: Mesh
    impostorParams: PhysicsImpostorParameters = { mass: 0, friction: 0.5, restitution: 0.5 }


    constructor(name: string, size = 10) {
        super()
        this.size = size
        this.groundSize = this.size - 3
        this.wallSize = this.size - this.groundSize

        this.mesh = new Mesh(name)
        this.mesh.physicsImpostor = new PhysicsImpostor(this.mesh, PhysicsImpostor.NoImpostor, this.impostorParams)
        this.ground = MeshBuilder.CreateBox(name + "ground", { width: this.groundSize, depth: this.groundSize, height: this.groundSize - this.wallSize })
        this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, this.impostorParams)
        this.ground.parent = this.mesh

        this.ground.material = Utils.createMaterial(Tile.material, () => {
            Tile.material = new StandardMaterial("groundMat")
            let groundTexture = new Texture(require("/public/assets/textures/tilefloor.png"))
            groundTexture.uScale = 2
            groundTexture.vScale = 2
            Tile.material.diffuseTexture = groundTexture
            return Tile.material
        })

        Utils.createMaterial(Tile.wallMat, () => {
            Tile.wallMat = new StandardMaterial("wallMat")
            Tile.wallMat.diffuseColor.set(165 / 255, 42 / 255, 42 / 255)
            return Tile.wallMat
        })

        for (let i = 0; i < 4; i++) {
            this.createWall(Tile.directions[i])
        }
        this.mesh.position.y = -(this.groundSize - this.wallSize) / 2
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
            { width: this.wallSize, height: this.size, depth: this.groundSize }
        )
        let angle = i * Math.PI / 2
        wall.rotation.y = angle
        wall.position.x = Math.cos(angle) * this.size / 2
        wall.position.z = Math.sin(angle) * this.size / 2
        wall.material = Tile.wallMat
        wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.BoxImpostor, this.impostorParams)
        wall.parent = this.mesh

        let nextDir = Tile.directions[(i + 1 === Tile.directions.length ? 0 : i + 1)]
        this.createWallAngle(direction, nextDir, angle + (Math.PI / 4))

        let prevDir = Tile.directions[(i - 1 === -1 ? Tile.directions.length - 1 : i - 1)]
        this.createWallAngle(prevDir, direction, angle - (Math.PI / 4))
    }

    private createWallAngle(dir1: Direction, dir2: Direction, edgeAngle: number) {
        let wallAngle = MeshBuilder.CreateBox(
            `${this.mesh.name}${dir1}${dir2}WallAngle`,
            { width: this.wallSize, height: this.size, depth: this.wallSize }
        )
        let coordinates = {
            x: Math.cos(edgeAngle),
            y: Math.sin(edgeAngle)
        }
        wallAngle.position.x = Math.round(coordinates.x) * this.size / 2
        wallAngle.position.z = Math.round(coordinates.y) * this.size / 2
        wallAngle.material = Tile.wallMat

        wallAngle.physicsImpostor = new PhysicsImpostor(wallAngle, PhysicsImpostor.NoImpostor, this.impostorParams)
        wallAngle.parent = this.mesh

        let diagonalSize = this.wallSize * 2.5
        let wallDiagonal = MeshBuilder.CreatePolyhedron(`${dir1}${dir2}DiagonalAngle`, {
            sizeX: diagonalSize,
            sizeY: this.size / 2,
            sizeZ: diagonalSize,
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

        wallDiagonal.physicsImpostor = new PhysicsImpostor(wallDiagonal, PhysicsImpostor.MeshImpostor, this.impostorParams)
        wallDiagonal.parent = wallAngle

        wallDiagonal.position = new Vector3(-coordinates.x * diagonalSize, 0, -coordinates.y * diagonalSize)
    }
}
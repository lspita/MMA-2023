import { Vector3 } from "@babylonjs/core"
import Tile, { Direction } from "./tile"

type TileFunction = (name: string, size: number) => Tile
type DirectionInfo = {
    [x in Direction]: {
        step: Vector3
        opposite: Direction
    }
}

const dirInfo: DirectionInfo = {
    north: {
        step: Vector3.Forward(),
        opposite: "south"
    },
    south: {
        step: Vector3.Backward(),
        opposite: "north"
    },
    east: {
        step: Vector3.Right(),
        opposite: "west"
    },
    west: {
        step: Vector3.Left(),
        opposite: "east"
    }
}


export default class TileGenerator {
    numberOfTiles: number
    tileSize: number
    step: number

    static readonly possibleFollowings: { [x in Direction]: TileFunction[] } = {
        east: [
            TileGenerator.StraightX,
            TileGenerator.WestSouth,
            TileGenerator.NorthWest
        ],
        north: [
            TileGenerator.StraightZ,
            TileGenerator.SouthEast,
            TileGenerator.WestSouth
        ],
        west: [
            TileGenerator.StraightX,
            TileGenerator.EastNorth,
            TileGenerator.SouthEast
        ],
        south: [
            TileGenerator.StraightZ,
            TileGenerator.NorthWest,
            TileGenerator.EastNorth
        ]
    }

    constructor(numberOfTiles: number, tileSize = 10) {
        this.numberOfTiles = numberOfTiles
        this.tileSize = tileSize
        this.step = tileSize - 2
    }

    startGeneration() {
        let directions: Direction[]
        let dir: Direction
        let tileFunc = TileGenerator.StartTile
        let prevTile = tileFunc("step0", this.tileSize)
        for (let i = 1; i <= this.numberOfTiles; i++) {
            let tile: Tile
            directions = prevTile.getDirections()
            dir = directions[Math.floor(Math.random() * directions.length)]
            if (i < this.numberOfTiles) {
                let ok = false
                do {
                    let followings = TileGenerator.possibleFollowings[dir]
                    tileFunc = followings[Math.floor(Math.random() * followings.length)]
                    tile = tileFunc(`step${i}${tileFunc.name}`, this.tileSize)
                } while (!ok)
            }
            else {
                tile = TileGenerator.EndTile(`step${i}`, this.tileSize, dirInfo[dir].opposite)
            }
            tile.walls[dirInfo[dir].opposite] = true
            prevTile.mesh.addChild(tile.mesh)
            tile.mesh.position = dirInfo[dir].step.scale(this.step)
            prevTile = tile
        }
    }

    static TileWithoutWalls(name: string, size: number, ...walls: Direction[]) {
        let tile = new Tile(name, size)
        walls.forEach(wall => tile.destroyWall(wall))
        return tile
    }

    static StartTile(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "north")
    }

    static EndTile(name: string, size: number, wall: Direction) {
        return TileGenerator.TileWithoutWalls(name, size, wall)
    }

    static StraightZ(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "north", "south")
    }

    static StraightX(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "west", "east")
    }

    static SouthEast(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "south", "east")
    }

    static EastNorth(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "east", "north")
    }

    static NorthWest(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "north", "west")
    }

    static WestSouth(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "west", "south")
    }
}
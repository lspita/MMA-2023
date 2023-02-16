import { Vector3 } from "@babylonjs/core"
import Tile, { Direction } from "./tile"

type TileFunction = (name: string, size: number) => Tile
type DirectionInfo = {
    [x in Direction]: {
        step: Vector3
        opposite: Direction
    }
}


export default class TileGenerator {
    numberOfTiles: number
    tileSize: number
    stepLenght: number
    map: boolean[][]

    // static readonly possibleFollowings: { [x in Direction]: TileFunction[] } = {
    //     east: [
    //         TileGenerator.StraightX,
    //         TileGenerator.SouthWest,
    //         TileGenerator.NorthWest
    //     ],
    //     north: [
    //         TileGenerator.StraightZ,
    //         TileGenerator.SouthEast,
    //         TileGenerator.SouthWest
    //     ],
    //     west: [
    //         TileGenerator.StraightX,
    //         TileGenerator.NorthEast,
    //         TileGenerator.SouthEast
    //     ],
    //     south: [
    //         TileGenerator.StraightZ,
    //         TileGenerator.NorthWest,
    //         TileGenerator.NorthEast
    //     ]
    // }

    // static readonly curveOpposite: { [x: string]: TileFunction } = {
    //     [TileGenerator.NorthEast.name]: TileGenerator.SouthWest,
    //     [TileGenerator.SouthWest.name]: TileGenerator.NorthEast,
    //     [TileGenerator.NorthWest.name]: TileGenerator.SouthEast,
    //     [TileGenerator.SouthEast.name]: TileGenerator.NorthWest
    // }

    static readonly dirInfo: DirectionInfo = {
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


    constructor(numberOfTiles: number, tileSize = 10) {
        this.numberOfTiles = numberOfTiles
        this.tileSize = tileSize
        this.stepLenght = tileSize - 2
        for (let i = 0; i < (this.numberOfTiles * 2) + 1; i++) {
            this.map.push(new Array((this.numberOfTiles * 2) + 1).fill(false))
        }
    }

    startGeneration() {
        // let directions: Direction[]
        // let dir: Direction
        // let tileFunc = TileGenerator.StartTile
        // let prevTile = tileFunc("step0", this.tileSize)
        // this.map[this.numberOfTiles][this.numberOfTiles] = true
        // prevTile.x = prevTile.y = 0
        // let tile: Tile = null
        // for (let i = 1; i <= this.numberOfTiles; i++) {
        //     // directions = prevTile.getDirections()
        //     dir = directions[Math.floor(Math.random() * directions.length)]
        //     let x: number, y: number
        //     do {
        //         let followings = TileGenerator.possibleFollowings[dir]
        //         tileFunc = i < this.numberOfTiles ?
        //             followings[Math.floor(Math.random() * followings.length)] :
        //             TileGenerator.EndTile

        //         x = prevTile.x + dirInfo[dir].step.x
        //         y = prevTile.y + dirInfo[dir].step.z
        //     } while (this.map[x][y])
        //     tile = tileFunc(`step${i}${tileFunc.name}`, this.tileSize)
        //     tile.x = x
        //     tile.y = y
        //     // tile.walls[dirInfo[dir].opposite] = true
        //     prevTile.mesh.addChild(tile.mesh)
        //     tile.mesh.position = dirInfo[dir].step.scale(this.stepLenght)
        //     prevTile = tile
        // }
        // tile.destroyWall(dirInfo[dir].opposite)

    }

    static TileWithoutWalls(name: string, size: number, ...walls: Direction[]) {
        let tile = new Tile(name, size)
        walls.forEach(wall => tile.destroyWall(wall))
        return tile
    }

    static StartTile(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "north")
    }

    static EndTile(name: string, size: number) {
        return new Tile(name, size)
    }

    static StraightZ(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "north", "south")
    }

    static StraightX(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "west", "east")
    }
    /** ╔ */
    static SouthEast(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "south", "east")
    }

    /** ╚ */
    static NorthEast(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "east", "north")
    }
    /** ╝ */
    static NorthWest(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "north", "west")
    }
    /** ╗ */
    static SouthWest(name: string, size: number) {
        return TileGenerator.TileWithoutWalls(name, size, "west", "south")
    }
}
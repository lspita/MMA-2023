import { Vector3 } from "@babylonjs/core"
import PathGenerator from "./pathGenerator"
import Tile, { Direction } from "./tile"

const oppositeDirection: { [x in Direction]: Direction } = {
    east: "west",
    north: "south",
    west: "east",
    south: "north"
}

export default class LevelGenerator {
    size: number
    tileSize: number
    private pathGenerator: PathGenerator

    constructor(radius: number, tileSize: number = 10) {
        this.size = radius
        this.tileSize = tileSize
        this.pathGenerator = new PathGenerator(radius)
    }

    createLevel() {
        const path = this.pathGenerator.generatePath()
        let lastTile: Tile = null
        const stepDistance = this.tileSize - 2
        let lastDirection: Direction
        path.forEach((step, i) => {
            const tile = new Tile(`step${i}`, this.tileSize)
            if (lastTile != null) {
                lastTile.mesh.addChild(tile.mesh)
                tile.mesh.position = new Vector3(
                    step.x * stepDistance,
                    0,
                    step.y * stepDistance
                )
                switch (step.x) {
                    case 1:
                        lastDirection = "east"
                        break
                    case -1:
                        lastDirection = "west"
                        break
                    default:
                        switch (step.y) {
                            case 1:
                                lastDirection = "north"
                                break
                            case -1:
                                lastDirection = "south"
                                break
                        }
                }

                tile.destroyWall(oppositeDirection[lastDirection])
                lastTile.destroyWall(lastDirection)
            }
            // alert(`x: ${step.x}, y: ${step.y}, dir: ${tile.direction}, opposite: ${oppositeDirection[lastTile?.direction]}`)
            lastTile = tile
        })
    }
}
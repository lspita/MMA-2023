import { Vector3 } from "@babylonjs/core"
import PathGenerator from "./pathGenerator"
import Tile, { Direction, dirInfo } from "./tile"

export default class LevelGenerator {
    tileSize: number

    private pathGenerator: PathGenerator

    constructor(radius: number, wiggliness: number = 10, tileSize: number = 10) {
        this.tileSize = tileSize
        this.pathGenerator = new PathGenerator(radius, wiggliness)
    }

    createLevel() {
        const path = this.pathGenerator.generatePath()
        let lastTile: Tile = null
        const stepDistance = this.tileSize - 2
        let stepDirection: Direction
        let lastStepDirection: Direction
        path.forEach((step, i) => {
            const tile = new Tile(`step${i}`, this.tileSize)
            if (lastTile != null) {
                lastTile.mesh.addChild(tile.mesh)
                tile.mesh.position = new Vector3(
                    step.x * stepDistance,
                    0,
                    step.y * stepDistance
                )
                const stepString = JSON.stringify(step)
                for (const [key, value] of Object.entries(dirInfo)) {
                    if (JSON.stringify(value.coordinates) == stepString) {
                        stepDirection = key as Direction
                        break
                    }
                }
                tile.destroyWall(dirInfo[stepDirection].opposite)
                lastTile.destroyWall(stepDirection)
                if (stepDirection == lastStepDirection) {
                    lastTile.straight = true
                }
            }
            // alert(`x: ${step.x}, y: ${step.y}, dir: ${tile.direction}, opposite: ${oppositeDirection[lastTile?.direction]}`)
            lastTile = tile
            lastStepDirection = stepDirection
        })
    }
}
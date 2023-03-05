import { Vector3 } from "@babylonjs/core"
import PathGenerator from "./pathGenerator"
import Tile, { Direction, dirInfo } from "./tile"
import Utils from "../utils"
import * as Obstacles from "../../elements/obstacles"
import Flag from "../../elements/flag"
import Ball from "../../elements/ball"

export default class LevelGenerator {
    tileSize: number
    private pathGenerator: PathGenerator
    static obstacles = Object.values(Obstacles)
    private radius: number

    constructor(radius: number, wiggliness: number, tileSize: number) {
        this.tileSize = tileSize
        this.radius = radius
        this.pathGenerator = new PathGenerator(radius, wiggliness)
    }

    createLevel() { // Create path and place tiles and obstacles
        const path = this.pathGenerator.generatePath()
        let lastTile: Tile = null
        let stepDirection: Direction = null
        let lastStepDirection: Direction = null
        let flag: Flag
        let ball: Ball = null
        let endPos: Vector3 = null
        let lastObstacle = 0

        for (let i = 0; i < this.radius; i++) { // Foreach step
            const step = path[i]
            // Create tile
            const tile = new Tile(`step${i}`, this.tileSize)
            if (lastTile != null) {
                // Position with step
                tile.mesh.position = new Vector3(
                    lastTile.mesh.position.x + (step.x * tile.groundSize),
                    lastTile.mesh.position.y,
                    lastTile.mesh.position.z + (step.y * tile.groundSize)
                )

                // Get step direction
                const stepString = JSON.stringify(step)
                for (const [key, value] of Object.entries(dirInfo)) {
                    if (JSON.stringify(value.coordinates) == stepString) {
                        stepDirection = key as Direction
                        break
                    }
                }

                // Destroy walls
                tile.destroyWall(dirInfo[stepDirection].opposite)
                lastTile.destroyWall(stepDirection)
            }

            if (i == this.radius - 1) {
                // Create flag and ball
                flag = new Flag("endFlag", tile)
                ball = new Ball("golfball")
                ball.mesh.position.y = tile.wallSize
                let box = flag.mesh.getBoundingInfo()
                flag.mesh.position = new Vector3(tile.mesh.position.x, flag.mesh.position.y + Math.abs(box.maximum.y - box.minimum.y) / 2, tile.mesh.position.z)
                endPos = flag.createHole(tile)
                flag.mesh.position.y += 10
                flag.follow(ball.mesh)
            }
            else {
                // Create obstacle in tile
                if (i >= 1 && i < this.radius - 1 && (Math.round(Math.random()) == 0 || i - lastObstacle > 2)) {
                    lastObstacle = i
                    let obstacle: Obstacles.Obstacle
                    if (stepDirection == lastStepDirection) {
                        // straight tile
                        obstacle = Utils.random(LevelGenerator.obstacles)
                    } else {
                        obstacle = Utils.random(LevelGenerator.obstacles.filter(o => o.onlyStraightTiles == false))
                    }
                    let obstacleMesh = obstacle.builder(`${tile.mesh.name}Obstacle`, tile)
                    const coordinates = dirInfo[stepDirection].coordinates

                    obstacleMesh.rotation.y += Math.atan2(coordinates.y, coordinates.x)
                    let box = obstacleMesh.getBoundingInfo()
                    obstacleMesh.position = new Vector3(tile.mesh.position.x, obstacleMesh.position.y + Math.abs(box.maximum.y - box.minimum.y) / 2, tile.mesh.position.z)
                }
            }

            lastTile = tile
            lastStepDirection = stepDirection
        }
        return {
            ball,
            endPos,
            holeDiameter: flag.holeDiameter
        }
    }
}
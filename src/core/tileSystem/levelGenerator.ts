import { Vector3, Mesh } from "@babylonjs/core"
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

    createLevel() {

        const path = this.pathGenerator.generatePath()
        let lastTile: Tile = null
        let stepDirection: Direction = null
        let lastStepDirection: Direction = null
        let lastObstacle = -1
        const rawTiles: Tile[] = []

        for (let i = 0; i < path.length && i < this.radius; i++) {
            const step = path[i]

            const tile = new Tile(`step${i}`, this.tileSize)
            if (lastTile != null) {
                tile.mesh.position = new Vector3(
                    lastTile.mesh.position.x + (step.x * tile.groundSize),
                    lastTile.mesh.position.y,
                    lastTile.mesh.position.z + (step.y * tile.groundSize)
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
            }

            lastTile = tile
            lastStepDirection = stepDirection
            rawTiles.push(lastTile)
        }
        let rawPos: Vector3
        let ball: Ball = null
        let endPos: Vector3 = null
        rawTiles.forEach((rawTile, i) => {
            rawPos = rawTile.mesh.position
            if (i == rawTiles.length - 1) {
                const flag = new Flag("endFlag", rawTile)
                ball = new Ball("golfball")
                ball.mesh.position.y = 5
                let box = flag.mesh.getBoundingInfo()
                flag.mesh.position = new Vector3(rawPos.x, flag.mesh.position.y + Math.abs(box.maximum.y - box.minimum.y) / 2, rawPos.z)
                endPos = flag.createHole(rawTile)
                flag.mesh.position.y += 10
                flag.follow(ball.mesh, 15)
            }
            else {
                rawTile.mesh = Utils.merge(rawTile.mesh, ...rawTile.mesh.getChildMeshes() as Mesh[])
                if (i >= 1 && i < this.radius - 1 && (i - lastObstacle) > 0 && Math.round(Math.random()) == 0) {
                    let obstacle: Obstacles.Obstacle
                    if (stepDirection == lastStepDirection) {
                        // straight tile
                        obstacle = Utils.random(LevelGenerator.obstacles)
                    } else {
                        obstacle = Utils.random(LevelGenerator.obstacles.filter(o => o.curve == true))
                    }
                    let obstacleMesh = obstacle.builder(`${rawTile.mesh.name}Obstacle`, rawTile)
                    let box = obstacleMesh.getBoundingInfo()

                    obstacleMesh.position = new Vector3(rawPos.x, obstacleMesh.position.y + Math.abs(box.maximum.y - box.minimum.y) / 2, rawPos.z)
                    lastObstacle = i
                }
            }
        })
        return {
            ball,
            endPos
        }
    }
}
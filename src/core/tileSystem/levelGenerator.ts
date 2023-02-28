import { Vector3, PhysicsImpostor, CSG, MeshBuilder, Mesh } from "@babylonjs/core"
import PathGenerator from "./pathGenerator"
import Tile, { Direction, dirInfo } from "./tile"
import State from "../state"
import Utils from "../utils"
import * as Obstacles from "../../elements/obstacles"
import Tree from "../../elements/tree"

export default class LevelGenerator {
    tileSize: number
    private pathGenerator: PathGenerator
    static obstacles = Object.values(Obstacles)
    private radius: number

    constructor(radius: number, wiggliness: number = 10, tileSize: number = 10) {
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
        rawTiles.forEach((rawTile, i) => {
            rawPos = rawTile.mesh.position
            rawTile.mesh = Utils.mergeWithCollisions(rawTile.mesh, ...rawTile.mesh.getChildMeshes() as Mesh[])
            if (i >= 1 && i < this.radius - 1 && (i - lastObstacle) > 0 && Math.round(Math.random() * 0) == 0) {
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
        })
        // new Tree("endtree", (element) => {
        //     element.mesh = Utils.mergeWithCollisions(element.mesh)
        //     element.mesh.position = new Vector3(rawPos.x, lastTile.groundSize / 2, rawPos.y)
        //     let coordinates = dirInfo[lastStepDirection].coordinates
        //     element.mesh.rotation.y = Math.atan2(coordinates.y, -coordinates.x)
        // })
    }
}
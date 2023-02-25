import { Vector3, PhysicsImpostor, CannonJSPlugin } from "@babylonjs/core"
import PathGenerator from "./pathGenerator"
import Tile, { Direction, dirInfo } from "./tile"
import State from "../state"
import CANNON from "cannon"
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

        let gravityVector = new Vector3(0, -9.81, 0)
        let physicsPlugin = new CannonJSPlugin(true, 10, CANNON)

        const path = this.pathGenerator.generatePath()
        let lastTile: Tile = null
        const stepDistance = this.tileSize - 2
        let stepDirection: Direction = null
        let lastStepDirection: Direction = null
        let lastObstacle = -1
        for (let i = 0; i < path.length && i < this.radius; i++) {
            const step = path[i]

            const tile = new Tile(`step${i}`, this.tileSize)
            State.scene.enablePhysics(gravityVector, physicsPlugin)
            tile.mesh.physicsImpostor = new PhysicsImpostor(tile.mesh, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, State.scene)
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

                if (i > 1 && i < this.radius && (i - lastObstacle) > 1 && Math.round(Math.random() * 2) == 1) {
                    let obstacle: Obstacles.Obstacle
                    if (stepDirection == lastStepDirection) {
                        // straight tile
                        obstacle = Utils.random(LevelGenerator.obstacles)
                    } else {
                        obstacle = Utils.random(LevelGenerator.obstacles.filter(o => o.curve == true))
                    }
                    const obstacleMesh = obstacle.builder(`${lastTile.mesh.name}Obstacle`, lastTile.groundSize)
                    lastTile.mesh.addChild(obstacleMesh)
                    let box = obstacleMesh.getBoundingInfo()
                    obstacleMesh.position = new Vector3(0, obstacleMesh.position.y + Math.abs(box.maximum.y - box.minimum.y) / 2, 0)
                    const mirrored = obstacle.builder(`${obstacleMesh.name}Mirror`, lastTile.groundSize)
                    lastTile.mesh.addChild(mirrored)
                    mirrored.rotation.x = Math.PI
                    mirrored.position = new Vector3(0, -obstacleMesh.position.y, 0)
                    lastObstacle = i

                }

            }

            lastTile = tile
            lastStepDirection = stepDirection
        }
        // path.forEach((step, i) => {
        //     const tile = new Tile(`step${i}`, this.tileSize)
        //     State.scene.enablePhysics(gravityVector, physicsPlugin)
        //     tile.mesh.physicsImpostor = new PhysicsImpostor(tile.mesh, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, State.scene)
        //     if (lastTile != null) {
        //         lastTile.mesh.addChild(tile.mesh)
        //         tile.mesh.position = new Vector3(
        //             step.x * stepDistance,
        //             0,
        //             step.y * stepDistance
        //         )
        //         const stepString = JSON.stringify(step)
        //         for (const [key, value] of Object.entries(dirInfo)) {
        //             if (JSON.stringify(value.coordinates) == stepString) {
        //                 stepDirection = key as Direction
        //                 break
        //             }
        //         }
        //         tile.destroyWall(dirInfo[stepDirection].opposite)
        //         lastTile.destroyWall(stepDirection)

        //         if (stepDirection == lastStepDirection) {
        //             straight tile
        //             if ((i - lastObstacle) > 1 && Math.round(Math.random() * 2) == 1) {
        //                 const obstacleFunction = Utils.random(LevelGenerator.obstacles)
        //                 const obstacle = obstacleFunction(`${lastTile.mesh.name}Obstacle`, lastTile.groundSize)
        //                 lastTile.mesh.addChild(obstacle)
        //                 let box = obstacle.getBoundingInfo()
        //                 obstacle.position = new Vector3(0, obstacle.position.y + Math.abs(box.maximum.y - box.minimum.y) / 2, 0)
        //                 const mirrored = obstacleFunction(`${obstacle.name}Mirror`, lastTile.groundSize)
        //                 lastTile.mesh.addChild(mirrored)
        //                 mirrored.rotation.x = Math.PI
        //                 mirrored.position = new Vector3(0, -obstacle.position.y, 0)
        //                 lastObstacle = i
        //             }
        //         }

        //     }

        //     lastTile = tile
        //     lastStepDirection = stepDirection
        // })
        new Tree("endtree", (element) => {
            lastTile.mesh.addChild(element.mesh)
            element.mesh.position = Vector3.Up().scale(lastTile.groundSize / 2)
            let coordinates = dirInfo[lastStepDirection].coordinates
            element.mesh.rotation.y = Math.atan2(coordinates.y, -coordinates.x)
        })
    }
}
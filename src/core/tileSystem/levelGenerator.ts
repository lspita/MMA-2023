import { Vector3, PhysicsImpostor, CannonJSPlugin } from "@babylonjs/core"
import PathGenerator from "./pathGenerator"
import Tile, { Direction, dirInfo } from "./tile"
import State from "../state"
import CANNON from "cannon"

export default class LevelGenerator {
    tileSize: number

    private pathGenerator: PathGenerator

    constructor(radius: number, wiggliness: number = 10, tileSize: number = 10) {
        this.tileSize = tileSize
        this.pathGenerator = new PathGenerator(radius, wiggliness)
    }

    createLevel() {

        let gravityVector = new Vector3(0,-9.81, 0);
        let physicsPlugin = new CannonJSPlugin(true, 10, CANNON);
        
        const path = this.pathGenerator.generatePath()
        let lastTile: Tile = null
        const stepDistance = this.tileSize - 2
        let stepDirection: Direction
        let lastStepDirection: Direction
        path.forEach((step, i) => {
            const tile = new Tile(`step${i}`, this.tileSize)
            State.scene.enablePhysics(gravityVector, physicsPlugin);
            tile.mesh.physicsImpostor = new PhysicsImpostor(tile.mesh, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, State.scene);
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
            lastTile = tile
            lastStepDirection = stepDirection
        })
    }
}
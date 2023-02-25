import { Mesh } from "@babylonjs/core"
import TestObstacle from "./testObstacle"

type Obstacle = (name: string, tileSize: number) => Mesh

const Obstacles: Obstacle[] = [
    TestObstacle
]

export default Obstacles
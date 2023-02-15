import { MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core"
import BaseElement from "./base"

const directions = ["east", "north", "south", "west"] as const
type Direction = typeof directions[number]

export default class Tile extends BaseElement {
    constructor(name: string, size = 10) {
        super(name)
        let boxSize = size - 2

        let groundMat = new StandardMaterial("groundMat")
        let groundTexture = new Texture(require("/assets/textures/tilefloor.png"))
        groundTexture.uScale = 2
        groundTexture.vScale = 2
        groundMat.diffuseTexture = groundTexture
        this.mesh.dispose()
        this.mesh = MeshBuilder.CreateBox(this.mesh.name, { size: boxSize })
        this.mesh.material = groundMat

        let wallMat = new StandardMaterial("wallMat")
        wallMat.diffuseColor.set(139 / 255, 69 / 255, 19 / 255)

        for (let i = 0; i < 4; i++) {
            let wall = MeshBuilder.CreateBox(
                `${this.mesh.name}${directions[i]}Wall`,
                { width: 1, height: 10, depth: 10 }
            )
            let angle = i * Math.PI / 2
            wall.rotation.y = angle
            wall.position.x = Math.cos(angle) * (boxSize + 1) / 2
            wall.position.z = Math.sin(angle) * (boxSize + 1) / 2
            wall.material = wallMat
            this.mesh.addChild(wall)
        }
    }

    destroyWall(wall: Direction) {
        this.mesh.getChildMeshes(true, (node) => node.name == `${this.mesh.name}${wall}Wall`).forEach(mesh => mesh.dispose())
    }
}

export { Direction }
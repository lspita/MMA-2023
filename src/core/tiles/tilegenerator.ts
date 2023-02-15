import Tile from "./tile"

export default class TileGenerator {
    numberOfTiles: number
    tileSize: number
    step: number
    #prevTile: Tile = null

    constructor(numberOfTiles: number, tileSize = 10) {
        this.numberOfTiles = numberOfTiles
        this.tileSize = tileSize
        this.step = tileSize - 2
    }

    startGeneration() {
        this.#prevTile = this.StartTile("step0")
        for (let i = 1; i <= this.numberOfTiles; i++) {
            let tile = this.StraightZ(`step${i}`)
            this.#prevTile.mesh.addChild(tile.mesh)
            tile.mesh.position.z = this.step
            this.#prevTile = tile
        }
    }

    StartTile(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("north")
        return tile
    }

    StraightZ(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("south")
        tile.destroyWall("north")
        return tile
    }

    StraightX(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("west")
        tile.destroyWall("east")
        return tile
    }

    SouthEast(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("south")
        tile.destroyWall("east")
        return tile
    }

    EastNorth(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("east")
        tile.destroyWall("north")
        return tile
    }

    NorthWest(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("north")
        tile.destroyWall("west")
        return tile
    }

    WestSouth(name: string) {
        let tile = new Tile(name, this.tileSize)
        tile.destroyWall("west")
        tile.destroyWall("south")
        return tile
    }
}
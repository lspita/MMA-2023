import PathGenerator from "./pathGenerator"

export default class LevelGenerator {
    size: number
    private pathGenerator: PathGenerator

    constructor(size: number) {
        this.size = size
        this.pathGenerator = new PathGenerator(size)
    }

    createLevel() {
        let path = this.pathGenerator.generatePath()
    }
}
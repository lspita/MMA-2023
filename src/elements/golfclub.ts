import ModelElement from "../core/elements/modelElement"

export default class GolfClub extends ModelElement {
    constructor(name: string, callback?: (element: ModelElement) => void) {
        super(name, "assets/golfclub/", "golfclub.glb", callback)
    }
}
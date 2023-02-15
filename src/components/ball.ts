import BaseComponent from "../core/base"
import ModelImporter from "../core/importer"
import State from "../core/state"

export default class Ball extends BaseComponent {
    constructor(name: string) {
        super(name)
        ModelImporter.fromObj(require("/assets/wisetree/wisetree.obj"), this.mesh)
    }
    render(): void {
        State.scene.registerBeforeRender(() => {
            this.mesh.rotation.x = State.deltaTime
        })
        super.render()
    }
}
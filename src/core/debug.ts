import { Color4, MeshBuilder, Scene, Vector3 } from "@babylonjs/core"

export default function createGrid(scene: Scene, size: number) {
    let m = 50
    let r = size
    let pts: Vector3[][] = []
    let colors: Color4[][] = []
    let c1 = new Color4(0.7, 0.7, 0.7, 0.5)
    let c2 = new Color4(0.5, 0.5, 0.5, 0.25)
    let cRed = new Color4(0.8, 0.1, 0.1)
    let cGreen = new Color4(0.1, 0.8, 0.1)
    let cBlue = new Color4(0.1, 0.1, 0.8)

    let color = c1
    function line(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
        pts.push([new Vector3(x0, y0, z0), new Vector3(x1, y1, z1)])
        colors.push([color, color])
    }

    for (let i = 0; i <= m; i++) {
        if (i * 2 == m) continue
        color = (i % 5) == 0 ? c1 : c2
        let x = -r + 2 * r * i / m
        line(x, 0, -r, x, 0, r)
        line(-r, 0, x, r, 0, x)
    }

    let r1 = r + 1
    let a1 = 0.2
    let a2 = 0.5

    // x axis
    color = cRed
    line(-r1, 0, 0, r1, 0, 0)
    line(r1, 0, 0, r1 - a2, 0, a1)
    line(r1, 0, 0, r1 - a2, 0, -a1)

    // z axis
    color = cBlue
    line(0, 0, -r1, 0, 0, r1)
    line(0, 0, r1, a1, 0, r1 - a2)
    line(0, 0, r1, -a1, 0, r1 - a2)

    // y axis
    color = cGreen
    line(0, -r1, 0, 0, r1, 0)
    line(0, r1, 0, a1, r1 - a2, 0)
    line(0, r1, 0, -a1, r1 - a2, 0)
    line(0, r1, 0, 0, r1 - a2, a1)
    line(0, r1, 0, 0, r1 - a2, -a1)

    const lines = MeshBuilder.CreateLineSystem(
        "lines", {
        lines: pts,
        colors: colors,

    },
        scene)
    return lines
}
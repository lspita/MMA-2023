enum CellState {
    Open,
    Blocked,
    Forced
}

class Cell {
    row: number
    col: number
    state: CellState
    constructor(row: number, col: number, state: CellState = CellState.Open) {
        this.row = row
        this.col = col
        this.state = state
    }
}

export default class PathGenerator {
    private size: number
    private matrix: Cell[][]
    private radius: number

    constructor(matrixRadius: number) {
        this.radius = matrixRadius
        this.size = (this.radius * 2 + 1)
    }

    private getNeighbours(cell: Cell): Cell[] {
        const neighbours: { row: number, col: number }[] = []
        if (cell.row > 0) neighbours.push({ row: cell.row - 1, col: cell.col })
        if (cell.row < this.size - 1) neighbours.push({ row: cell.row + 1, col: cell.col })
        if (cell.col > 0) neighbours.push({ row: cell.row, col: cell.col - 1 })
        if (cell.col < this.size - 1) neighbours.push({ row: cell.row, col: cell.col + 1 })
        return neighbours
            .filter(neighbour => this.matrix[neighbour.row][neighbour.col].state != CellState.Blocked)
            .map(neighbour => new Cell(neighbour.row, neighbour.col, this.matrix[neighbour.row][neighbour.col].state))
    }

    private setCellValue<T>(matrix: T[][], cell: Cell, value: T) {
        if (matrix[cell.row] === undefined) {
            matrix[cell.row] = []
        }
        matrix[cell.row][cell.col] = value
    }

    private getCellValue<T>(matrix: T[][], cell: Cell): T | undefined {
        return matrix[cell.row]?.[cell.col]
    }

    private findPath(start: Cell, end: Cell): Cell[] | null {
        let distances: number[][] = []
        let currentCells: Cell[] = [start]
        let currentDistance: number = 0
        let nextCells: Cell[] = []
        this.setCellValue(distances, start, 0)

        while (true) {
            for (const cell of currentCells) {
                for (const neighbour of this.getNeighbours(cell)) {
                    if (this.getCellValue(distances, neighbour) !== undefined) continue
                    nextCells.push(neighbour)
                    this.setCellValue(distances, neighbour, currentDistance + 1)
                }
            }
            currentCells = nextCells
            nextCells = []
            currentDistance += 1
            if (this.getCellValue(distances, end) !== undefined) break
            if (currentCells.length == 0) {
                return null
            }
        }

        const path: Cell[] = []
        let cell = end
        path.push(cell)
        while (currentDistance > 0) {
            const neighbours = this.getNeighbours(cell)
            const neighboursTowardsStart = neighbours.filter(neighbour => this.getCellValue(distances, neighbour) === currentDistance - 1)
            cell = neighboursTowardsStart[Math.floor(Math.random() * neighboursTowardsStart.length)]
            path.push(cell)
            currentDistance -= 1
        }
        return path
    }

    private getOpenCells() {
        const openCells: Cell[] = []
        this.matrix.forEach(row => row.forEach(cell => {
            if (cell.state == CellState.Open) {
                openCells.push(cell)
            }
        }))
        return openCells
    }

    generatePath(): { x: number, y: number }[] {
        this.matrix = []
        for (let i = 0; i < this.size; i++) {
            this.matrix[i] = []
            for (let j = 0; j < this.size; j++) {
                this.matrix[i].push(new Cell(i, j))
            }
        }

        const startCell = this.matrix[this.radius][this.radius]
        let endCell: Cell
        const randomSide = Math.floor(Math.random() * 4)
        const randomCell = Math.floor(Math.random() * this.size)
        switch (randomSide) {
            case 0: // east
                endCell = this.matrix[this.size - 1][randomCell]
                break
            case 1: // north
                endCell = this.matrix[randomCell][0]
                break
            case 2: // west
                endCell = this.matrix[0][randomCell]
                break
            case 3: // south
                endCell = this.matrix[randomCell][this.size - 1]
                break
        }


        startCell.state = endCell.state = CellState.Forced

        let finalPath = this.findPath(startCell, endCell)
        if (finalPath == null) {
            throw new Error("Impossible path")
        }
        while (true) {
            const openCells = this.getOpenCells()
            if (openCells.length == 0) {
                // transform to x, y cordinates with center as 0, 0 and the steps to do
                let lastCell = finalPath[0]
                const result: { x: number, y: number }[] = []
                finalPath.forEach(cell => {
                    result.push({
                        x: cell.col - lastCell.col,
                        y: (this.size - 1 - cell.row) - (this.size - 1 - lastCell.row)
                    })
                    lastCell = cell
                })
                return result
            }
            const randomOpenCell = openCells[Math.floor(Math.random() * openCells.length)]
            randomOpenCell.state = CellState.Blocked
            if (finalPath.includes(randomOpenCell)) {
                const newPath = this.findPath(startCell, endCell)
                if (newPath == null) {
                    randomOpenCell.state = CellState.Forced
                }
                else {
                    finalPath = newPath
                }
            }
        }
    }
}
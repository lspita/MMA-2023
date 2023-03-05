import Utils from "../utils"

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
    wiggliness: number

    constructor(matrixRadius: number, wiggliness: number) {
        this.radius = matrixRadius
        this.wiggliness = wiggliness
        this.size = (this.radius * 2) + 1
    }

    private getNeighbours(cell: Cell): Cell[] { // Get possible neighbours of given cell
        const neighbours: { row: number, col: number }[] = []
        if (cell.row > 0) neighbours.push({ row: cell.row - 1, col: cell.col })
        if (cell.row < this.size - 1) neighbours.push({ row: cell.row + 1, col: cell.col })
        if (cell.col > 0) neighbours.push({ row: cell.row, col: cell.col - 1 })
        if (cell.col < this.size - 1) neighbours.push({ row: cell.row, col: cell.col + 1 })
        return neighbours
            .filter(neighbour => this.matrix[neighbour.row][neighbour.col].state != CellState.Blocked)
            .map(neighbour => new Cell(neighbour.row, neighbour.col, this.matrix[neighbour.row][neighbour.col].state)) // Convert every row/col obj to cell
    }

    private getRandomCell(openCells: Cell[], currentPath: Cell[]): Cell { // Get random open cell with weight consideration
        const openPathCells = currentPath.filter(c => c.state == CellState.Open)
        const pathWeight = openPathCells.length * this.wiggliness * 2
        const nonPathWeight = (openCells.length - openPathCells.length) * 1
        const totalWeight = pathWeight + nonPathWeight
        var r = Math.random() * totalWeight
        if (r <= pathWeight) {
            return Utils.random(openPathCells)
        } else {
            const nonPathCells = openCells.filter(c => !currentPath.includes(c))
            return Utils.random(nonPathCells)
        }
    }

    private setCellValue<T>(matrix: T[][], cell: Cell, value: T) { // Quick function to set cell value with undefined controls 
        if (matrix[cell.row] === undefined) {
            matrix[cell.row] = []
        }
        matrix[cell.row][cell.col] = value
    }

    private getCellValue<T>(matrix: T[][], cell: Cell): T | undefined { // Quick function to get cell value with undefined controls
        return matrix[cell.row]?.[cell.col]
    }

    private findPath(start: Cell, end: Cell): Cell[] | null { // Dijkstra path finding algorithm
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
            cell = Utils.random(neighboursTowardsStart)
            path.push(cell)
            currentDistance -= 1
        }
        return path
    }

    private getOpenCells() { // Matrix to array of open cells
        const openCells: Cell[] = []
        this.matrix.forEach(row => row.forEach(cell => {
            if (cell.state == CellState.Open) {
                openCells.push(cell)
            }
        }))
        return openCells
    }

    generatePath(): { x: number, y: number }[] {
        // Fill matrix
        this.matrix = []
        for (let i = 0; i < this.size; i++) {
            this.matrix[i] = []
            for (let j = 0; j < this.size; j++) {
                this.matrix[i].push(new Cell(i, j))
            }
        }

        // Center cell as start
        const startCell = this.matrix[this.radius][this.radius]

        // Random end cell in edges
        let endCell: Cell
        const randomSide = Math.floor(Math.random() * 4)
        const randomCellIndex = Math.floor(Math.random() * this.size)
        switch (randomSide) {
            case 0: // east
                endCell = this.matrix[this.size - 1][randomCellIndex]
                break
            case 1: // north
                endCell = this.matrix[randomCellIndex][0]
                break
            case 2: // west
                endCell = this.matrix[0][randomCellIndex]
                break
            case 3: // south
                endCell = this.matrix[randomCellIndex][this.size - 1]
                break
        }


        startCell.state = endCell.state = CellState.Forced

        let finalPath = this.findPath(startCell, endCell)
        if (finalPath == null) {
            throw new Error("Impossible path")
        }
        while (true) {
            const openCells = this.getOpenCells() // Get open cells
            if (openCells.length == 0) { // If there aren't any, the path is generated
                // Transform to x, y cordinates with matrix center as 0, 0 and the steps to do
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
            const randomOpenCell = this.getRandomCell(openCells, finalPath) // Get random open cell
            randomOpenCell.state = CellState.Blocked // Set as blocked
            if (finalPath.includes(randomOpenCell)) { // If it's in the path
                const newPath = this.findPath(startCell, endCell) // Recalculate shortest path
                if (newPath == null) { // If can't recalculate
                    randomOpenCell.state = CellState.Forced // Set cell as forced open
                }
                else {
                    finalPath = newPath // Set recalculated path as new path
                }
            }
        }
    }
}
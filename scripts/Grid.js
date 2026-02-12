import { Tetromino } from "./Tetromino.js";

export class Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        this.canvas = canvas;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.space = space;

        this.matrix = [];
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.cols * this.cellSize + (this.space * this.cols);
        this.canvas.height = this.rows * this.cellSize + (this.space * this.rows);
        this.block = new Tetromino(this.canvas, this.cellSize);
        this._restartMatrix();
    }
    getCoordinates(col, row) {
        return {
            x: col * (this.cellSize + this.space),
            y: row * (this.cellSize + this.space),
        };
    }
    drawSquare(x, y, size, color, borderColor, border) {
        const borderSize = size / border;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderSize;
        this.ctx.strokeRect(
            x + borderSize / 2,
            y + borderSize / 2,
            size - borderSize,
            size - borderSize,
        );
    }
    _restartMatrix() {
        for (let r = 0; r < this.rows; r++) {
            this.matrix[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.matrix[r][c] = 0;
            }
        }
    }
}

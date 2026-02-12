import { Grid } from './Grid.js';

export class Board extends Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        super(canvas, rows, cols, cellSize, space);
    }
    draw() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const { x, y } = this.getCoordinates(c, r);
                if (this.matrix[r][c] !== 0) {
                    this.block._drawBlock(x, y, this.matrix[r][c]);
                } else {
                    this.drawSquare(x, y, this.cellSize, "#000", "gray", 20);
                }
            }
        }
    }
    isEmpty(row, col) {
        return this._isInside(row, col) && this.matrix[row][col] === 0;
    }
    _isInside(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    clearFullRows() {
        let count = 0;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this._isRowFull(row)) {
                this._clearRow(row);
                count++;
            } else if (count > 0) {
                this._moveRowDown(row, count);
            }
        }
        return count;
    }
    _isRowFull(row) {
        return this.matrix[row].every(cell => cell !== 0);
    }
    _clearRow(row) {
        this.matrix[row].fill(0);
    }
    _moveRowDown(row, numRows) {
        this.matrix[row + numRows] = this.matrix[row].slice();
        this._clearRow(row);
    }
    gameOver() {
        return !(this._isRowEmpty(0));
    }
    _isRowEmpty(row) {
        return this.matrix[row].every(cell => cell === 0);
    }
}



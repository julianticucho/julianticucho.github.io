import { Grid } from "./Grid.js";

export class BoardNext extends Grid {
    constructor(canvas, rows, cols, cellSize, space, listTetrominos) {
        super(canvas, rows, cols, cellSize, space);
        this.listTetrominos = listTetrominos;
        this.updateMatrix();
    }
    updateMatrix() {
        this._restartMatrix();
        let count = 0;
        for (let i = 0; i < this.listTetrominos.length; i++) {
            const shape = this.listTetrominos[i].currentShape();
            for (let j = 0; j < shape.length; j++) {
                this.matrix[shape[j].row + count][shape[j].col] = this.listTetrominos[i].id;
            }
            count += 3;
        }
    }
    draw() {
        this._drawBackground();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const { x, y } = this.getCoordinates(c, r);
                if (this.matrix[r][c] !== 0) {
                    if (this.matrix[r][c] === 2) {
                        this.block._drawBlock(x + this.cellSize, y, this.matrix[r][c]);                    
                    } else if (this.matrix[r][c] === 3) {
                        this.block._drawBlock(x, y, this.matrix[r][c]);
                    } else {
                        this.block._drawBlock(x + this.cellSize / 2, y + this.cellSize / 2, this.matrix[r][c]);
                    }
                }
            }
        }
    }
    _drawBackground() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    

}
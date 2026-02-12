import { Grid } from "./Grid.js";

export class BoardHold extends Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        super(canvas, rows, cols, cellSize, space);
        this.tetromino = null;
        this.updateMatrix();
    }
    updateMatrix() {
        if (this.tetromino == null) return;
        this.tetromino.reset();
        this._restartMatrix();
        const shape = this.tetromino.currentShape();
        for (let i = 0; i < shape.length; i++) {
            this.matrix[shape[i].row][shape[i].col] = this.tetromino.id;
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
        // dibujamos el background transparente
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
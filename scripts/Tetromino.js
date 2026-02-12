import { Position } from "./Position.js";

export class Tetromino {
    constructor(canvas, cellSize, shapes = [], initPosition = new Position(), id = 1) {
        this.canvas = canvas;
        this.cellSize = cellSize;
        this.shapes = shapes;
        this.initPosition = initPosition;
        this.id = id;

        this.ctx = canvas.getContext("2d");
        this.rotation = 0;
        this.position = new Position(this.initPosition.row, this.initPosition.col);
    }
    draw(grid) {
        const shape = this.currentShape();
        for (let i = 0; i < shape.length; i++) {
            const position = grid.getCoordinates(
                this.position.col + shape[i].col,
                this.position.row + shape[i].row
            );
            this._drawBlock(position.x, position.y, this.id);
        }
    }
    currentShape() {
        return this.shapes[this.rotation];
    }
    _drawBlock(x, y, id) {
        const margin = this.cellSize / 8;
        const palette = this._getColorPalette(id);
        this._drawTriangle(
            x, y,
            x + this.cellSize, y,
            x, y + this.cellSize,
            palette.leftTriangle
        );
        this._drawTriangle(
            x + this.cellSize, y,
            x, y + this.cellSize,
            x + this.cellSize, y + this.cellSize,
            palette.rightTriangle
        );
        this._drawSquare(
            x + margin, y + margin,
            this.cellSize - margin * 2,
            palette.square
        );
    }
    _getColorPalette(id) {
        const palette = {
            1: {
                rightTriangle: "#B5193B",
                leftTriangle: "#FFFFFF",
                square: "#EE1B2E",
            },
            2: {
                rightTriangle: "#FE5E02",
                leftTriangle: "#FFFFFF",
                square: "#FE8602",
            },
            3: {
                rightTriangle: "#FE8601",
                leftTriangle: "#FFFFFF",
                square: "#FFDB21",
            },
            4: {
                rightTriangle: "#22974C",
                leftTriangle: "#FFFFFF",
                square: "#24DC4F",
            },
            5: {
                rightTriangle: "#49BDFF",
                leftTriangle: "#FFFFFF",
                square: "#2D97F9",
            },
            6: {
                rightTriangle: "#0000C9",
                leftTriangle: "#FFFFFF",
                square: "#0101F0",
            },
            7: {
                rightTriangle: "#8500D3",
                leftTriangle: "#FFFFFF",
                square: "#A000F1",
            },
        };
        return palette[id] || palette[1];
    }
    _drawTriangle(x1, y1, x2, y2, x3, y3, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    _drawSquare(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
    }
    currentPosition() {
        const positions = [];
        const shape = this.currentShape();
        for (let i = 0; i < shape.length; i++) {
            positions.push(new Position(
                this.position.row + shape[i].row,
                this.position.col + shape[i].col
            ));
        }
        return positions;
    }
    move(dr, dc) {
        this.position.row += dr;
        this.position.col += dc;
    }
    reset() {
        this.rotation = 0;
        this.position = new Position(this.initPosition.row, this.initPosition.col);
    }
}

export const TetrominoTypes = {
    T: {
        id: 1,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 1)],
        ],
    },
    O: {
        id: 2,
        initPosition: new Position(0, 4),
        shapes: [
            [new Position(0, 0), new Position(0, 1), new Position(1, 0), new Position(1, 1)],
        ],
    },
    I: {
        id: 3,
        initPosition: new Position(-1, 3),
        shapes: [
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(1, 3)],
            [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2)],
            [new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(2, 3)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1)],
        ],
    },
    S: {
        id: 4,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 1), new Position(0, 2), new Position(1, 0), new Position(1, 1)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(1, 1), new Position(1, 2), new Position(2, 0), new Position(2, 1)],
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)],
        ],
    },
    Z: {
        id: 5,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 2), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 0)],
        ],
    },
    J: {
        id: 6,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(0, 2), new Position(1, 1), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 0), new Position(2, 1)],
        ],
    },
    L: {
        id: 7,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 2), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 0)],
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)],
        ],
    },
}
import { Tetromino, TetrominoTypes } from "./Tetromino.js";

export class TetrominosBag {
    constructor(canvas, cellSize) {
        this.canvas = canvas;
        this.cellSize = cellSize;
        this.bag = [];
        this.threeNextTetrominos = [];
        this.init();
    }
    init() {
        for (let i = 0; i < 3; i++) {
            this.threeNextTetrominos.push(this.getNextTetrominoFromBag());
        }
    }
    getNextTetrominoFromBag() {
        if (this.bag.length === 0) {
            this._fillBag();
        }
        return this.bag.pop();
    }
    _fillBag() {
        const tetrominosTypes = [
            TetrominoTypes.T,
            TetrominoTypes.O,
            TetrominoTypes.I,
            TetrominoTypes.S,
            TetrominoTypes.Z,
            TetrominoTypes.J,
            TetrominoTypes.L,
        ];
        this.bag.length = 0;
        tetrominosTypes.forEach((type) => {
            this.bag.push(new Tetromino(
                this.canvas,
                this.cellSize,
                type.shapes,
                type.initPosition,
                type.id
            ));
        });
        for (let i = this.bag.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }
    nextTetromino() {
        const next = this.threeNextTetrominos.shift()
        this.threeNextTetrominos.push(this.getNextTetrominoFromBag());
        return next;
    }
    getThreeNextTetrominos() {
        return this.threeNextTetrominos;
    }
    reset() {
        this.bag = [];
        this.threeNextTetrominos = [];
        this.init();
    }
}
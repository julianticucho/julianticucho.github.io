import { Board } from "./Board.js";
import { TetrominosBag } from "./TetrominosBag.js";
import { BoardNext } from "./BoardNext.js";
import { BoardHold } from "./BoardHold.js";

export class Game {
    constructor(canvas, rows, cols, cellSize, space, canvasNext, canvasHold) {
        this.board = new Board(canvas, rows, cols, cellSize, space);
        this.tetrominosBag = new TetrominosBag(canvas, cellSize);
        this.currentTetromino = this.tetrominosBag.nextTetromino();
        this.keys = { up: false, down: false };
        this.lastTimeAutoMove = 0;
        this.lastTimeDraw = 0;
        this.next = new BoardNext(canvasNext, 9, 4, cellSize, space, this.tetrominosBag.getThreeNextTetrominos());
        this.hold = new BoardHold(canvasHold, 3, 4, cellSize, space);
        this.canHold = false;
        
        // Game Over UI
        this.gameOverScreen = document.getElementById("game-over-screen");
        this.finalLinesSpan = document.getElementById("final-lines");
        this.btnRestart = document.getElementById("btn-restart");
        this.isGameOver = false;
        this.lines = 0;

        this._keyboard();
        this._initEvents();
    }
    _initEvents() {
        this.btnRestart.addEventListener("click", () => {
            this.restart();
        });
    }
    update() {
        if (this.isGameOver) return;

        let currentTime = Date.now();
        let deltaTimeDraw = currentTime - this.lastTimeDraw;
        if (deltaTimeDraw >= 50) {
            this.board.draw();
            this._drawTetrominoGhost();
            this.currentTetromino.draw(this.board);
            this.next.draw();
            this.hold.draw();
            if (this.keys.down) {
                this._moveTetrominoDown();
            }
            this.lastTimeDraw = currentTime;
        }
        let deltaTimeAutoMove = currentTime - this.lastTimeAutoMove;
        if (deltaTimeAutoMove >= 200) {
            this._autoMoveTetrominoDown();
            this.lastTimeAutoMove = currentTime;
        }
    }
    _autoMoveTetrominoDown() {
        this.currentTetromino.move(1, 0);
        if (this._blockedTetromino()) {
            this.currentTetromino.move(-1, 0);
            this._placeTetromino();
        }
    }
    _blockedTetromino() {
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            if (!this.board.isEmpty(tetrominoPositions[i].row, tetrominoPositions[i].col)) {
                return true;
            }
        }
        return false;
    }
    _placeTetromino() {
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            this.board.matrix[tetrominoPositions[i].row][tetrominoPositions[i].col] = this.currentTetromino.id;
        }
        this.lines += this.board.clearFullRows();
        
        // Actualizamos contador de líneas en el UI si lo tienes
        const linesValue = document.querySelector(".stats-panel .stat-item:nth-child(1) .value");
        if (linesValue) linesValue.innerText = this.lines;

        if (this.board.gameOver()) {
            this._triggerGameOver();
            return true
        } else {
            this.currentTetromino = this.tetrominosBag.nextTetromino();
            this.next.listTetrominos = this.tetrominosBag.getThreeNextTetrominos();
            this.next.updateMatrix();
            this.canHold = true;
        }
    }
    _keyboard() {
        window.addEventListener("keydown", (evt) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(evt.code) || 
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(evt.key)) {
                evt.preventDefault();
            }

            if (evt.key == "ArrowLeft") {
                this._moveTetrominoLeft();
            }
            if (evt.key == "ArrowRight") {
                this._moveTetrominoRight();
            }
            if (evt.key == "ArrowDown" && !this.keys.down) {
                this._moveTetrominoDown();
                this.keys.down = true;
            }
            if (evt.key == "ArrowUp" && !this.keys.up) {
                this._rotationTetrominoCW();
                this.keys.up = true;
            }
            if (evt.code == "Space") {
                this._dropBlock();
            } 
            if (evt.key == "c") {
                this._holdTetromino();
            }
            if (evt.key == "r") {
                this.currentTetromino = this.tetrominosBag.nextTetromino();
            }     
        })
        window.addEventListener("keyup", (evt) => {
            if (evt.key == "ArrowDown") {
                this.keys.down = false;
            }
            if (evt.key == "ArrowUp") {
                this.keys.up = false;
            }
        })
    }
    _moveTetrominoLeft() {
        this.currentTetromino.move(0, -1);
        if (this._blockedTetromino()) {
            this.currentTetromino.move(0, 1);
        }
    }
    _moveTetrominoRight() {
        this.currentTetromino.move(0, 1);
        if (this._blockedTetromino()) {
            this.currentTetromino.move(0, -1);
        }
    }
    _moveTetrominoDown() {
        this.currentTetromino.move(1, 0);
        if (this._blockedTetromino()) {
            this.currentTetromino.move(-1, 0);
        }
    }
    _rotationTetrominoCW() {
        this.currentTetromino.rotation++;
        if (this.currentTetromino.rotation > this.currentTetromino.shapes.length - 1) {
            this.currentTetromino.rotation = 0;
        }
        if (this._blockedTetromino()) {
            this._rotationTetrominoCCW();
        }
    }
    _rotationTetrominoCCW() {
        this.currentTetromino.rotation--;
        if (this.currentTetromino.rotation < 0) {
            this.currentTetromino.rotation = this.currentTetromino.shapes.length - 1;
        }
        if (this._blockedTetromino()) {
            this._rotationTetrominoCW();
        }
    }
    _drawTetrominoGhost() {
        const dropDistance = this._tetrominoDropDistance();
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            let position = this.board.getCoordinates(
                tetrominoPositions[i].col,
                tetrominoPositions[i].row + dropDistance
            );
            this.board.drawSquare(position.x, position.y, this.board.cellSize, "#000", "white", 20);
        }   
    }
    _tetrominoDropDistance() {
        let drop = this.board.rows;
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            drop = Math.min(drop, this._dropDistance(tetrominoPositions[i]));
        }
        return drop;
    }
    _dropDistance(position) {
        let distance = 0;
        while (this.board.isEmpty(position.row + distance + 1, position.col)) {
            distance++;
        }
        return distance;
    }
    _dropBlock() {
        this.currentTetromino.move(this._tetrominoDropDistance(), 0)
        this._placeTetromino();
    }
    _holdTetromino() {
        if (!this.canHold) return;
        if (this.hold.tetromino == null) {
            this.hold.tetromino = this.currentTetromino;
            this.currentTetromino = this.tetrominosBag.nextTetromino();
        } else {
            [this.hold.tetromino, this.currentTetromino] = [this.currentTetromino, this.hold.tetromino];
        }
        this.hold.updateMatrix();
        this.canHold = false;
    }
    _triggerGameOver() {
        this.isGameOver = true;
        this.finalLinesSpan.innerText = this.lines;
        this.gameOverScreen.classList.remove("hidden");
    }
    restart() {
        this.board._restartMatrix();
        this.tetrominosBag.reset();
        this.currentTetromino = this.tetrominosBag.nextTetromino();
        this.next.listTetrominos = this.tetrominosBag.getThreeNextTetrominos();
        this.next.updateMatrix();
        this.hold.tetromino = null;
        this.hold.updateMatrix();
        this.lines = 0;
        this.isGameOver = false;
        this.canHold = false;
        
        // UI Reset
        this.gameOverScreen.classList.add("hidden");
        const linesValue = document.querySelector(".stats-panel .stat-item:nth-child(2) .value");
        if (linesValue) linesValue.innerText = "0";
    }
}
let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = "Playing";



let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]];


let tetrominos = [];

let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];

let curTetrominoColor;


let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));

let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray() {
    let i = 0, j = 0;
    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function IncrementPoint(point) {
    const textSize = ctx.measureText('Current Score : ' + score.toString())
    const height = textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent
    score += point
    ctx.clearRect(310, 127, textSize.width, -height)
    ctx.fillStyle = 'white';
    ctx.fillText('Current Score: ' + score.toString(), 310, 127);
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;

    ctx.scale(1.3, 1.3);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(8, 8, 280, 462);

    IncrementPoint(0)

    document.addEventListener('keyup', HandleKeyUp);
    document.addEventListener('keydown', HandleKeyDown);

    CreateTetrominos();
    CreateTetromino();
    CreateCoordArray();
    DrawTetromino();
}


function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        gameBoardArray[x][y] = 1;

        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyDown(key) {
    if (key.keyCode === 83) {
        MoveTetrominoDown();
        IncrementPoint(9)
    }
    else if (key.keyCode === 40) {
        MoveTetrominoDown()
        IncrementPoint(9)
    }
    else if (key.keyCode === 68) {
        direction = DIRECTION.RIGHT;
        if (!HittingTheWall() && !CheckForHorizontalCollision()) {
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }
    }
    else if (key.keyCode === 37) {
        direction = DIRECTION.LEFT;
        if (!HittingTheWall() && !CheckForHorizontalCollision()) {
            DeleteTetromino();
            startX--;
            DrawTetromino();
        }
    }
    else if (key.keyCode === 65) {
        direction = DIRECTION.LEFT;
        if (!HittingTheWall() && !CheckForHorizontalCollision()) {
            DeleteTetromino();
            startX--;
            DrawTetromino();
        }
    }
    else if (key.keyCode === 39) {
        direction = DIRECTION.RIGHT;
        if (!HittingTheWall() && !CheckForHorizontalCollision()) {
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }
    }
}

function HandleKeyUp(key) {
    if (winOrLose != "Game Over") {
        if (key.keyCode === 38)
            RotateTetromino();
        else if (key.keyCode === 87)
            RotateTetromino();

    }
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    CheckForCompletedRows();

    if (!CheckForVerticalCollison()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

function StartTheGame() {
    window.setInterval(function () {
        if (winOrLose != "Game Over") {
            MoveTetrominoDown();
        }
    }, 1000);
}

function CreateTetrominos() {
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]);

    tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]);

    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]);

    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]);

    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]);

    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]);

    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]);

    tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
}

function CreateTetromino() {
    if (tetrominos.length == 0) {
        CreateTetrominos()
    }
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    curTetromino = tetrominos[randomTetromino]
    curTetrominoColor = tetrominoColors[randomTetromino]
    tetrominos.splice(randomTetromino, 1)
    tetrominoColors.splice(randomTetromino, 1)
}

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = '#1f242d';
        ctx.clearRect(coorX - 1, coorY - 1, 23, 23);
    }
}

function HittingTheWall() {
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
        }
    }
    return false;
}

function CheckForVerticalCollison() {
    let tetrominoCopy = curTetromino;
    let collision = false;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];

        let x = square[0] + startX;
        let y = square[1] + startY;

        if (direction === DIRECTION.DOWN) {
            y++;
        }

        if (typeof stoppedShapeArray[x][y + 1] === 'string') {
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if (y >= 20) {
            collision = true;
            break;
        }
    }
    if (collision) {

        if (startY <= 2) {
            winOrLose = "Game Over";

            ctx.fillStyle = 'white';
            ctx.fillText(winOrLose, 310, 261);
        } else {



            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;

                stoppedShapeArray[x][y] = curTetrominoColor;
            }



            CreateTetromino();


            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}


function CheckForHorizontalCollision() {

    let tetrominoCopy = curTetromino;
    let collision = false;


    for (let i = 0; i < tetrominoCopy.length; i++) {


        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;



        if (direction == DIRECTION.LEFT) {
            x--;
        } else if (direction == DIRECTION.RIGHT) {
            x++;
        }


        let stoppedShapeVal = stoppedShapeArray[x][y];


        if (typeof stoppedShapeVal === 'string') {
            collision = true;
            break;
        }
    }

    return collision;
}



function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = true;

        for (let x = 0; x < gBArrayWidth; x++) {
            let square = stoppedShapeArray[x][y];

            if (square === 0 || (typeof square === 'undefined')) {
                completed = false;
                break;
            }
        }

        if (completed) {
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;

            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;

                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.clearRect(coorX - 1, coorY - 1, 23, 23);
            }
        }
    }
    if (rowsToDelete >= 4) {
        IncrementPoint(1200 * level)
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    } else if (rowsToDelete == 1) {
        IncrementPoint(40 * level)
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }else if (rowsToDelete == 2) {
        IncrementPoint(100 * level)
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }else if (rowsToDelete == 3) {
        IncrementPoint(300 * level)
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}


function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion - 1; i >= 0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string') {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;


                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.clearRect(coorX - 1, coorY - 1, 23, 23);
            }
        }
    }
}



function RotateTetromino() {
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        curTetrominoBU = [...curTetromino];

        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    try {
        curTetromino = newRotation;
        DrawTetromino();
    }
    catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}
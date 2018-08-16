document.getElementById("myCanvas").style.background =
    "url('backgrounds/sky.jpeg') blue no-repeat center";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var dz = 0;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var spacePressed;
var brickRowCount = 4;
var brickColumnCount = 8;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var score = 0;
var lives = 3;
var gamePlay;
var soundH;
var hit;
var loose;
var bomb;
var music;
var shot;
var drawHeart;

//Levels
var levelTwo;
var levelthree;
var life = false;
var life2 = false;
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

window.onload = function() {
    spacePressed = false;
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    drawHeart();
    drawBricks();
};
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 32 && !spacePressed) {
        spacePressed = true;
        startGame();
    } else if (e.keyCode == 32 && spacePressed) {
        clearInterval(gamePlay);
        music.pause();
    }
}
function startGame() {
    gamePlay = setInterval(draw, 10);
    music = new Audio("videogamemusic/play.mp3");
    music.play();
    music.loop = true;
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x > bricks[3][3].x &&
                    x < bricks[3][3].x + brickWidth &&
                    y > bricks[3][3].y &&
                    y < bricks[3][3].y + brickHeight
                ) {
                    if (life === false) {
                        bricks[3][3].status = 0;
                        dy = -dy;
                        soundH = new Audio("videogamemusic/bells.mp3");
                        soundH.volume = 0.5;
                        soundH.play();
                        dz = 2;
                        lives = lives + 1;
                        score++;
                        life = null;
                    }
                } else if (
                    x > bricks[5][2].x &&
                    x < bricks[5][2].x + brickWidth &&
                    y > bricks[5][2].y &&
                    y < bricks[5][2].y + brickHeight
                ) {
                    if (life2 === false) {
                        de = 2;
                        bricks[5][2].status = 0;
                        dy = -dy;
                        score++;
                        bomb = new Audio("videogamemusic/bomb.wav");
                        bomb.play();
                        bomb.volume = 0.5;

                        life2 = null;
                    }
                } else if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    shot = new Audio("videogamemusic/shot.wav");
                    shot.play();

                    if (score == 32) {
                        win();
                        lives = 3;
                        for (var c = 0; c < brickColumnCount; c++) {
                            bricks[c] = [];
                            for (var r = 0; r < brickRowCount; r++) {
                                bricks[c][r] = { x: 0, y: 0, status: 1 };
                            }
                        }
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        clearInterval(gamePlay);
                        levelTwo = setInterval(draw2, 10);
                    }
                }
            }
        }
    }
}

function win() {
    win = new Audio("videogamemusic/win.wav");
    win.play();
    clearInterval(gamePlay);
    setTimeout(function() {
        alert("CONGRATULATIONS! ON TO LEVEL 2!!", "WIN");
    }, 500);
}
var w = 300;
var z = 115;
var a = 500;
var e = 50;

function drawHeart() {
    var img = new Image();
    img.src = "backgrounds/heart.svg";
    ctx.drawImage(img, w, z, 40, 40);
}

function drawBomb() {
    var img = new Image();
    img.src = "backgrounds/bomb.png";
    ctx.drawImage(img, a, e, 20, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall() {
    var img = new Image();
    img.src = "backgrounds/tennis.png";
    ctx.drawImage(img, x, y, 20, 20);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#66ff66";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                if (r % 2 == 0) {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowOffsetX = -4;
                    ctx.shadowOffsetY = -4;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#660033";
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#cc0066";
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                } else {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowOffsetX = -4;
                    ctx.shadowOffsetY = -4;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#660033";
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#008080";
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        }
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    drawBomb();
    drawHeart();
    drawBricks();

    if (x + dx > canvas.width - 20 || x + dx < -2) {
        dx = -dx;
    }
    if (y + dy < 0) {
        dy = -dy;
    } else if (y + dy > canvas.height - 22 - paddleHeight) {
        if (x + 20 > paddleX && x - 10 < paddleX + paddleWidth) {
            hit = new Audio("videogamemusic/hit.wav");
            hit.play();
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                gameOver();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    z += dz;
    e += de;
}

function gameOver() {
    loose = new Audio("videogamemusic/loose.wav");
    loose.play();
    clearInterval(gamePlay);
    setTimeout(function() {
        alert("GAME OVER");
        document.location.reload();
    }, 3000);
}

function collisionDetection2() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    shot = new Audio("videogamemusic/shot.wav");
                    shot.play();
                    if (score == 64) {
                        alert("CONGRATULATIONS! ON TO LEVEL 3!!", "WIN");
                        lives = 3;
                        for (var c = 0; c < brickColumnCount; c++) {
                            bricks[c] = [];
                            for (var r = 0; r < brickRowCount; r++) {
                                bricks[c][r] = { x: 0, y: 0, status: 1 };
                            }
                        }
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        x += dx;
                        y += dy;
                        clearInterval(levelTwo);
                        levelthree = setInterval(draw3, 10);
                    }
                }
            }
        }
    }
}

function drawBricks2() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                if (r % 2 == 0 && c % 2 == 0) {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowOffsetX = -4;
                    ctx.shadowOffsetY = -4;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#cc3300";
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#ff9900";
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                } else {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowOffsetX = -4;
                    ctx.shadowOffsetY = -4;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#cc3300";
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#ffff00";
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        }
    }
}

function drawScore2() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives2() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall2() {
    ctx.beginPath();
    var img = new Image();
    img.src = "backgrounds/sun.png";
    ctx.drawImage(img, x, y, 25, 25);
}

function drawPaddle2() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffff00";
    ctx.fill();
    ctx.closePath();
}

function draw2() {
    document.getElementById("myCanvas").style.background =
        "url('backgrounds/grandc.jpg') orange no-repeat center";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks2();
    drawBall2();
    drawPaddle2();
    collisionDetection2();
    drawScore2();
    drawLives2();
    if (x + dx > canvas.width - 20 || x + dx < -2) {
        dx = -dx;
    }
    if (y + dy < 0) {
        dy = -dy;
    } else if (y + dy > canvas.height - 25 - paddleHeight) {
        if (x + 20 > paddleX && x - 10 < paddleX + paddleWidth) {
            dy = -dy;
            hit = new Audio("videogamemusic/hit.wav");
            hit.play();
        } else {
            lives--;
            if (!lives) {
                loose = new Audio("videogamemusic/loose.wav");
                loose.play();
                alert("GAME OVER");

                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
}

function collisionDetection3() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    shot = new Audio("videogamemusic/shot.wav");
                    shot.play();
                    if (score == 96) {
                        alert("CONGRATULATIONS! ON TO LEVEL 4!!", "WIN");
                        lives = 3;
                        for (var c = 0; c < brickColumnCount; c++) {
                            bricks[c] = [];
                            for (var r = 0; r < brickRowCount; r++) {
                                bricks[c][r] = { x: 0, y: 0, status: 1 };
                            }
                        }

                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 2;
                        dsy = -2;
                        clearInterval(levelthree);
                        setInterval(draw4, 9);
                    }
                }
            }
        }
    }
}

function drawBricks3() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                if (r % 2 == 0) {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowOffsetX = -4;
                    ctx.shadowOffsetY = -4;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#666699";
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                } else {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowOffsetX = -4;
                    ctx.shadowOffsetY = -4;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#666699";
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        }
    }
}

function drawScore3() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0000ff";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives3() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0000ff";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall3() {
    ctx.beginPath();
    var img = new Image();
    img.src = "backgrounds/snowflake.png";
    ctx.drawImage(img, x, y, 25, 25);
}

function drawPaddle3() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}

function draw3() {
    document.getElementById("myCanvas").style.background =
        "url('backgrounds/snow.jpg') white  no-repeat center";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks3();
    drawBall3();
    drawPaddle3();
    collisionDetection3();
    drawScore3();
    drawLives3();
    if (x + dx > canvas.width - 20 || x + dx < 0) {
        dx = -dx;
    }
    if (y + dy < 0) {
        dy = -dy;
    } else if (y + dy > canvas.height - 25 - paddleHeight) {
        if (x + 20 > paddleX && x - 10 < paddleX + paddleWidth) {
            dy = -dy;
            hit = new Audio("videogamemusic/hit.wav");
            hit.play();
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER", "OH NO");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
}

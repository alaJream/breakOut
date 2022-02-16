/* eslint-disable max-classes-per-file */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// const gradient = ctx.createLinearGradient(20, 0, 220, 0);
// gradient.addColorStop(0, 'orange');
// gradient.addColorStop(1, 'cyan');
// gradient.addColorStop(2, 'orange');

// ctx.fillStyle = gradient;
// ctx.fillRect(20, 20, 200, 100);

// constants-----------------------------------------------------

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const paddleXStart = (canvas.width - paddleWidth) / 2;
const PI2 = Math.PI * 2;
const objectColor = '#000000';
const objectFont = '16px Arial';
const gameOverMessage = 'GAME OVER. TRY AGAIN?';
const winningMessage = 'YOU WIN CONGRATULATIONS! \nCan you do it again?';

//-----------------------------------------------------

// variables-----------------------------------------------------

// let x;
// let y;
// let dx;
// let dy;

class Ball {
  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
// bricks--------------------------
class Bricks {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.bricks = [];
    this.init();
  }

  init() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, objectColor);
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (brick.status === 1) {
          brick.render(ctx);
          // ctx.beingPath();
          // ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
          // ctx.fillStyle = objectColor;
          // ctx.fill();
          // ctx.closePath();
        }
      }
    }
  }
}

const bricks = new Bricks(brickColumnCount, brickRowCount);

//-----------------------------------------------------
// paddle--------------------------

//-----------------------------------------------------
// score---------------------------

//-----------------------------------------------------
// lives---------------------------

//-----------------------------------------------------
// game----------------------------

//-----------------------------------------------------

const ball = new Ball(0, 0, 2, -2, ballRadius, objectColor);

let paddleX;

resetBallAndPaddle();

let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;
// let ballColor = 'red';
//-----------------------------------------------------

// Functions-----------------------------------------------------

function collisionDetection() {
  for (let c = 0; c < bricks.cols; c += 1) {
    for (let r = 0; r < bricks.rows; r += 1) {
      const brick = bricks.bricks[c][r];
      if (brick.status === 1) {
        if (ball.x > brick.x && 
          ball.x < brick.x + brickWidth && 
          ball.y > brick.y && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert(winningMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = objectColor;
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = objectFont;
  ctx.fillStyle = objectColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = objectFont;
  ctx.fillStyle = objectColor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddleX = paddleXStart;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function movePaddle() {
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function collisionsWithCanvasAndPaddle() {
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
    const hue = Math.random() * 360;
    ball.color = `hsl(${hue}, 100%, 50%)`;
  } if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert(gameOverMessage);
        document.location.reload();
      } else {
        resetBallAndPaddle();
      }
    }
  }
}
// function fillBackground() {
//   ctx.beginPath();
//   ctx.rect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = 'rgba'(222, 222, 222, 0.1);
//   ctx.fill();
// }
//-----------------------------------------------------

// Game Loop-----------------------------------------------------

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bricks.render(ctx);
  ball.render(ctx);
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  moveBall();
  movePaddle();
  collisionsWithCanvasAndPaddle();

  // draw screen
  requestAnimationFrame(draw);
}

//-----------------------------------------------------

// Event Listeners-----------------------------------------------------

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//-----------------------------------------------------

// Register Events-----------------------------------------------------

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

//-----------------------------------------------------

draw();

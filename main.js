const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let box = 40;
let snake, direction, food, score, game;

function resizeCanvas() {
  if (window.innerWidth <= 1200) {
    const newSize = Math.floor(window.innerWidth * 0.8);
    canvas.width = newSize;
    canvas.height = newSize;
    box = newSize / 10; // grid 10x10
  } else {
    canvas.width = 400;
    canvas.height = 400;
    box = 40;
  }
}

function initGame() {
  snake = [{x: 5 * box, y: 5 * box}];
  direction = null;
  food = {
    x: Math.floor(Math.random() * 10) * box,
    y: Math.floor(Math.random() * 10) * box
  };
  score = 0;
  clearInterval(game);
  game = setInterval(draw, 100);
  document.getElementById("gameOverOverlay").style.display = "none";
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 10) * box,
      y: Math.floor(Math.random() * 10) * box
    };
  } else {
    snake.pop();
  }

  let newHead = {x: snakeX, y: snakeY};

  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= canvas.width || snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    document.getElementById("gameOverOverlay").style.display = "flex";
    return;
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

document.addEventListener("keydown", (event) => {
  if ((event.key === "ArrowLeft" || event.key === "a") && direction !== "RIGHT") direction = "LEFT";
  if ((event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN") direction = "UP";
  if ((event.key === "ArrowRight" || event.key === "d") && direction !== "LEFT") direction = "RIGHT";
  if ((event.key === "ArrowDown" || event.key === "s") && direction !== "UP") direction = "DOWN";
});

function setDirection(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

document.getElementById("restartBtnOverlay").addEventListener("click", () => {
  initGame();
});

window.addEventListener("resize", () => {
  resizeCanvas();
  initGame();
});

resizeCanvas();
initGame();

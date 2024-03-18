window.addEventListener("DOMContentLoaded", (event) => {
    let canvas = document.getElementById("canvas");
    let container = document.getElementById("stage");
    let playButton = document.getElementById("play");
    let refreshButton = document.getElementById("refresh");
    let buttons = document.getElementById("buttons");
    let counterBox = document.querySelector(".score"); // Using querySelector to get the first element with class 'score'
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    let context = canvas.getContext("2d");
    let gameOn = false;
    let animationId;
    let ball;
    let platform;
    let counter = 0;
    let maxScore = localStorage.getItem("data") || 0; // Corrected bitwise OR to logical OR operator
  
    // Classes
    class Ball {
      constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = "#fff";
        this.dx = this.speed;
        this.dy = this.speed;
      }
      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
      }
      update(canvas, platform) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.draw(context);
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
          counter++;
        }
        if (this.y - this.radius < 0) {
          this.dy = -this.dy;
          counter++;
        }
        if (
          this.y + this.radius > platform.y &&
          this.y - this.radius < platform.y + platform.dh &&
          this.x + this.radius > platform.x &&
          this.x - this.radius < platform.x + platform.dw
        ) {
          this.dy = -this.dy; // Bounce off the platform
        }
        if (this.y + this.radius > canvas.height) {
          gameOn = false;
          cancelAnimationFrame(animationId);
          let gameOver = document.createElement("p");
          gameOver.setAttribute("class", "text");
          gameOver.innerHTML = "Game Over";
          buttons.insertBefore(gameOver, playButton);
          playButton.setAttribute("disabled", "");
          if (counter > maxScore) maxScore = counter;
          localStorage.setItem("data", maxScore.toString());
        }
      }
    }
  
    class Platform {
      constructor(canvas) {
        this.color = "#fff";
        this.x = canvas.width / 2 - 50; // Center the platform horizontally
        this.y = canvas.height - 100; // Adjust the vertical position as needed
        this.dw = 100;
        this.dh = 20;
        this.speed = 10;
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
      }
      draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.dw, this.dh);
      }
      update(canvas) {
        if (this.rightKeyPressed && this.x + this.dw < canvas.width)
          this.x += this.speed;
        if (this.leftKeyPressed && this.x > 0) this.x -= this.speed;
      }
    }
  
    // Functions
    let initGame = function () {
      counter = 0;
      let ball_x = Math.random() * (canvas.width * 0.8);
      let ball_y = Math.random() * 200;
      let ballRadius = 10;
      ball = new Ball(ball_x + ballRadius, ball_y + ballRadius, ballRadius, 6);
      platform = new Platform(canvas);
      let textAdded = document.querySelector(".text"); // Using querySelector to get the first element with class 'text'
      if (textAdded) {
        buttons.removeChild(textAdded);
      }
      document.querySelectorAll(".score")[1].innerHTML = "Max Score: " + maxScore; // Using querySelectorAll to get all elements with class 'score'
    };
  
    let updateCanvas = function () {
      if (gameOn) {
        animationId = requestAnimationFrame(updateCanvas);
        ball.update(canvas, platform);
        platform.draw(context);
        platform.update(canvas); // Update platform
        counterBox.innerHTML = counter;
      }
    };
  
    let switchButton = function () {
      if (gameOn) {
        playButton.querySelector("p").innerHTML = "Pause"; // Using querySelector to get the first 'p' element
        playButton.querySelector("i").className = "fa fa-pause"; // Using querySelector to get the first 'i' element
      } else {
        playButton.querySelector("p").innerHTML = "Play"; // Using querySelector to get the first 'p' element
        playButton.querySelector("i").className = "fa fa-play"; // Using querySelector to get the first 'i' element
      }
    };
  
    // Event Listeners
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") platform.rightKeyPressed = true;
      if (e.key === "ArrowLeft") platform.leftKeyPressed = true;
    });
    document.addEventListener("keyup", function (e) {
      if (e.key === "ArrowRight") platform.rightKeyPressed = false;
      if (e.key === "ArrowLeft") platform.leftKeyPressed = false;
    });
  
    playButton.addEventListener("click", function (e) {
      gameOn = !gameOn;
      updateCanvas();
      switchButton();
    });
    refreshButton.addEventListener("click", function (e) {
      initGame();
      if (!gameOn) {
        gameOn = true;
        updateCanvas();
        playButton.removeAttribute("disabled");
      }
    });
  
    initGame();
  });
  
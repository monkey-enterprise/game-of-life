const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 1500; // px/s^2
const RESTITUTION = 0.85; // fraction of speed kept after a bounce
const RADIUS = 24;

const ball = { x: 0, y: 0, vx: 300, vy: 0 };

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function throwFrom(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 600 + Math.random() * 600;
  ball.x = x;
  ball.y = y;
  ball.vx = Math.cos(angle) * speed;
  ball.vy = Math.sin(angle) * speed;
}

function step(dt) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  ball.vy += GRAVITY * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x < RADIUS) {
    ball.x = RADIUS;
    ball.vx = Math.abs(ball.vx) * RESTITUTION;
  } else if (ball.x > w - RADIUS) {
    ball.x = w - RADIUS;
    ball.vx = -Math.abs(ball.vx) * RESTITUTION;
  }

  if (ball.y < RADIUS) {
    ball.y = RADIUS;
    ball.vy = Math.abs(ball.vy) * RESTITUTION;
  } else if (ball.y > h - RADIUS) {
    ball.y = h - RADIUS;
    ball.vy = -Math.abs(ball.vy) * RESTITUTION;
    // Floor friction so the ball eventually comes to rest.
    ball.vx *= 0.99;
  }
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#f5a623";
  ctx.fill();
}

let last = performance.now();
function frame(now) {
  // Clamp dt so a backgrounded tab doesn't make the ball jump.
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;
  step(dt);
  draw();
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resize);
canvas.addEventListener("click", (e) => throwFrom(e.clientX, e.clientY));

resize();
ball.x = window.innerWidth / 2;
ball.y = window.innerHeight / 3;
requestAnimationFrame(frame);

let basePoints = [];
let balloons = [];
let stars = [];
let celebrated = false;
let drawIndex = 0;

let yesBox = { x: 0, y: 0, w: 80, h: 30, scale: 1, targetScale: 1, opacity: 0 };
let noBox = { x: 0, y: 0, w: 80, h: 30, scale: 1, targetScale: 1, opacity: 0 };
let noClicks = 0;

let yayOpacity = 0;
let heartFillAlpha = 0;

let yayHearts = [];
let giftOpened = false;
let roseY = 0;
let roseEmojiSize = 0;
let roseTargetY = 0;
let giftBox = { x: 0, y: 0, w: 80, h: 60, lidY: 0, burst: 0 };

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  textSize(24);

  for (let i = 0; i < TWO_PI; i += TWO_PI / 1200) {
    let x = 16 * pow(sin(i), 3);
    let y = 13 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i);
    basePoints.push({ x: x, y: -y });
  }

  for (let i = 0; i < 35; i++) {
    stars.push({ x: random(width), y: random(height) });
  }
}

function draw() {
  background(0, 25);

  if (!celebrated) {
    drawRainbowStars();
    drawHeartDynamic();

    if (heartFillAlpha >= 170) {
      fadeInButtonsAndText();
      drawText();
      spawnBalloons();
      drawBalloons();
      drawButtons();
    }
  } else {
    drawCreativeYay();
    drawGiftWithRose();
  }
}

function drawHeartDynamic() {
  let tOutline = (sin(frameCount * 0.03) + 1) / 2;
  let rO = lerp(255, 255, tOutline);
  let gO = lerp(100, 180, tOutline);
  let bO = lerp(120, 150, tOutline);
  stroke(rO, gO, bO);
  strokeWeight(2 + 1.5 * sin(frameCount * 0.1));
  noFill();

  let half = int(drawIndex / 2);

  beginShape();
  for (let i = half; i >= 0; i--) vertex(width / 2 + basePoints[i].x * 18, height / 2 + basePoints[i].y * 18);
  endShape();

  beginShape();
  for (let i = basePoints.length - 1 - half; i < basePoints.length; i++) vertex(width / 2 + basePoints[i].x * 18, height / 2 + basePoints[i].y * 18);
  endShape();

  if (drawIndex < basePoints.length - 1) drawIndex += 6;

  if (drawIndex >= basePoints.length - 1 && heartFillAlpha < 180) heartFillAlpha += 0.5;

  if (drawIndex >= basePoints.length - 1) {
    noStroke();
    let tFill = (sin(frameCount * 0.02) + 1) / 2;
    let rF = lerp(255, 220, tFill);
    let gF = lerp(182, 100, tFill);
    let bF = lerp(193, 150, tFill);
    fill(rF, gF, bF, heartFillAlpha);
    beginShape();
    for (let p of basePoints) vertex(width / 2 + p.x * 18, height / 2 + p.y * 18);
    endShape(CLOSE);
  }
}

function fadeInButtonsAndText() {
  yesBox.opacity = lerp(yesBox.opacity, 255, 0.05);
  noBox.opacity = lerp(noBox.opacity, 255, 0.05);
}

function drawText() {
  noStroke();
  fill(255, yesBox.opacity);
  textFont('Britannic Bold');
  textSize(48);
  text("I LOVE YOU", width / 2, height / 2 - 50);
  textFont('Felix Titling');
  textSize(24);
  text("will you be my girlfriend, Shree? <3", width / 2, height / 2 - 10);
}

function drawRainbowStars() {
  for (let s of stars) {
    stroke(
      127 + 127 * sin(frameCount * 0.05 + s.x * 0.01),
      127 + 127 * sin(frameCount * 0.03 + s.y * 0.02),
      127 + 127 * sin(frameCount * 0.07)
    );
    strokeWeight(2);
    point(s.x, s.y);
  }
}

function spawnBalloons() {
  if (random() < 0.02) {
    balloons.push({
      x: width / 2 + random(-200, 200),
      y: height / 2 + random(-200, 200),
      size: random(10, 20),
      vy: random(-0.5, -1.5),
      vx: random(-0.5, 0.5),
      angle: random(TWO_PI),
      angleSpeed: random(-0.02, 0.02),
      color: color(random(200, 255), random(50, 200), random(100, 255))
    });
  }
}

function drawBalloons() {
  for (let b of balloons) {
    fill(b.color);
    noStroke();
    beginShape();
    for (let t = 0; t < TWO_PI; t += TWO_PI / 100) {
      let x = 16 * pow(sin(t), 3);
      let y = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
      vertex(b.x + x * b.size / 8, b.y - y * b.size / 8);
    }
    endShape(CLOSE);
    stroke(200);
    line(b.x, b.y + b.size, b.x, b.y + b.size + 20);
    b.angle += b.angleSpeed;
    b.x += b.vx + sin(b.angle) * 0.5;
    b.y += b.vy;
  }
}

function drawButtons() {
  yesBox.x = width / 2 - 110;
  yesBox.y = height / 2 + 100;
  noBox.x = width / 2 + 20;
  noBox.y = height / 2 + 100;

  yesBox.scale = lerp(yesBox.scale, yesBox.targetScale, 0.1);
  noBox.scale = lerp(noBox.scale, noBox.targetScale, 0.1);

  push();
  translate(yesBox.x + yesBox.w / 2, yesBox.y + yesBox.h / 2);
  scale(yesBox.scale);
  fill(255, 105, 180, yesBox.opacity);
  stroke(255, yesBox.opacity);
  strokeWeight(2);
  rectMode(CENTER);
  rect(0, 0, yesBox.w, yesBox.h, 8);
  noStroke();
  fill(255, yesBox.opacity);
  textSize(12);
  text("YES", 0, 0);
  pop();

  if (noClicks < 3) {
    push();
    translate(noBox.x + noBox.w / 2, noBox.y + noBox.h / 2);
    scale(noBox.scale);
    fill(255, 105, 180, noBox.opacity);
    stroke(255, noBox.opacity);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, noBox.w, noBox.h, 8);
    noStroke();
    fill(255, noBox.opacity);
    textSize(12);
    text("NO", 0, 0);
    pop();
  }
}

function mousePressed() {
  if (!celebrated && drawIndex >= basePoints.length - 1) {
    if (
      mouseX > yesBox.x && mouseX < yesBox.x + yesBox.w &&
      mouseY > yesBox.y && mouseY < yesBox.y + yesBox.h
    ) {
      celebrated = true;
      for (let i = 0; i < 20; i++) {
        yayHearts.push({
          x: random(width / 2 - 100, width / 2 + 100),
          y: random(height / 2 - 100, height / 2 + 100),
          size: random(10, 30),
          alpha: 0,
          speed: random(0.5, 1)
        });
      }
      giftBox.x = width / 2 - 40;
      giftBox.y = height / 2 + 150;
      roseY = giftBox.y;
      roseEmojiSize = 0;
      roseTargetY = height / 2 - 50; // rose stays above YAY text
    }

    if (
      noClicks < 3 &&
      mouseX > noBox.x && mouseX < noBox.x + noBox.w &&
      mouseY > noBox.y && mouseY < noBox.y + noBox.h
    ) {
      noClicks++;
      noBox.targetScale *= 0.6;
      yesBox.targetScale *= 1.3;
    }
  }

  if (
    celebrated &&
    mouseX > giftBox.x && mouseX < giftBox.x + giftBox.w &&
    mouseY > giftBox.y && mouseY < giftBox.y + giftBox.h
  ) {
    giftOpened = true;
    giftBox.burst = 1;
  }
}

function drawCreativeYay() {
  background(0);
  for (let s of stars) {
    stroke(255, random(50, 255));
    strokeWeight(2);
    point(s.x, s.y);
  }

  for (let h of yayHearts) {
    h.alpha = lerp(h.alpha, 255, 0.05);
    fill(255, 50, 150, h.alpha);
    noStroke();
    ellipse(h.x, h.y, h.size + 5 * sin(frameCount * 0.1), h.size + 5 * sin(frameCount * 0.1));
    h.y -= h.speed;
  }

  yayOpacity = lerp(yayOpacity, 255, 0.05);
  fill(255, yayOpacity);
  textFont('Britannic Bold');
  textSize(60 + 5 * sin(frameCount * 0.1));
  text("YAYYY 💖", width / 2, height / 2);
}

function drawGiftWithRose() {
  // gift box
  push();
  translate(giftBox.x + giftBox.w / 2, giftBox.y + giftBox.h / 2);

  // lid
  push();
  rotate(-PI / 4 * giftBox.burst);
  fill(255, 0, 150);
  rect(0, -giftBox.h / 2, giftBox.w, giftBox.h / 4);
  pop();

  // box body
  fill(255, 0, 150);
  rect(0, 0, giftBox.w, giftBox.h);
  pop();

  // rose rising to target position
  if (giftOpened) {
    roseY = lerp(roseY, roseTargetY, 0.05);
    roseEmojiSize = lerp(roseEmojiSize, 50, 0.05);
    textSize(roseEmojiSize);
    text("🌹", giftBox.x + giftBox.w / 2, roseY);

    // sparkles
    for (let i = 0; i < 3; i++) {
      let px = giftBox.x + giftBox.w / 2 + random(-15, 15);
      let py = roseY + random(-15, 15);
      stroke(255, 255, random(150, 255));
      strokeWeight(2);
      point(px, py);
    }
  }

  // arrow + text
  fill(255);
  textFont('Felix Titling');
  textSize(20);
  text("Here's a little gift!", giftBox.x + giftBox.w / 2, giftBox.y - 40);
  stroke(255);
  strokeWeight(3);
  line(giftBox.x + giftBox.w / 2, giftBox.y - 30, giftBox.x + giftBox.w / 2, giftBox.y - 10);
  line(giftBox.x + giftBox.w / 2, giftBox.y - 30, giftBox.x + giftBox.w / 2 - 5, giftBox.y - 25);
  line(giftBox.x + giftBox.w / 2, giftBox.y - 30, giftBox.x + giftBox.w / 2 + 5, giftBox.y - 25);
}
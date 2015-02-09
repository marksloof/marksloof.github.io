'use strict';
/*jshint globalstrict: true*/
/*global
    $,
    Rx
*/

var canvas = $('#myCanvas'),
    fieldCanvas = $('#fieldCanvas');

canvas.attr({width:1024,height:200});
fieldCanvas.attr({width:1024,height:200});

var drawField = function () {
    var field = fieldCanvas[0].getContext('2d');
    field.beginPath();
    field.rect(0, 0, canvas.width(), canvas.height());
    field.fillStyle = 'green';
    field.fill();
};
drawField();

//var canvas = document.getElementById('myCanvas');
var context = canvas[0].getContext('2d');
var inc = 10, paddleMiss = false,
    paddle = { x: 188, y: 153, width: 200, height: 20, linewidth: 7 },
    ball = { x: 200, y: 90, radius: 10, directionX: 15, directionY: 10 };

var drawPaddle = function () {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = paddle.linewidth;
    context.strokeStyle = '#CCCC00';
    context.stroke();
};

var clearPaddle = function () {
    context.clearRect(paddle.x - paddle.linewidth,
                 paddle.y - paddle.linewidth,
                 paddle.x + paddle.width + 2 * paddle.linewidth,
                 paddle.height + 2 * paddle.linewidth);
};

var movePaddle = function (x) {
    clearPaddle();
    paddle.x = x;
    drawPaddle();
};

var drawBall = function () {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
};

var clearBall = function () {
    context.clearRect(ball.x - ball.radius - 2,
                     ball.y - ball.radius - 2,
                     ball.x + 2 * (ball.radius + 2),
                     ball.y + 2 * (ball.radius + 2));
};

var moveBall = function (coords) {
    clearBall();
    ball.x = coords[0];
    ball.y = coords[1];
    drawBall();
    drawPaddle();
};

var collisionWall = function () {
    if ((ball.y-ball.radius) <= 0) {
        ball.directionY = -1 * ball.directionY;
    }
    if ((ball.x + ball.radius) >= canvas.width() || (ball.x - ball.radius) <= 0) {
        ball.directionX = -1 * ball.directionX;
    }
};

var ballOut = function () {
    if (ball.y-ball.radius >= canvas.height()) {
        ticker.dispose();
    }
};

var paddleHit = function () {
    if (paddleMiss === false && (ball.y + ball.radius) >= paddle.y - paddle.linewidth) {
        if ((ball.x+ball.radius) >= paddle.x && (ball.x-ball.radius) <= (paddle.x + paddle.width)) {
            ball.directionY = -1 * ball.directionY;
        } else {
            paddleMiss = true;
            mouseMoveStream.dispose();
        }
    }
};

var ticker = Rx.Observable.timer(1000, 100)
    .map(collisionWall)
    .map(ballOut)
    .map(paddleHit)
    .map(function () {
        return [ball.x + ball.directionX, ball.y + ball.directionY];
    })
    .subscribe(moveBall);

// move the Paddle with the mouse
var mouseMoveStream = canvas.mousemoveAsObservable()
    .filter(function (e) {
        // only when the mouse is inside the paddle.
        return e.offsetY >= paddle.y && e.offsetY <= paddle.y + paddle.height;
    })
    .map(function (e) {
        // mouse pointer in the middle of the paddle
        return e.offsetX - (paddle.width / 2);
    })
    .subscribe(movePaddle);

drawPaddle();
drawBall('red');

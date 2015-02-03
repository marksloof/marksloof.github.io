'use strict';
/*jshint globalstrict: true*/
/*global
    $,
    Rx
*/

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var inc = 10,
    paddle = { x: 188, y: 150, width: 200, height: 20, linewidth: 7 },
    ball = { x: 200, y: 100, radius: 10, directionX: 15, directionY: 10 };

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
    context.beginPath();
    context.fillStyle = 'white';
    context.rect(paddle.x - paddle.linewidth,
                 paddle.y - paddle.linewidth,
                 paddle.x + paddle.width + 2 * paddle.linewidth,
                 paddle.height + 2 * paddle.linewidth);
    context.fill();
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
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius + 2, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
};

var moveBall = function (coords) {
    clearBall();
    ball.x = coords[0];
    ball.y = coords[1];
    drawBall();
};

var ticker = Rx.Observable.timer(1000, 100)
    .map(function () {
        if (ball.y <= 0) {
            ball.directionY = -1 * ball.directionY;
        }
        if ((ball.y + ball.radius) >= paddle.y - paddle.linewidth) {
            if (ball.x >= paddle.x && ball.x <= (paddle.x + paddle.width)) {
                ball.directionY = -1 * ball.directionY;
            } else {
                ticker.dispose();
                mouseMoveStream.dispose();
            }
        }
        if ((ball.x + ball.radius) >= 1024 || (ball.x - ball.radius) <= 0) {
            ball.directionX = -1 * ball.directionX;
        }
        return [ball.x + ball.directionX, ball.y + ball.directionY];
    })
    .subscribe(moveBall);

// move the Paddle with the mouse
var mouseMoveStream = $('#myCanvas').mousemoveAsObservable()
    .filter(function (e) {
        // only when the mouse is inside the paddle.
        return e.offsetY >= paddle.y && e.offsetY <= paddle.y + paddle.height;
    })
    .map(function (e) {
        // mouse pointer in the middle of the paddle
        return e.offsetX - paddle.width / 2;
    })
    .subscribe(movePaddle);

drawPaddle();
drawBall('red');

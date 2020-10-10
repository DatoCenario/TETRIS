canvas = document.getElementById("canvas");
context = canvas.getContext("2d");

function handleCanvasSize() {
    canvas.width = (window.innerWidth * 90) / 200;
    canvas.height = (window.innerHeight * 90) / 100;
    canvas.style.setProperty('left', (window.innerWidth - canvas.width) / 2 + 'px');
    canvas.style.setProperty('top', (window.innerHeight - canvas.height) / 2 + 'px');
}

handleCanvasSize();

window.onresize = handleCanvasSize;


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function onResize(element, callback) {
    var elementHeight = element.height,
        elementWidth = element.width;
    setInterval(function () {
        if (element.height !== elementHeight || element.width !== elementWidth) {
            elementHeight = element.height;
            elementWidth = element.width;
            callback();
        }
    }, 300);
}

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function getRandomFigure(width) {
    let choose = randomInteger(0, 2);
    let xpos;
    switch (choose) {
        case 0:
            xpos = randomInteger(0, width - 1);
            return ['-', getRandomColor(), [xpos, 0], [xpos, 1], [xpos, 2], [xpos, 3]];
        case 1:
            xpos = randomInteger(1, width - 1);
            return ['l', getRandomColor(), [xpos, 0], [xpos, 1], [xpos, 2], [xpos, 3], [xpos - 1, 3]];
        case 2:
            xpos = randomInteger(1, width - 1);
            return ['s', getRandomColor(), [xpos, 0], [xpos, 1], [xpos - 1, 0], [xpos - 1, 1]];
    }
}

class Game {
    constructor(w, h, canvas) {
        this.canvas = canvas;
        this.width = w;
        this.height = h;
        this.count = w * h;
        this.chunkWidth = canvas.width / w;
        this.chunkHeight = canvas.height / h;
        this.map = []
        this.keysPressed = new Map();

        onResize(canvas, () => {
            this.chunkWidth = canvas.width / w;
            this.chunkHeight = canvas.height / h;
        });

        this.updateFigure();

        for (let i = 0; i < this.count; i++) {
            this.map.push('black');
        }
    }


    draw() {
        context.lineWidth = 10;
        context.strokeStyle = 'white';
        context.beginPath();
        for (let i = 0; i < this.width; i++) {
            for (let g = 0; g < this.height; g++) {
                context.rect(i * this.chunkWidth, g * this.chunkHeight, this.chunkWidth, this.chunkHeight);
                context.fillStyle = this.map[i * this.height + g];
                context.fillRect(i * this.chunkWidth, g * this.chunkHeight, this.chunkWidth, this.chunkHeight);
            }
        }
        context.fillStyle = this.figure[1];
        for (let g = 2; g < this.figure.length; g++) {
            context.fillRect(this.figure[g][0] * this.chunkWidth, this.figure[g][1] * this.chunkHeight,
                this.chunkWidth, this.chunkHeight);

            context.rect(this.figure[g][0] * this.chunkWidth, this.figure[g][1] * this.chunkHeight,
                this.chunkWidth, this.chunkHeight);
            context.fillStyle = this.figure[0];
        }

        context.stroke();
    }

    updateFigure() {
        this.figure = getRandomFigure(this.width);
    }


    updateDownLine()
    {
        let s = this.count - this.height;
        let e = this.count;
        let hasFigure = false;

        for (let g = s; g < e; g++) {
            if(this.map[g] === 'black')
            {
                return;
            }
            if(this.map[g - height] !== 'black')
            {
                hasFigure = true;
            }
        }

        t -= this.width;
        e -= this.width;

        for (let i = 0; g < this.height - 2 && hasFigure; g++) {
            for (let g = s; g < e; g++) {

            }
        }

    }

    figureMoveRight() {
        let collide = false;
        for (let g = 2; g < this.figure.length && !collide; g++) {
            if (this.figure[g][0] + 1 === this.width ||
                this.map[(this.figure[g][0] + 1) * this.height + this.figure[g][1]] !== 'black') {
                collide = true;
            }
        }

        if (!collide) {
            for (let g = 2; g < this.figure.length; g++) {
                this.figure[g][0]++;
            }
        }
    }

    figureMoveLeft() {
        let collide = false;
        for (let g = 2; g < this.figure.length && !collide; g++) {
            if (this.figure[g][0] - 1 === this.width ||
                this.map[(this.figure[g][0] - 1) * this.height + this.figure[g][1]] !== 'black') {
                collide = true;
            }
        }

        if (!collide) {
            for (let g = 2; g < this.figure.length; g++) {
                this.figure[g][0]--;
            }
        }
    }

    figureMoveDown() {
        let fall = false;
        for (let g = 2; g < this.figure.length && !fall; g++) {
            if (this.figure[g][1] + 1 === this.height ||
                this.map[this.figure[g][0] * this.height + this.figure[g][1] + 1] !== 'black') {
                fall = true;
            }
        }

        if (fall) {
            for (let k = 2; k < this.figure.length; k++) {
                this.map[this.figure[k][0] * this.height + this.figure[k][1]] = this.figure[1];
            }
            this.updateFigure();
            return;
        }
        else {
            for (let g = 2; g < this.figure.length; g++) {
                this.figure[g][1]++;
            }
        }
    }

    handleKeys() {
        this.keysPressed.forEach((v,k) => {
            switch (k) {
                case 39:
                    this.figureMoveRight();
                    break;
                case 37:
                    this.figureMoveLeft();
                    break;
                case 40:
                    this.figureMoveDown();
                    break;
            }
        })
    }

}


game = new Game(20, 20, canvas);


function timerTick() {
    game.draw();
    game.handleKeys();
}


function moveDown()
{
    game.figureMoveDown();
}


addEventListener('keydown', event => {
    if (!game.keysPressed.has(event.keyCode)) {
        game.keysPressed.set(event.keyCode);
    }
});

addEventListener('keyup', event => {
    if (game.keysPressed.has(event.keyCode)) {
        game.keysPressed.delete(event.keyCode);
    }
});

setInterval(timerTick, 50);
setInterval(moveDown, 500);



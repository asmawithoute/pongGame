//board
let board: HTMLCanvasElement;

const boardWidth: number = 900;
const boardHeight: number = 450;
let contex : CanvasRenderingContext2D | null = null;

const paddleWidth: number = 15; 
const paddleHeight: number = 80;
const paddleSpeed: number = 6; 

let gameStart : boolean = false;
let countDown = 3;
let gameCountDown : boolean = false;
let gameGO : boolean = false;

let winner : string | null = null;
const maxScore : number = 3;



let player1 = {
    x :  20,
    y :  boardHeight / 2 - paddleHeight / 2,
    color: "#0f3460",
    score : 0,
    step : 1,
};
let player2 = {
    x :  boardWidth - 20 - paddleWidth,
    y :  boardHeight / 2 - paddleHeight / 2,
    color: "#0f3460",
    score : 0,
    step : 1,

};

const net = {
    x :  boardWidth/2 - 10 /2,
    y : 5,
    width: 7,
    height : 25,
    color: "#16213e",       
};

const ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    radius : 15,
    color: "white",
    stepX : 5,
    stepY : 5,
};

const score={
    x_l : boardWidth/4,
    x_r : 3 * boardWidth/4,
    y : boardHeight/5,
    color: "white",
}

const keys: {[key:string] : boolean}={
    'w' : false,
    's' : false,
    'W' : false,
    'S' : false,
    'ArrowUp' : false,
    'ArrowDown' : false,
};

(function initGame() {
    board = document.getElementById("board") as HTMLCanvasElement;
    board.style.display = "block";
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");

    draw();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
})();

function handleKeyDown(event: KeyboardEvent)
{
    event.preventDefault();
    if(event.key in keys)
    {
        keys[event.key] = true;
    }
    if(event.code === "Space" && !gameStart && !gameCountDown && !winner)
    {
            // gameStart = true;
            gameCountDown = true;
            handleCountDown();   
    }
    if(event.code === "Space" && !gameStart && !gameCountDown && winner)
    {
        restartGame();
    }

    
}

function handleCountDown()
{
    if(gameCountDown)
    {
        let timer = setInterval(() => {

            countDown--;
            if(countDown <= 0)
            {
                clearInterval(timer);
                gameGO = true;
                setTimeout(() => { 
                gameGO = false;
                gameCountDown = false;
                gameStart = true;}, 1000);
                
            }
            
        }, 1000);
    }
}

function handleKeyUp(event: KeyboardEvent)
{
    if(event.key in keys)
    {
        keys[event.key] = false;
    }
   
}

function movePlayer()
{
    if(gameStart )
    {
        //p1
        if((keys['w'] || keys['W'] ) && player1.y > 0)
            player1.y -= player1.step * paddleSpeed;
        else if((keys['s'] || keys['S']) && player1.y < boardHeight - paddleHeight)
            player1.y += player1.step * paddleSpeed;

        //p2

        if(keys['ArrowUp'] && player2.y > 0)
            player2.y -= player2.step * paddleSpeed;
        else if(keys['ArrowDown'] && player2.y < boardHeight - paddleHeight)
            player2.y +=  player2.step * paddleSpeed;
    }
}

function moveBall()
{

    if(gameStart && !gameCountDown)
    {
        ball.x += ball.stepX;
        ball.y += ball.stepY;

        if(ball.y + ball.radius > boardHeight || ball.y - ball.radius < 0)
            ball.stepY = - ball.stepY;
            
        if(ball.stepX < 0)
        {
            if(ball.x - ball.radius <= player1.x + paddleWidth && 
           ball.x - ball.radius > player1.x &&
           ball.y + ball.radius >= player1.y && 
           ball.y - ball.radius <= player1.y + paddleHeight)
            {
                ball.stepX = Math.abs(ball.stepX);
                ball.x = ball.radius + player1.x + paddleWidth;
                let hitPos = (ball.y - player1.y) / paddleHeight;
                ball.stepY = (hitPos - 0.5) * 10;
            }
        }
        
        if(ball.stepX > 0)
        {
            if(ball.x + ball.radius >= player2.x && 
           ball.x + ball.radius < player2.x + paddleWidth &&
           ball.y + ball.radius >= player2.y && 
           ball.y - ball.radius <= player2.y + paddleHeight)
            {
                ball.stepX = -Math.abs(ball.stepX);
                ball.x = player2.x - ball.radius;
                let hitPos = (ball.y - player2.y) / paddleHeight;
                ball.stepY = (hitPos - 0.5) * 10;
            }
        }

        // hndle scores

        if(ball.x - ball.radius <= 0)
        {
            player2.score++;
            resetBall();
            checkWinner();
        }
        else if(ball.x + ball.radius >= boardWidth)
        {
            player1.score++;
            resetBall();
            checkWinner();
        }
    }
       
}

function checkWinner()
{
    if(player1.score == maxScore)
    {
        winner = "player1";
        gameStart = false;
    }
    else if(player2.score == maxScore)
    {
        winner = "player2";
        gameStart = false;
    }
}

function restartGame()
{
    player1.score = 0;
    player2.score = 0;

    ball.x = boardWidth/2;
    ball.y = boardHeight/2;
    ball.stepX = 5;
    ball.stepY = 5;

    player1.y = boardHeight / 2 - paddleHeight / 2;
    player2.y = boardHeight / 2 - paddleHeight / 2;

    winner = null;
    countDown = 3;
    gameCountDown = true;
    
    handleCountDown();

}


function  resetBall()
{
    ball.x = boardWidth/2;
    ball.y = boardHeight/2;

    ball.stepX = player1.score > player2.score ? 5 : -5;
    ball.stepY = (Math.random() < 0.5 ? -5 : 5);

}


function draw() {

    movePlayer();
    moveBall();

    drawBoard(0, 0, board.width, board.height);
    drawRect(player1.x, player1.y, paddleWidth, paddleHeight, player1.color);
    drawRect(player2.x, player2.y, paddleWidth, paddleHeight, player2.color);
    drawNet();
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    drawScore(score.x_l, score.y, player1.score, score.color);
    drawScore(score.x_r, score.y, player2.score, score.color);
    drawCountDown();
    drawWinner();
    if(!gameStart && !gameCountDown && !winner)
    {
        drawStart();
    }
   

    requestAnimationFrame(draw);
}

function drawBoard(x: number, y: number, w:number, h:number)
{
    if (!contex) return;
    // contex.fillStyle = "#490f5eff";
    contex.fillStyle = "#15152bff";
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}
 // draw paddle


function drawRect(x: number, y: number, w:number, h:number, color:string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}

// draw net 
function drawNet(){
    for(let i: number = 0; i <= boardHeight; i += 35)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
}

// draw ball
function drawBall(x: number, y: number, radius: number, color:string)
{
    if (!contex) return;

    contex.shadowBlur = 10;
    contex.shadowColor = "#ff3b94";

    contex.fillStyle = color;
    contex.beginPath();
    contex.arc(x, y, radius, 0, 2* Math.PI);
    contex.fill();

    contex.shadowBlur = 0;
}

//draw score

function drawScore(x: number, y:number, score: number, color: string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.font = "48px Arial";
    contex.textAlign = "center"; 
    contex.fillText(score.toString(), x, y);
}

function drawCountDown()
{
    if(countDown)
    {
        if (!contex) return;
        contex.fillStyle = "rgba(0, 0, 0, 0.7)";
        contex.fillRect(0, 0, boardWidth, boardHeight);
        contex.fillStyle = "white";
        contex.font = "bold 150px Arial";
        contex.textAlign = "center"; 
        contex.textBaseline = "middle";
        contex.fillText(countDown.toString(), boardWidth/2, boardHeight/2);
           
        contex.shadowBlur = 15;
        contex.fillStyle = "white";
        contex.font = "30px Arial";
        contex.fillText("GET READY", boardWidth / 2, boardHeight / 2 - 100);
       
        contex.shadowBlur = 0;
    }
    if(gameGO)
    {
        if (!contex) return;
        contex.fillStyle = "rgba(0, 0, 0, 0.7)";
        contex.fillRect(0, 0, boardWidth, boardHeight);
        contex.shadowBlur = 40;
        contex.shadowColor = "#8f37f3ff";
        contex.font = "bold 180px Arial";
        contex.fillStyle = "white";
        contex.textAlign = "center";
        contex.textBaseline = "middle";
        contex.fillText("GO!", boardWidth / 2, boardHeight / 2);
        
        contex.shadowBlur = 0;
    }
}

function drawWinner()
{
    
    if (!contex || !winner) return;
    contex.fillStyle = "rgba(0, 0, 0, 0.85)";
    contex.fillRect(0, 0, boardWidth, boardHeight);

    contex.shadowBlur = 20;
    contex.shadowColor = "#0244bdff";
    contex.fillStyle = "white";
    contex.font = "bold 70px Arial";
    contex.textAlign = "center"; 
    contex.textBaseline = "middle";
    contex.fillText(`${winner} WINS!`, boardWidth/2, boardHeight/2 - 50);
        
    contex.shadowBlur = 15;
    contex.fillStyle = "white";
    contex.font = "40px Arial";
    contex.fillText(`${player1.score} - ${player2.score}`, boardWidth / 2, boardHeight / 2 + 30);

    contex.shadowBlur = 10;
    contex.fillStyle = "white";
    contex.font = "25px Arial";
    contex.fillText("Press SPACE to play again", boardWidth / 2, boardHeight / 2 + 100);
    
    contex.shadowBlur = 0;
}

function drawStart()
{
    if (!contex) return;
    contex.fillStyle = "rgba(0, 0, 0, 1)";
    contex.fillRect(0, 0, boardWidth, boardHeight);
    contex.shadowBlur = 20;
    contex.shadowColor = "#9e58eeff";
    contex.fillStyle = "white";
    contex.font = "40px Arial";
    contex.textAlign = "center";
    contex.textBaseline = "middle";
    contex.fillText("Press SPACE to Start ", boardWidth / 2, boardHeight / 2);

    contex.font = "20px Arial";
    contex.fillStyle = "white";
    contex.fillText("Player 1: W/S | Player 2: ↑/↓", boardWidth / 2, boardHeight / 2 + 50);
    
    contex.shadowBlur = 0;
}
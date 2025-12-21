// Shared game utilities for both local and remote Pong games

// Export constants
export const boardWidth: number = 900;
export const boardHeight: number = 450;
export const paddleWidth: number = 15; 
export const paddleHeight: number = 80;
export const paddleSpeed: number = 6; 
export const ballRadius: number = 15;
export const maxScore: number = 3;

// Export drawing functions that can be used by both game modes
export function drawBoard(
    context: CanvasRenderingContext2D,
    x: number, 
    y: number, 
    w: number, 
    h: number
) {
    context.fillStyle = "#15152bff";
    context.beginPath();
    context.fillRect(x, y, w, h);
}

export function drawRect(
    context: CanvasRenderingContext2D,
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    color: string
) {
    context.fillStyle = color;
    context.beginPath();
    context.fillRect(x, y, w, h);
}

export function drawNet(
    context: CanvasRenderingContext2D,
    netX: number,
    netY: number,
    netWidth: number,
    netHeight: number,
    netColor: string,
    boardHeight: number
) {
    for(let i: number = 0; i <= boardHeight; i += 35) {
        drawRect(context, netX, netY + i, netWidth, netHeight, netColor);
    }
}

export function drawBall(
    context: CanvasRenderingContext2D,
    x: number, 
    y: number, 
    radius: number, 
    color: string
) {
    context.shadowBlur = 10;
    context.shadowColor = "#ff3b94";
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.shadowBlur = 0;
}

export function drawScore(
    context: CanvasRenderingContext2D,
    x: number, 
    y: number, 
    score: number, 
    color: string
) {
    context.fillStyle = color;
    context.font = "48px Arial";
    context.textAlign = "center"; 
    context.fillText(score.toString(), x, y);
}

export function drawCountDown(
    context: CanvasRenderingContext2D,
    countDown: number,
    gameGO: boolean,
    boardWidth: number,
    boardHeight: number
) {
    if(countDown > 0) {
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, boardWidth, boardHeight);
        context.fillStyle = "white";
        context.font = "bold 150px Arial";
        context.textAlign = "center"; 
        context.textBaseline = "middle";
        context.fillText(countDown.toString(), boardWidth/2, boardHeight/2);
           
        context.shadowBlur = 15;
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("GET READY", boardWidth / 2, boardHeight / 2 - 100);
        context.shadowBlur = 0;
    }
    
    if(gameGO) {
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, boardWidth, boardHeight);
        context.shadowBlur = 40;
        context.shadowColor = "#8f37f3ff";
        context.font = "bold 180px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("GO!", boardWidth / 2, boardHeight / 2);
        context.shadowBlur = 0;
    }
}

export function drawWinner(
    context: CanvasRenderingContext2D,
    winner: string | null,
    score1: number,
    score2: number,
    boardWidth: number,
    boardHeight: number
) {
    if (!winner) return;
    
    context.fillStyle = "rgba(0, 0, 0, 0.85)";
    context.fillRect(0, 0, boardWidth, boardHeight);

    context.shadowBlur = 20;
    context.shadowColor = "#0244bdff";
    context.fillStyle = "white";
    context.font = "bold 70px Arial";
    context.textAlign = "center"; 
    context.textBaseline = "middle";
    context.fillText(`${winner} WINS!`, boardWidth/2, boardHeight/2 - 50);
        
    context.shadowBlur = 15;
    context.fillStyle = "white";
    context.font = "40px Arial";
    context.fillText(`${score1} - ${score2}`, boardWidth / 2, boardHeight / 2 + 30);

    context.shadowBlur = 10;
    context.fillStyle = "white";
    context.font = "25px Arial";
    context.fillText("Press SPACE to play again", boardWidth / 2, boardHeight / 2 + 100);
    context.shadowBlur = 0;
}

export function drawWaitingForPlayer(
    context: CanvasRenderingContext2D,
    boardWidth: number,
    boardHeight: number
) {
    context.fillStyle = "rgba(0, 0, 0, 0.9)";
    context.fillRect(0, 0, boardWidth, boardHeight);
    context.shadowBlur = 20;
    context.shadowColor = "#9e58eeff";
    context.fillStyle = "white";
    context.font = "40px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Waiting for opponent...", boardWidth / 2, boardHeight / 2);
    context.shadowBlur = 0;
}

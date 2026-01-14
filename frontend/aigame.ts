//board
let aiboard: HTMLCanvasElement;

const aiboardWidth: number = 900;
const aiboardHeight: number = 450;
let aicontex : CanvasRenderingContext2D | null = null;

const aipaddleWidth: number = 15; 
const aipaddleHeight: number = 80;

const aipaddleSpeed: number = 10; 
let aigameStart : boolean = false;
let aicountDown = 3;
let aigameCountDown : boolean = false;
let aigameGO : boolean = false;

let aiwinner : string | null = null;
const aimaxScore : number = 3;



let aiplayer = {
    x :  20,
    y :  aiboardHeight / 2 - aipaddleHeight / 2,
    color: "#0f3460",
    score : 0,
    step : 1,
};

let realplayer = {
    x :  aiboardWidth - 20 - aipaddleWidth,
    y :  aiboardHeight / 2 - aipaddleHeight / 2,
    color: "#0f3460",
    score : 0,
    step : 1,
};

const ainet = {
    x :  aiboardWidth/2 - 10 /2,
    y : 5,
    width: 7,
    height : 25,
    color: "#16213e",       
};

const aiball = {
    x : aiboardWidth/2,
    y : aiboardHeight/2,
    radius : 15,
    color: "white",
    stepX : 5,
    stepY : 5,
};

const aiscore={
    x_l : aiboardWidth/4,
    x_r : 3 * aiboardWidth/4,
    y : aiboardHeight/5,
    color: "white",
}

const aikeys: {[key:string] : boolean}={
    'ArrowUp' : false,
    'ArrowDown' : false,
};

(function aiinitGame() {
    console.log("heeeeeeeeeeeeeeeeere");
    aiboard = document.getElementById("board") as HTMLCanvasElement;
    aiboard.style.display = "block";
    aiboard.height = aiboardHeight;
    aiboard.width = aiboardWidth;
    aicontex = aiboard.getContext("2d");

    aidraw();
    document.addEventListener("keydown", aihandleKeyDown);
    document.addEventListener("keyup", aihandleKeyUp);
})();

function aihandleKeyDown(event: KeyboardEvent)
{
    event.preventDefault();
    if(event.key in aikeys)
    {
        aikeys[event.key] = true;
    }
    if(event.code === "Space" && !aigameStart && !aigameCountDown && !aiwinner)
    {
            // aigameStart = true;
            aigameCountDown = true;
            aihandleCountDown();   
    }
    if(event.code === "Space" && !aigameStart && !aigameCountDown && aiwinner)
    {
        airestartGame();
    }
}

function aihandleCountDown()
{
    if(aigameCountDown)
    {
        let timer = setInterval(() => {

            aicountDown--;
            if(aicountDown <= 0)
            {
                clearInterval(timer);
                aigameGO = true;
                setTimeout(() => { 
                aigameGO = false;
                aigameCountDown = false;
                aigameStart = true;}, 1000);
                
            }
            
        }, 1000);
    }
}

function aihandleKeyUp(event: KeyboardEvent)
{
    if(event.key in aikeys)
    {
        aikeys[event.key] = false;
    }
   
}

function aimovePlayer()//this will move the ai aipaddle
{
    if(aigameStart)
    {
        
        if(aiball.x <= aiboardWidth / 4 && aiball.y <= aiboardHeight /2 && aiplayer.y > 0 )
            aiplayer.y -= aiplayer.step * aipaddleSpeed;
        else if(aiball.x <= aiboardWidth / 4 && aiball.y >= aiboardHeight /2 && aiplayer.y < aiboardHeight - aipaddleHeight)
            aiplayer.y += aiplayer.step * aipaddleSpeed;
        
        if(aikeys['ArrowUp'] && realplayer.y > 0)
            realplayer.y -= realplayer.step * aipaddleSpeed;
        else if(aikeys['ArrowDown'] && realplayer.y < aiboardHeight - aipaddleHeight)
            realplayer.y +=  realplayer.step * aipaddleSpeed;

        //hna 5asni nzid l moves dyal ai player
    }
}

function aimoveBall()
{

    if(aigameStart && !aigameCountDown)
    {
        aiball.x += aiball.stepX;
        aiball.y += aiball.stepY;

        if(aiball.y + aiball.radius > aiboardHeight || aiball.y - aiball.radius < 0)
            aiball.stepY = - aiball.stepY;
            
        if(aiball.stepX < 0)
        {
            if(aiball.x - aiball.radius <= aiplayer.x + aipaddleWidth && 
           aiball.x - aiball.radius > aiplayer.x &&
           aiball.y + aiball.radius >= aiplayer.y && 
           aiball.y - aiball.radius <= aiplayer.y + aipaddleHeight)
            {
                aiball.stepX = Math.abs(aiball.stepX);
                aiball.x = aiball.radius + aiplayer.x + aipaddleWidth;
                let hitPos = (aiball.y - aiplayer.y) / aipaddleHeight;
                aiball.stepY = (hitPos - 0.5) * 10;
            }
        }
        
        if(aiball.stepX > 0)
        {
            if(aiball.x + aiball.radius >= realplayer.x && 
           aiball.x + aiball.radius < realplayer.x + aipaddleWidth &&
           aiball.y + aiball.radius >= realplayer.y && 
           aiball.y - aiball.radius <= realplayer.y + aipaddleHeight)
            {
                aiball.stepX = -Math.abs(aiball.stepX);
                aiball.x = realplayer.x - aiball.radius;
                let hitPos = (aiball.y - realplayer.y) / aipaddleHeight;
                aiball.stepY = (hitPos - 0.5) * 10;
            }
        }

        // hndle scores

        if(aiball.x - aiball.radius <= 0)
        {
            realplayer.score++;
            airesetBall();
            aicheckWinner();
        }
        else if(aiball.x + aiball.radius >= aiboardWidth)
        {
            aiplayer.score++;
            airesetBall();
            aicheckWinner();
        }
    }
       
}

function aicheckWinner()
{
    if(aiplayer.score == aimaxScore)
    {
        aiwinner = "bot";
        aigameStart = false;
    }
    else if(realplayer.score == aimaxScore)
    {
        aiwinner = "YOU";
        aigameStart = false;
    }
}

function airestartGame()
{
    aiplayer.score = 0;
    realplayer.score = 0;

    aiball.x = aiboardWidth/2;
    aiball.y = aiboardHeight/2;
    aiball.stepX = 5;
    aiball.stepY = 5;

    aiplayer.y = aiboardHeight / 2 - aipaddleHeight / 2;
    realplayer.y = aiboardHeight / 2 - aipaddleHeight / 2;

    aiwinner = null;
    aicountDown = 3;
    aigameCountDown = true;
    
    aihandleCountDown();

}


function airesetBall()
{
    aiball.x = aiboardWidth/2;
    aiball.y = aiboardHeight/2;

    aiball.stepX = aiplayer.score > realplayer.score ? 5 : -5;
    aiball.stepY = (Math.random() < 0.5 ? -5 : 5);

}


function aidraw() {

    aimovePlayer();
    aimoveBall();

    aidrawBoard(0, 0, aiboard.width, aiboard.height);
    aidrawRect(aiplayer.x, aiplayer.y, aipaddleWidth, aipaddleHeight, aiplayer.color);
    aidrawRect(realplayer.x, realplayer.y, aipaddleWidth, aipaddleHeight, realplayer.color);
    aidrawNet();
    aidrawBall(aiball.x, aiball.y, aiball.radius, aiball.color);
    aidrawScore(aiscore.x_l, aiscore.y, aiplayer.score, aiscore.color);
    aidrawScore(aiscore.x_r, aiscore.y, realplayer.score, aiscore.color);
    aidrawCountDown();
    aidrawWinner();
    if(!aigameStart && !aigameCountDown && !aiwinner)
    {
        aidrawStart();
    }
   

    requestAnimationFrame(aidraw);
}

function aidrawBoard(x: number, y: number, w:number, h:number)
{
    if (!aicontex) return;
    // aicontex.fillStyle = "#490f5eff";
    aicontex.fillStyle = "#15152bff";
    aicontex.beginPath();
    aicontex.fillRect(x, y, w, h);
}


function aidrawRect(x: number, y: number, w:number, h:number, color:string)
{
    if (!aicontex) return;
    aicontex.fillStyle = color;
    aicontex.beginPath();
    aicontex.fillRect(x, y, w, h);
}

// draw net 
function aidrawNet(){
    for(let i: number = 0; i <= aiboardHeight; i += 35)
        aidrawRect(ainet.x, ainet.y + i, ainet.width, ainet.height, ainet.color);
}

// draw ball
function aidrawBall(x: number, y: number, radius: number, color:string)
{
    if (!aicontex) return;

    aicontex.shadowBlur = 10;
    aicontex.shadowColor = "#ff3b94";

    aicontex.fillStyle = color;
    aicontex.beginPath();
    aicontex.arc(x, y, radius, 0, 2* Math.PI);
    aicontex.fill();

    aicontex.shadowBlur = 0;
}

function aidrawScore(x: number, y:number, score: number, color: string)
{
    if (!aicontex) return;
    aicontex.fillStyle = color;
    aicontex.font = "48px Arial";
    aicontex.textAlign = "center"; 
    aicontex.fillText(score.toString(), x, y);
}

function aidrawCountDown()
{
    if(aicountDown)
    {
        if (!aicontex) return;
        aicontex.fillStyle = "rgba(0, 0, 0, 0.7)";
        aicontex.fillRect(0, 0, aiboardWidth, aiboardHeight);
        aicontex.fillStyle = "white";
        aicontex.font = "bold 150px Arial";
        aicontex.textAlign = "center"; 
        aicontex.textBaseline = "middle";
        aicontex.fillText(aicountDown.toString(), aiboardWidth/2, aiboardHeight/2);
           
        aicontex.shadowBlur = 15;
        aicontex.fillStyle = "white";
        aicontex.font = "30px Arial";
        aicontex.fillText("GET READY", aiboardWidth / 2, aiboardHeight / 2 - 100);
       
        aicontex.shadowBlur = 0;
    }
    if(aigameGO)
    {
        if (!aicontex) return;
        aicontex.fillStyle = "rgba(0, 0, 0, 0.7)";
        aicontex.fillRect(0, 0, aiboardWidth, aiboardHeight);
        aicontex.shadowBlur = 40;
        aicontex.shadowColor = "#8f37f3ff";
        aicontex.font = "bold 180px Arial";
        aicontex.fillStyle = "white";
        aicontex.textAlign = "center";
        aicontex.textBaseline = "middle";
        aicontex.fillText("GO!", aiboardWidth / 2, aiboardHeight / 2);
        
        aicontex.shadowBlur = 0;
    }
}

function aidrawWinner()
{
    
    if (!aicontex || !aiwinner) return;
    aicontex.fillStyle = "rgba(0, 0, 0, 0.85)";
    aicontex.fillRect(0, 0, aiboardWidth, aiboardHeight);

    aicontex.shadowBlur = 20;
    aicontex.shadowColor = "#0244bdff";
    aicontex.fillStyle = "white";
    aicontex.font = "bold 70px Arial";
    aicontex.textAlign = "center"; 
    aicontex.textBaseline = "middle";
    aicontex.fillText(`${aiwinner} WINS!`, aiboardWidth/2, aiboardHeight/2 - 50);
        
    aicontex.shadowBlur = 15;
    aicontex.fillStyle = "white";
    aicontex.font = "40px Arial";
    aicontex.fillText(`${aiplayer.score} - ${realplayer.score}`, aiboardWidth / 2, aiboardHeight / 2 + 30);

    aicontex.shadowBlur = 10;
    aicontex.fillStyle = "white";
    aicontex.font = "25px Arial";
    aicontex.fillText("Press SPACE to play again", aiboardWidth / 2, aiboardHeight / 2 + 100);
    
    aicontex.shadowBlur = 0;
}

function aidrawStart()
{
    if (!aicontex) return;
    aicontex.fillStyle = "rgba(0, 0, 0, 1)";
    aicontex.fillRect(0, 0, aiboardWidth, aiboardHeight);
    aicontex.shadowBlur = 20;
    aicontex.shadowColor = "#9e58eeff";
    aicontex.fillStyle = "white";
    aicontex.font = "40px Arial";
    aicontex.textAlign = "center";
    aicontex.textBaseline = "middle";
    aicontex.fillText("Press SPACE to Start ", aiboardWidth / 2, aiboardHeight / 2);

    aicontex.font = "20px Arial";
    aicontex.fillStyle = "white";
    aicontex.fillText("YOU : ↑/↓", aiboardWidth / 2, aiboardHeight / 2 + 50);
    
    aicontex.shadowBlur = 0;
}
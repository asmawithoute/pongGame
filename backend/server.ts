import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as SocketIOServer } from "socket.io";  

const waitingPlayers : string[] = [];
export const gameRooms = new Map<string, { player1: string, player2: string }>();

// Game state for each room
const gameStates = new Map<string, {
    ballX: number,
    ballY: number,
    ballStepX: number,
    ballStepY: number,
    player1_Y: number,
    player2_Y: number,
    score1: number,
    score2: number,
    gameEnd : boolean,
    winner : number,
}>();

const boardWidth = 900;
const boardHeight = 450;
const paddleHeight = 80;
const ballRadius = 15;

const server = Fastify({
    logger: true
});


server.get("/", async(request, reply) => {
    return {message: "Hello THERE !!"};
});

await server.register(fastifyCors, {
   origin: true,
    credentials: true
});

await server.listen({ port: 3001, host: '0.0.0.0' });

const gameSocket = new SocketIOServer(server.server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

function generateRoomID() : string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

}

gameSocket.on("connection", (socket) => {  
    socket.on("hello", (msg) => {
        console.log("!!!!!!!! Received from front:", msg);
        // socket.send("reply", "Hello from server!");
    });
    console.log("NEWWWWWWWWWWWW Client:", socket.id);
    waitingPlayers.push(socket.id);
    socket.on("findGame", () => {
        if(waitingPlayers.length >= 2)
        {
            console.log("kaynin 2 players: ", waitingPlayers);
        if (waitingPlayers[0] && waitingPlayers[1]) {
            let newRoomID = generateRoomID();
            while (gameRooms.has(newRoomID)) {
               newRoomID = generateRoomID();
            }
            console.log("new ROOM_ID ::::  ",newRoomID);
            gameRooms.set(newRoomID, {
            player1: waitingPlayers[0],
            player2: waitingPlayers[1]
        });

        const player1Socket = gameSocket.sockets.sockets.get(waitingPlayers[0]);
        const player2Socket = gameSocket.sockets.sockets.get(waitingPlayers[1]);

        player1Socket?.join(newRoomID);
        player2Socket?.join(newRoomID);

        player1Socket?.emit("gameStart", { roomID: newRoomID, role: "player1" });
        player2Socket?.emit("gameStart", { roomID: newRoomID, role: "player2" });
        
        gameStates.set(newRoomID, {
            ballX: boardWidth / 2,
            ballY: boardHeight / 2,
            ballStepX: 5,
            ballStepY: 5,
            player1_Y: boardHeight / 2 - paddleHeight / 2,
            player2_Y: boardHeight / 2 - paddleHeight / 2,
            score1: 0,
            score2: 0,
            gameEnd: false,
            winner: 0,
        });
        startGameLoop(newRoomID);
        // console.log("start gameeeeeee");
        console.log("here");
        waitingPlayers.splice(0,2);
        const room = gameRooms.get(newRoomID);
        // console.log(room?.player1);
        // console.log(room?.player2);
        // console.log("New room created:", newRoomID, gameRooms.get(newRoomID));
        }
    }
    });


    socket.on("paddleMove", (data: { roomID: string, role: string, y: number }) => {
        // console.log("paddle moved");
        const state = gameStates.get(data.roomID);
        if (state) {
            if (data.role === "player1") {
                state.player1_Y = data.y;
            } else if (data.role === "player2") {
                state.player2_Y = data.y;
            }
        }
        // startGameLoop(data.roomID);
    });

    socket.on("disconnect", () => {
        console.log("⚠️ Client disconnected:", socket.id);
        waitingPlayers.filter(id => id !== socket.id);
        // console.log("All player IDs after disconnect:", waitingPlayers);

    });
});

function startGameLoop(roomID: string) {
    const interval = setInterval(() => {
        const state = gameStates.get(roomID);
        const room = gameRooms.get(roomID);

        if (!state || !room) {
            clearInterval(interval);
            return;
        }

        state.ballX += state.ballStepX;
        state.ballY += state.ballStepY;

       
        if (state.ballY + ballRadius > boardHeight || state.ballY - ballRadius < 0) {
            state.ballStepY = -state.ballStepY;
        }

        const player1_X = 20;
        const paddleWidth = 15;
        if (state.ballStepX < 0) {
            if (state.ballX - ballRadius <= player1_X + paddleWidth &&
                state.ballX - ballRadius > player1_X &&
                state.ballY + ballRadius >= state.player1_Y &&
                state.ballY - ballRadius <= state.player1_Y + paddleHeight) {
                state.ballStepX = Math.abs(state.ballStepX);
                state.ballX = ballRadius + player1_X + paddleWidth;
            }
        }

        const player2_X = boardWidth - 20 - paddleWidth;
        if (state.ballStepX > 0) {
            if (state.ballX + ballRadius >= player2_X &&
                state.ballX + ballRadius < player2_X + paddleWidth &&
                state.ballY + ballRadius >= state.player2_Y &&
                state.ballY - ballRadius <= state.player2_Y + paddleHeight) {
                state.ballStepX = -Math.abs(state.ballStepX);
                state.ballX = player2_X - ballRadius;
            }
        }

        
        if (state.ballX - ballRadius <= 0) {
            state.score2++;
            resetBall(state);
        } else if (state.ballX + ballRadius >= boardWidth) {
            state.score1++;
            resetBall(state);
        }
        if (state.score1 === 3 )
        {
            state.gameEnd = true;
            state.winner = 1;
        }
        else if (state.score2 === 3)
        {
            state.gameEnd = true;
            state.winner = 2;
        }
        // console.log("game result :  ", state.gameEnd)
        gameSocket.to(roomID).emit("gameUpdate", state);
    }, 1000 / 60); // 60 FPS
}

function resetBall(state: any) {
    state.ballX = boardWidth / 2;
    state.ballY = boardHeight / 2;
    state.ballStepX = state.score1 > state.score2 ? 5 : -5;
    state.ballStepY = Math.random() < 0.5 ? -5 : 5;
}

console.log("🚀 Server running on http://localhost:3001");
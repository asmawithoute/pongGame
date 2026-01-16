from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

def predict_action(game_state):
    ball_y = game_state.get('ball_y', 0)
    paddle_y = game_state.get('paddle_y', 0)
    paddle_height = game_state.get('paddle_height', 80)
    ball_x = game_state.get('ball_x', 0)
    board_width = game_state.get('board_width', 900)
    
    paddle_center = paddle_y + paddle_height / 2
    
    if ball_x < board_width / 2:
        if ball_y < paddle_center - 50:
            return "up"
        elif ball_y > paddle_center + 50:
            return "down"
    
    return "stay"


@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'data': 'Connected to AI prediction server'})


@socketio.on('disconnect')
def handle_disconnect():
    print(' Client disconnected')


@socketio.on('predict')
def handle_prediction(data):
    """
    Handle prediction request from backend.
    Receives game state and returns AI action.
    """
    # Get prediction
    action = predict_action(data)
    
    # Send back prediction
    emit('prediction', {'action': action})


@app.route('/')
def index():
    return {'message': 'AI Prediction Server is running', 'status': 'active'}


if __name__ == '__main__':
    print("=" * 50)
    print("Starting AI Prediction Server")
    print("=" * 50)
    print(" Running on: http://localhost:5000")
    print("=" * 50)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)

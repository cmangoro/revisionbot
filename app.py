from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load a pre-trained model for text generation
chatbot = pipeline("text-generation", model="gpt2")  # Use "gpt2" instead of "gpt-2"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    response = chatbot(user_message, max_length=50)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
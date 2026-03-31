import sys
import whisper
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
from langchain_core.messages import SystemMessage,HumanMessage,AIMessage
import os
groq_api_key = os.environ.get("GROQ_API_KEY")

file_path = sys.argv[1]  # received from Node.js

# 1️⃣ Transcribe audio using Whisper
model = whisper.load_model("base")  # or tiny/medium/large
result = model.transcribe(file_path)
speech_text = result['text']

# 2️⃣ Summarize with LLaMA
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=groq_api_key, 
    temperature=0.5,
    max_tokens=500
)

messages = [
    SystemMessage(content="You are an expert assistant in summarizing speeches."),
    HumanMessage(content=f"Provide a concise summary of the following speech:\n\n{speech_text}")
]

response = llm.invoke(messages)

print(response.content)  # Node.js will capture this
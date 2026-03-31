import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API Key and Base URL (Groq)
API_KEY = os.getenv("GROQ_API_KEY")
BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Initialize the client
client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

def query_past_conversations(query):
    """
    Let the AI answer questions about stored conversations using Groq.
    """
    try:
        prompt = (
            f"You are an assistant that answers questions about past conversations.\n"
            f"User question: {query}"
        )
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
        )
        answer = response.choices[0].message.content.strip()
        return answer, []
    except Exception as e:
        print("Groq Query Error:", e)
        return "Couldn't process the query right now.", []

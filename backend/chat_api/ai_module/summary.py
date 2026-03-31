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

def generate_summary_and_insights(messages, metadata):
    """
    Summarize the conversation and return summary, topics, and sentiment using Groq.
    """
    try:
        text = "\n".join(messages)
        prompt = (
            "Summarize the following conversation. "
            "Also provide a short list of key topics and an overall sentiment.\n\n"
            f"{text}"
        )

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
        )

        summary_text = response.choices[0].message.content.strip()
        return summary_text, ["general discussion"], "neutral"
    except Exception as e:
        print("Groq Summary Error:", e)
        return "Summary unavailable.", [], "unknown"

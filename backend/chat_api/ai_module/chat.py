import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API Key and Base URL (Groq)
API_KEY = os.getenv("OPENAI_API_KEY")
BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.groq.com/openai/v1")

if not API_KEY:
    print("⚠️ Warning: OPENAI_API_KEY not set in .env file.")

# Initialize the client
client = OpenAI(api_key=API_KEY, base_url=BASE_URL)


# 🧠 Function: Generate AI reply
def chat_reply(conversation, user_message: str) -> str:
    """
    Sends the user's message to Groq and gets an AI-generated response.
    """
    try:
        # Collect conversation history (up to last 10 messages)
        messages = [{"role": "assistant" if m.sender == "ai" else "user", "content": m.content} for m in conversation.messages.all()[:10]]
        messages.append({"role": "user", "content": user_message})

        # Call Groq model
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("⚠️ AI Chat Error:", e)
        return "⚠️ Sorry, the AI service is temporarily unavailable."


# 🧾 Function: Summarize entire conversation
def summarize_conversation(conversation) -> str:
    """
    Generates a short summary of the conversation using Groq.
    """
    try:
        # Combine all messages into one block
        text = "\n".join(
            [f"{m.sender.upper()}: {m.content}" for m in conversation.messages.all()]
        )

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Groq’s high-quality summarization model
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI summarizer. Summarize the chat conversation briefly.",
                },
                {"role": "user", "content": text},
            ],
            temperature=0.4,
        )

        summary = response.choices[0].message.content.strip()
        return summary

    except Exception as e:
        print("⚠️ Summary Error:", e)
        return "⚠️ Could not generate a summary for this chat."

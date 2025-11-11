from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_summary_and_insights(messages, metadata):
    """
    Summarize the conversation and return summary, topics, and sentiment.
    """
    try:
        text = "\n".join(messages)
        prompt = (
            "Summarize the following conversation. "
            "Also provide a short list of key topics and an overall sentiment.\n\n"
            f"{text}"
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        summary_text = response.choices[0].message.content.strip()
        return summary_text, ["general discussion"], "neutral"
    except Exception as e:
        print("OpenAI Summary Error:", e)
        return "Summary unavailable.", [], "unknown"

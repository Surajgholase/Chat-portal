from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def query_past_conversations(query):
    """
    Let the AI answer questions about stored conversations.
    (Later you can improve this by feeding it real past chat data.)
    """
    try:
        prompt = (
            f"You are an assistant that answers questions about past conversations.\n"
            f"User question: {query}"
        )
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )
        answer = response.choices[0].message.content.strip()
        return answer, []
    except Exception as e:
        print("OpenAI Query Error:", e)
        return "Couldn't process the query right now.", []

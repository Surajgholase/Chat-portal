import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/conversations"

def test_chat():
    print("🚀 Starting conversation...")
    res = requests.post(f"{BASE_URL}/start/", json={"title": "Test Chat"})
    if res.status_code != 200:
        print(f"❌ Failed to start conversation: {res.text}")
        return
    
    conv_id = res.json()["id"]
    print(f"✅ Conversation ID: {conv_id}")

    print("\n💬 Sending message: 'Hello Gemini, tell me a quick joke'...")
    res = requests.post(f"{BASE_URL}/send/", json={
        "conversation_id": conv_id,
        "content": "Hello Gemini, tell me a quick joke",
        "sender": "user"
    })
    
    if res.status_code == 200:
        print("\n🤖 AI Reply:")
        print(res.json()["ai_message"]["content"])
    else:
        print(f"\n❌ Failed to send message: {res.text}")

if __name__ == "__main__":
    test_chat()

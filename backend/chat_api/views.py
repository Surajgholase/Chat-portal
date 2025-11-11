from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
)

# ✅ Import AI helper functions (Groq/OpenAI)
try:
    from .ai_module.chat import chat_reply, summarize_conversation
except ImportError:
    # fallback if AI module not ready
    def chat_reply(conv, user_message):
        return "🤖 AI service not available right now."

    def summarize_conversation(messages):
        return "No AI summary generated.", [], "neutral"


# 🧾 List all conversations
class ConversationListAPI(generics.ListAPIView):
    queryset = Conversation.objects.all().order_by("-created_at")
    serializer_class = ConversationListSerializer


# 🔍 Get details of a specific conversation
class ConversationDetailAPI(generics.RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer
    lookup_field = "id"


# ➕ Start a new conversation
class StartConversationAPI(APIView):
    def post(self, request):
        title = request.data.get("title", "New Conversation")

        conv = Conversation.objects.create(
            title=title,
            status="active",
            start_time=timezone.now(),
        )

        return Response({
            "id": conv.id,
            "title": conv.title,
            "status": conv.status,
            "start_time": conv.start_time,
        })


# 💬 Send message and generate AI reply
class SendMessageAPI(APIView):
    def post(self, request):
        conv_id = request.data.get("conversation_id")
        content = request.data.get("content")
        sender = request.data.get("sender", "user")

        conv = get_object_or_404(Conversation, id=conv_id)

        # Save user message
        user_msg = Message.objects.create(
            conversation=conv,
            sender=sender,
            content=content
        )

        # Generate AI reply
        ai_reply = chat_reply(conv, content)
        ai_msg = Message.objects.create(
            conversation=conv,
            sender="ai",
            content=ai_reply
        )

        return Response({
            "user_message": MessageSerializer(user_msg).data,
            "ai_message": MessageSerializer(ai_msg).data,
        })


# 🏁 End a conversation and summarize
class EndConversationAPI(APIView):
    def post(self, request):
        conv_id = request.data.get("conversation_id")
        conv = get_object_or_404(Conversation, id=conv_id)

        conv.status = "ended"
        conv.end_time = timezone.now()

        summary = summarize_conversation(conv)

        conv.summary = summary
        conv.save()

        return Response({
            "id": conv.id,
            "summary": summary,
            "ended_at": conv.end_time,
        })


# 🔎 (Optional) Query old conversations (semantic search placeholder)
class QueryConversationAPI(APIView):
    def post(self, request):
        query = request.data.get("query", "")
        return Response({
            "answer": "This feature is coming soon.",
            "references": [],
        })

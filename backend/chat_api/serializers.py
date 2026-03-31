from rest_framework import serializers
from .models import Conversation, Message


# Serializer for individual messages
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


# Serializer for conversation list (overview)
class ConversationListSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "title", "start_time", "end_time", "status", "summary", "last_message")

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        return last_msg.content if last_msg else ""


# Serializer for a full conversation (with all messages)
class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = "__all__"

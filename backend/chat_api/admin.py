from django.contrib import admin
from django.utils.html import format_html
from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "status",
        "start_time",
        "end_time",
        "message_count",
        "latest_message_preview",
        "summary_short",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("title", "summary", "messages__content")
    readonly_fields = ("start_time", "end_time", "created_at")

    def message_count(self, obj):
        return obj.messages.count()

    message_count.short_description = "Messages"

    def latest_message_preview(self, obj):
        last = obj.messages.order_by("-timestamp").first()
        if not last:
            return "-"
        # show a short truncated preview
        text = last.content
        if len(text) > 75:
            text = text[:72] + "..."
        # escape/format simply
        return text

    latest_message_preview.short_description = "Latest message"

    def summary_short(self, obj):
        if not obj.summary:
            return "-"
        s = obj.summary
        return (s[:120] + "...") if len(s) > 120 else s

    summary_short.short_description = "Summary (short)"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "conversation", "sender", "timestamp", "content_preview")
    search_fields = ("content",)
    list_filter = ("sender",)

    def content_preview(self, obj):
        text = obj.content or ""
        if len(text) > 80:
            return text[:77] + "..."
        return text

    content_preview.short_description = "Content"

from django.db import models


class Conversation(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("ended", "Ended"),
    ]

    title = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Conversation {self.id}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=[("user", "User"), ("ai", "AI")])
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:40]}"

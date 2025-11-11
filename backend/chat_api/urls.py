from django.urls import path
from . import views

urlpatterns = [
    path('', views.ConversationListAPI.as_view(), name='conversations'),
    path('<int:id>/', views.ConversationDetailAPI.as_view(), name='conversation-detail'),
    path('start/', views.StartConversationAPI.as_view(), name='start-conversation'),
    path('send/', views.SendMessageAPI.as_view(), name='send-message'),
    path('end/', views.EndConversationAPI.as_view(), name='end-conversation'),
    path('query/', views.QueryConversationAPI.as_view(), name='query-conversation'),
]

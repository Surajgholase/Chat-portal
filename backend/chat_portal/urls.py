from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('', lambda request: HttpResponse("✅ Chat Portal API is running!"), name='home'),
    path('admin/', admin.site.urls),
    path('api/conversations/', include('chat_api.urls')),
]

from django.contrib import admin
from django.urls import path, include, re_path
from weather_app.views import index_view, serve_project_file

urlpatterns = [
    # 1. Trang chủ Website Thời tiết
    path('', index_view, name='home'),

    # 2. Django REST API
    path('api/weather/', include('weather_app.urls')),

    # 3. Django Admin
    path('admin/', admin.site.urls),

    # 4. Phục vụ tự động tài nguyên module (css/, js/, pages/, components/, assets/)
    re_path(r'^(?P<path>.*)$', serve_project_file, name='static_project_file'),
]

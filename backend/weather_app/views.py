from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def index_view(request):
    """Phục vụ trang chủ Frontend index.html trực tiếp tại http://127.0.0.1:8000/"""
    index_file = BASE_DIR.parent / 'index.html'
    if not index_file.exists():
        index_file = BASE_DIR.parent / 'frontend' / 'index.html'
    
    try:
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        return HttpResponse(content, content_type='text/html; charset=utf-8')
    except Exception as e:
        return HttpResponse(f"Không thể đọc index.html: {str(e)}", status=500)

def serve_project_file(request, path):
    """Phục vụ tài nguyên module (css/, js/, pages/, assets/...)"""
    file_path = BASE_DIR.parent / path
    if not file_path.exists():
        file_path = BASE_DIR.parent / 'frontend' / path

    if not file_path.exists() or file_path.is_dir():
        return HttpResponse("File không tồn tại", status=404)

    content_type = 'text/plain; charset=utf-8'
    if path.endswith('.css'):
        content_type = 'text/css; charset=utf-8'
    elif path.endswith('.js'):
        content_type = 'application/javascript; charset=utf-8'
    elif path.endswith('.html'):
        content_type = 'text/html; charset=utf-8'
    elif path.endswith('.png'):
        content_type = 'image/png'
    elif path.endswith('.jpg') or path.endswith('.jpeg'):
        content_type = 'image/jpeg'
    elif path.endswith('.svg'):
        content_type = 'image/svg+xml'

    try:
        with open(file_path, 'rb') as f:
            return HttpResponse(f.read(), content_type=content_type)
    except Exception as e:
        return HttpResponse(str(e), status=500)

def health_check(request):
    """Health check endpoint cho Docker / Load Balancer"""
    return JsonResponse({"status": "healthy", "service": "weather-api"})

def api_root(request):
    """Trang điều hướng API khi truy cập http://127.0.0.1:8000/api/weather/"""
    base_url = request.build_absolute_uri('/')[:-1]
    return JsonResponse({
        "name": "VietWeather Django REST API",
        "description": "Backend API quản lý, chuẩn hóa và cache dữ liệu thời tiết",
        "version": "1.0.0",
        "frontend_website": f"{base_url}/",
        "available_endpoints": {
            "health": f"{base_url}/api/weather/health/",
            "forecast": f"{base_url}/api/weather/forecast/?lat=21.0285&lon=105.8542&place=Hanoi",
            "current": f"{base_url}/api/weather/current/?lat=21.0285&lon=105.8542",
            "search": f"{base_url}/api/weather/search/?q=Hanoi",
            "favorites": f"{base_url}/api/weather/favorites/"
        }
    }, json_dumps_params={'ensure_ascii': False, 'indent': 2})

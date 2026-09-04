@echo off
chcp 65001 >nul
title VietWeather - Khoi Dong May Chu Thoi Tiet
color 0b

echo ========================================================
echo        🌦️ DỰ ÁN THỜI TIẾT THỜI GIAN THỰC VIETWEATHER
echo ========================================================
echo.

cd /d "%~dp0"

:: Tim duong dan Python trong moi truong ao
set "PYTHON_EXE="
if exist "backend\venv\Scripts\python.exe" (
    set "PYTHON_EXE=backend\venv\Scripts\python.exe"
) else if exist "backend\venv\bin\python.exe" (
    set "PYTHON_EXE=backend\venv\bin\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo [1/3] Kiem tra co so du lieu...
cd backend
"%~dp0%PYTHON_EXE%" manage.py migrate --noinput
cd ..

echo [2/3] Dang mo website tren trinh duyet...
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/"

echo [3/3] Dang khoi dong may chu Django tai 0.0.0.0:8000 (mo cho moi may trong mang LAN)
echo Truy cap tren may nay: http://localhost:8000/ hoac http://127.0.0.1:8000/
echo (Nhan Ctrl+C de dung may chu bat cu luc nao)
echo.
cd backend
"%~dp0%PYTHON_EXE%" manage.py runserver 0.0.0.0:8000

pause

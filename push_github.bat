@echo off
chcp 65001 >nul
title VietWeather - Dong Bo Ma Nguon Len GitHub
color 0a

echo ========================================================
echo        🚀 TỰ ĐỘNG ĐẨY MÃ NGUỒN LÊN GITHUB
echo        Kho luu tru: https://github.com/hongquang699/Web-weather
echo ========================================================
echo.

cd /d "%~dp0"

:: Tim duong dan Python
set "PYTHON_EXE="
if exist "backend\venv\Scripts\python.exe" (
    set "PYTHON_EXE=backend\venv\Scripts\python.exe"
) else if exist "backend\venv\bin\python.exe" (
    set "PYTHON_EXE=backend\venv\bin\python.exe"
) else (
    set "PYTHON_EXE=python"
)

set /p "COMMIT_MSG=Nhap ghi chu commit (Nhan Enter de lay tu dong): "

if "%COMMIT_MSG%"=="" (
    "%PYTHON_EXE%" github_service.py
) else (
    "%PYTHON_EXE%" github_service.py "%COMMIT_MSG%"
)

echo.
echo ========================================================
echo [Hoan tat] Da thuc hien xong! Nhan phim bat ky de thoat.
echo ========================================================
pause >nul

@echo off
chcp 65001 >nul
title MeteoLive - Cloudflare Public Tunnel
color 0e

echo ========================================================
echo        🌐 KHOI TAO DUONG TRUYEN CONG KHAI CLOUDFLARE
echo ========================================================
echo.

set "CF_EXE=C:\Users\HOA BINH\AppData\cloudflared.exe"

if not exist "%CF_EXE%" (
    echo [Loi] Khong tim thay cloudflared.exe tai: %CF_EXE%
    pause
    exit /b
)

echo Dang ket noi may chu http://localhost:8000 ra Internet toan cau...
echo Vui long doi trong giay lat de nhan link https://...trycloudflare.com
echo.
"%CF_EXE%" tunnel --url http://localhost:8000
pause

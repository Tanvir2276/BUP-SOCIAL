@echo off
title BUP Social (BUPSoCo) Launcher
echo ========================================================
echo   Starting BUP Social (BUPSoCo) - MySQL ^& Prisma Stack
echo   Bangladesh University of Professionals
echo ========================================================

echo [1/3] Ensuring MySQL Server is running...
start "BUP Social - MySQL" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone

timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend API Server (Port 5000)...
start "BUP Social - Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend React Application (Port 5173)...
start "BUP Social - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   BUP Social is running!
echo   Frontend App: http://localhost:5173
echo   Backend API:  http://localhost:5000
echo   BUP-GO Live:  https://bup-go-project-8njl.vercel.app/
echo ========================================================
pause

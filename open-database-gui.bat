@echo off
title BUP Social Database Viewer - Prisma Studio
echo ========================================================
echo   Launching BUP Social Database Visualizer (Prisma Studio)
echo   MySQL Database: bupsoc
echo ========================================================
echo.
echo Opening Prisma Studio at http://localhost:5555...
start http://localhost:5555
cd /d "%~dp0backend"
npx prisma studio --port 5555
pause

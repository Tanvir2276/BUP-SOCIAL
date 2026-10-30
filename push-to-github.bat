@echo off
title Push BUP Social to GitHub
echo ========================================================
echo        BUP Social (BUPSoCo) - GitHub Upload Tool
echo ========================================================
echo.

git remote remove origin >nul 2>&1
git remote add origin https://github.com/Tanvir2276/BUP-SOCIAL.git

echo [1/3] Staging all project files...
git add .

echo [2/3] Committing changes...
git commit -m "BUP Social (BUPSoCo) Master Full-Stack Release"

echo [3/3] Uploading to https://github.com/Tanvir2276/BUP-SOCIAL ...
git push -u origin main --force

echo.
echo ========================================================
echo [SUCCESS] Code pushed to GitHub successfully!
echo ========================================================
pause

@echo off
title Push BUP Social to GitHub
echo ========================================================
echo        BUP Social (BUPSoCo) - GitHub Upload Tool
echo ========================================================
echo.

git remote -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No remote origin found.
    set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/bup-social.git): "
    git remote add origin %REPO_URL%
)

echo [1/3] Staging all files...
git add .

echo [2/3] Committing changes...
git commit -m "Update BUP Social full-stack application"

echo [3/3] Pushing to GitHub main branch...
git push -u origin main

echo.
echo ========================================================
echo [SUCCESS] Code pushed to GitHub successfully!
echo ========================================================
pause

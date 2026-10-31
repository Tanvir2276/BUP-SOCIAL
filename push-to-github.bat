@echo off
title Push BUP Social to GitHub
echo ========================================================
echo        BUP Social (BUPSoCo) - GitHub Sync Tool
echo ========================================================
echo.

echo [1/3] Staging all files...
git add -A

echo [2/3] Checking commits...
git commit -m "Update BUP Social: routines, quiz engine, profile uploader, and CGPA calculator"

echo [3/3] Uploading to https://github.com/Tanvir2276/BUP-SOCIAL ...
git push origin main

echo.
echo ========================================================
echo [SUCCESS] Code pushed to GitHub successfully!
echo ========================================================
pause

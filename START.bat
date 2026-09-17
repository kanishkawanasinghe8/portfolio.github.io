@echo off
echo ============================================
echo   Mechanical Engineering Portfolio Server
echo ============================================
echo.
echo Starting local server on http://localhost:3000
echo Opening browser automatically...
echo.
echo [Keep this window open while browsing!]
echo [Close this window to stop the server.]
echo.
start "" "http://localhost:3000"
node "%~dp0server.js"
pause

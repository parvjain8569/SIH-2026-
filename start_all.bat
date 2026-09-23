@echo off
title BhoomiIntelli - SIH26018 Multi-Service Launcher
color 0A

echo =====================================================================
echo   BhoomiIntelli - Problem Statement SIH26018
echo   Intelligent Land Record Digitization and Validation System
echo =====================================================================
echo.
echo Checking prerequisites...

:: Check OCR Python Virtual Environment
if not exist "%~dp0ocr-service\.venv\Scripts\python.exe" (
    color 0C
    echo [WARNING] Python virtual environment not found in ocr-service\.venv!
    echo Please ensure the venv is created or install requirements.
    echo.
) else (
    echo [OK] OCR Service Virtual Environment detected.
)

:: Check Citizen Portal Node Modules
if not exist "%~dp0landrecord\node_modules" (
    echo [WARNING] node_modules missing in landrecord! Running npm install...
    call cmd /c "cd /d "%~dp0landrecord" && npm install"
) else (
    echo [OK] Citizen Portal dependencies detected.
)

:: Check Admin Portal Node Modules
if not exist "%~dp0Admin Portal\node_modules" (
    echo [WARNING] node_modules missing in Admin Portal! Running npm install...
    call cmd /c "cd /d "%~dp0Admin Portal" && npm install"
) else (
    echo [OK] Admin Portal dependencies detected.
)

echo.
echo =====================================================================
echo Launching all 3 microservices in dedicated consoles:
echo   [1] Backend & PaddleOCR Microservice  -> http://localhost:3001
echo   [2] Citizen Portal (Vite React 19)    -> http://localhost:5173
echo   [3] Admin Audit Portal (Port 5174)     -> http://localhost:5174
echo =====================================================================
echo.

:: 1. Start OCR & Dual DB Backend Service (FastAPI + PaddleOCR on port 3001)
start "BhoomiIntelli [1] - PaddleOCR & Backend (Port 3001)" cmd /k "title BhoomiIntelli OCR Service (Port 3001) && cd /d "%~dp0ocr-service" && .venv\Scripts\python.exe main.py"

:: 2. Start Citizen Portal (Port 5173)
start "BhoomiIntelli [2] - Citizen Portal (Port 5173)" cmd /k "title BhoomiIntelli Citizen Portal (Port 5173) && cd /d "%~dp0landrecord" && npm run dev"

:: 3. Start Admin Portal (Port 5174)
start "BhoomiIntelli [3] - Admin Audit Portal (Port 5174)" cmd /k "title BhoomiIntelli Admin Portal (Port 5174) && cd /d "%~dp0Admin Portal" && npm run dev"

echo.
echo All microservices are booting up in separate terminal windows!
echo.
echo Quick Access Links:
echo   - Citizen Portal: http://localhost:5173
echo   - Admin Portal:   http://localhost:5174
echo   - OCR Health:     http://localhost:3001/api/ocr/health
echo.
echo Press any key to close this launcher monitor window (servers will stay running).
pause >nul

@echo off
if defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title DISM Restore Health

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
color 0B
echo Restauration de l'image Windows (DISM /RestoreHealth)...
echo.
dism /online /cleanup-image /restorehealth
pause

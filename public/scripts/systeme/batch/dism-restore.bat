@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title DISM Restore Health
color 0B
echo Restauration de l'image Windows (DISM /RestoreHealth)...
echo.
dism /online /cleanup-image /restorehealth
pause

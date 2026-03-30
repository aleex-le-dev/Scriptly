@echo off
if defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title SFC /Scannow

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
color 0B
echo Analyse et reparation des fichiers systeme...
echo.
sfc /scannow
pause

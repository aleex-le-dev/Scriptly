@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title SFC /Scannow
color 0B
echo Analyse et reparation des fichiers systeme...
echo.
sfc /scannow
pause

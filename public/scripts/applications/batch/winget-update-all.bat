@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title Mise à jour de toutes les applications
color 0A
echo ================================================
echo     MISE A JOUR DE TOUTES LES APPLICATIONS
echo ================================================
echo.
winget update --all --accept-package-agreements --accept-source-agreements
echo.
echo Toutes les mises a jour ont ete appliquees.
pause

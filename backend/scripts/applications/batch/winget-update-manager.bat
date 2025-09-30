@echo off
chcp 65001 >nul
title Gestionnaire Mises à jour Applications - winget
color 0A

:: Vérifier privilèges administrateur
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Demande d'élévation des privilèges...
  powershell -Command "Start-Process '%~0' -Verb RunAs"
  exit /b
)

:menu
cls
echo ================================================
echo     GESTIONNAIRE WINGET - MISES A JOUR
echo ================================================
echo.
echo   1. winget update (liste et choix)
echo   2. winget update --all (tout mettre a jour)
echo   3. Quitter
echo.
set /p choice="Choisissez une option (1-3): "

if "%choice%"=="1" goto update_single
if "%choice%"=="2" goto update_all
if "%choice%"=="3" goto exit
goto menu

:update_single
cls
echo === winget update ===
winget update
echo.
echo Appuyez sur une touche pour revenir au menu...
pause >nul
goto menu

:update_all
cls
echo === winget update --all ===
winget update --all --accept-package-agreements --accept-source-agreements
echo.
echo Termine. Appuyez sur une touche pour revenir au menu...
pause >nul
goto menu

:exit
exit



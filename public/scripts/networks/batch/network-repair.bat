@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Reparation Reseau - By ALEEXLEDEV
color 0B

REM === AUTO-ELEVATION EN ADMINISTRATEUR ===
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Ce script requiert des privileges administrateur.
    echo Demande d'elevation en cours...
    timeout /t 2 >nul
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ================================
echo     Reparation reseau automatique
echo ================================
echo.
echo Etape 1 : Renouvellement de l'adresse IP...
ipconfig /release >nul
ipconfig /renew >nul

echo Etape 2 : Actualisation des parametres DNS...
ipconfig /flushdns >nul

echo Etape 3 : Reinitialisation des composants reseau...
netsh winsock reset >nul
netsh int ip reset >nul

echo.
echo Les parametres reseau ont ete actualises.
echo Un redemarrage est recommande pour un effet complet.
echo.
set /p restart_net=Souhaitez-vous redemarrer maintenant ? (O/N):
if /i "%restart_net%"=="O" (
    shutdown /r /t 5
) else (
    pause
    exit
)

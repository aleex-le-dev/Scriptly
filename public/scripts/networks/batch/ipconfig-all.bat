@echo off
chcp 65001 >nul
title Informations Reseau

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo Affichage des informations reseau...
ipconfig /all
pause
exit

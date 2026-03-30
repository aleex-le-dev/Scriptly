@echo off
chcp 65001 >nul
title Verification DISM CheckHealth

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo Verification de l'etat de Windows (DISM /CheckHealth)...
dism /online /cleanup-image /checkhealth
pause
exit

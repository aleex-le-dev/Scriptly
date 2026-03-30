@echo off
chcp 65001 >nul
title Analyse CHKDSK de tous les lecteurs

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ===============================================
echo Analyse avancee des erreurs sur tous les lecteurs...
echo ===============================================

for /f "delims=" %%d in ('powershell -NoProfile -Command "Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Free -ne $null } | ForEach-Object { $_.Name + ':' }"') do (
    echo.
    echo Analyse du lecteur %%d ...
    chkdsk %%d /f /r /x
)

echo.
echo Tous les lecteurs ont ete analyses.
pause
exit

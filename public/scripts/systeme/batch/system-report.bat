@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
title Generation de rapports systeme

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo Generation de rapports systeme separes...
echo.

for /f "usebackq delims=" %%d in (`powershell -NoProfile -Command "$env:USERPROFILE + '\Desktop'"`) do (
    set "DESKTOP=%%d"
)

for /f "usebackq delims=" %%t in (`powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"`) do (
    set "DATESTR=%%t"
)

set "SYS=%DESKTOP%\Infos_Systeme_%DATESTR%.txt"
set "NET=%DESKTOP%\Infos_Reseau_%DATESTR%.txt"
set "DRV=%DESKTOP%\Liste_Pilotes_%DATESTR%.txt"

echo Ecriture des informations systeme...
systeminfo > "%SYS%" 2>nul

echo Ecriture des informations reseau...
ipconfig /all > "%NET%" 2>nul

echo Ecriture de la liste des pilotes...
driverquery > "%DRV%" 2>nul

echo.
echo Rapports enregistres sur le Bureau.
pause
exit

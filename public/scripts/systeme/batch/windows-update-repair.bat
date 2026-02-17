@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
title Reparation Windows Update
color 0E
echo [1/4] Arret des services...
net stop wuauserv >nul 2>&1
net stop bits >nul 2>&1
net stop cryptsvc >nul 2>&1
net stop msiserver >nul 2>&1
echo [2/4] Renommage des dossiers...
ren "%windir%\SoftwareDistribution" "SoftwareDistribution.bak_%RANDOM%" 2>nul
ren "%windir%\System32\catroot2" "catroot2.bak_%RANDOM%" 2>nul
echo [3/4] Redemarrage des services...
net start wuauserv >nul 2>&1
net start bits >nul 2>&1
net start cryptsvc >nul 2>&1
net start msiserver >nul 2>&1
echo [4/4] Reparation terminee.
pause

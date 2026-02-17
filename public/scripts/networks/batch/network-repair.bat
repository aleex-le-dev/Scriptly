@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
title Reparation Reseau
color 0B
echo Renouvellement de l'adresse IP...
ipconfig /release >nul
ipconfig /renew >nul
echo Vidage DNS...
ipconfig /flushdns >nul
echo Reinitialisation Winsock/IP...
netsh winsock reset >nul
netsh int ip reset >nul
echo Termine. Redemarrage recommande.
pause

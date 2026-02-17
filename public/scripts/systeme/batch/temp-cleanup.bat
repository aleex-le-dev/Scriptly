@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
title Nettoyage Fichiers Temporaires
color 0C
echo Suppression des fichiers temporaires...
del /s /f /q %temp%\*.* 2>nul
del /s /f /q C:\Windows\Temp\*.* 2>nul
del /s /f /q "C:\Users\%USERNAME%\AppData\Local\Temp\*.*" 2>nul
echo Terminé.
pause

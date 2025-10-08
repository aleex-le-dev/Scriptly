@echo off
chcp 65001 >nul
title Lancement admin - Windows Maintenance Tool
setlocal

set "TARGET=%~dp0windows-maintenance-tool.bat"
if not exist "%TARGET%" (
  echo [ERREUR] Introuvable: %TARGET%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%TARGET%' -Verb RunAs"
exit /b 0



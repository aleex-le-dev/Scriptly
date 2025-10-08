@echo off
chcp 65001 >nul
title Lancement admin - winget update
setlocal

:: Lance le gestionnaire winget via PowerShell avec élévation UAC
set "PS_DIR=%~dp0..\powershells"
set "PS1=%PS_DIR%\winget-update-manager.ps1"
if not exist "%PS1%" (
  echo [ERREUR] Introuvable: %PS1%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Start-Process -FilePath 'powershell.exe' -Verb RunAs -WorkingDirectory '%PS_DIR%' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -NoExit -File "%PS1%"'"
exit /b 0



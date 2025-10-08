@echo off
chcp 65001 >nul
title Lancement admin - Menu contextuel classique
setlocal

set "TARGET=%~dp0context-menu-classic-toggle.bat"
if not exist "%TARGET%" (
  echo [ERREUR] Introuvable: %TARGET%
  pause
  exit /b 1
)

REM Lance le script cible avec élévation UAC
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%TARGET%' -Verb RunAs"
exit /b 0



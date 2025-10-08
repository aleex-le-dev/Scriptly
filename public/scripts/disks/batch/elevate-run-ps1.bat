@echo off
REM elevate-run-ps1.bat: Lance un script PowerShell avec élévation Admin.
REM Usage: elevate-run-ps1.bat <PS1_FILE_NAME>
setlocal

if "%~1"=="" (
  echo Usage: %~nx0 ^<PS1_FILE_NAME^>
  exit /b 1
)

set "SCRIPT_DIR=%~dp0\..\powershells\"
set "PS1_NAME=%~1"
set "PS1_PATH=%SCRIPT_DIR%%PS1_NAME%"

if not exist "%PS1_PATH%" (
  echo Fichier inexistant: %PS1_PATH%
  exit /b 2
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Start-Process -FilePath 'powershell.exe' -Verb RunAs -WorkingDirectory '%SCRIPT_DIR%' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -NoExit -File \"%PS1_PATH%\"'"

endlocal




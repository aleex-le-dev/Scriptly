@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "PS1_NAME=bitlocker-off.ps1"
set "PS1_PATH=%SCRIPT_DIR%%PS1_NAME%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Start-Process -FilePath 'powershell.exe' -Verb RunAs -WorkingDirectory '%SCRIPT_DIR%' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -NoExit -File \"%PS1_PATH%\"'"

endlocal

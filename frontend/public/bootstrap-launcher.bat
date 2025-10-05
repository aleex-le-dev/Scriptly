@echo off
setlocal enableextensions enabledelayedexpansion

REM Bootstrap: register custom protocol script-launcher:// to start local agent with URL
set PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe
set SCRIPT=%~dp0start-agent.ps1

reg add "HKCR\script-launcher" /ve /t REG_SZ /d "URL:Script Launcher" /f >nul 2>&1
reg add "HKCR\script-launcher" /v "URL Protocol" /t REG_SZ /d "" /f >nul 2>&1
reg add "HKCR\script-launcher\shell\open\command" /ve /t REG_SZ /d "\"%PS%\" -NoProfile -ExecutionPolicy Bypass -NoExit -File \"%SCRIPT%\" -Url \"%%1\"" /f >nul 2>&1

echo Protocol script-launcher:// enregistre.
echo Exemple: script-launcher://run?run=winget,chkdsk

"%PS%" -NoProfile -ExecutionPolicy Bypass -NoExit -File "%SCRIPT%" -Port 3001

endlocal


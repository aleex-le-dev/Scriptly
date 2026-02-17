@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title Gestion des Mots de Passe Wi-Fi
color 0A
setlocal enabledelayedexpansion
set "OUTPUT=%USERPROFILE%\Desktop\Wifi_Mots_de_passe.txt"
set "MAPFILE=%TEMP%\wifi_map_%RANDOM%.txt"
if exist "%MAPFILE%" del "%MAPFILE%" >nul 2>&1
set found=0
for /f "tokens=2 delims=:" %%I in ('netsh wlan show profiles ^| findstr /R /I /C:"All User Profile" /C:"Profil"') do (
	set "ssid=%%I"
	set "ssid=!ssid:~1!"
	if not "!ssid!"=="" (
		set "pwd="
		for /f "tokens=2 delims=:" %%K in ('netsh wlan show profile name^="!ssid!" key^=clear ^| findstr /I /R /C:"Key Content" /C:"Contenu de la cl"') do (
			set "pwd=%%K"
		)
		set "pwd=!pwd:~1!"
		if "!pwd!"=="" set "pwd=(Aucun)"
		>>"%MAPFILE%" echo !ssid!^|!pwd!
		set found=1
	)
)
cls
echo Profils Wi-Fi trouves:
echo.
set /a idx=0
for /f "tokens=1,2 delims=|" %%A in ('type "%MAPFILE%"') do (
	set /a idx+=1
	echo  [!idx!] SSID: %%A ^| MDP: %%B
)
echo.
echo ===============================================
echo   [1] Supprimer un reseau Wi-Fi
echo   [2] Generer un rapport sur le Bureau
echo   [0] Quitter
echo ===============================================
set /p wchoice=Votre choix: 
if "%wchoice%"=="1" goto wifi_del
if "%wchoice%"=="2" goto wifi_report
if "%wchoice%"=="0" goto wifi_exit
goto wifi_exit

:wifi_del
echo.
set /p delidx=Entrez le numero a supprimer (0 pour annuler): 
if "%delidx%"=="0" goto wifi_exit
if "%delidx%"=="" goto wifi_exit
set /a idx=0
set "TARGET="
for /f "tokens=1,2 delims=|" %%A in ('type "%MAPFILE%"') do (
	set /a idx+=1
	if !idx! EQU %delidx% set "TARGET=%%A"
)
if defined TARGET (
	echo Suppression de "%TARGET%" ...
	netsh wlan delete profile name="%TARGET%"
	pause
)
goto wifi_exit

:wifi_report
> "%OUTPUT%" echo Rapport Wi-Fi %date% %time%
>> "%OUTPUT%" type "%MAPFILE%"
echo Rapport enregistre sur le Bureau : %OUTPUT%
pause
goto wifi_exit

:wifi_exit
if exist "%MAPFILE%" del "%MAPFILE%" >nul 2>&1
pause
exit

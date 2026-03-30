@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Mots de passe Wi-Fi - Standalone
color 0A

REM === AUTO-ELEVATION EN ADMINISTRATEUR ===
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Ce script requiert des privileges administrateur.
    echo Demande d'elevation en cours...
    timeout /t 2 >nul
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

set "OUTPUT=%USERPROFILE%\Desktop\Wifi_Mots_de_passe.txt"
set "MAPFILE=%TEMP%\wifi_map_%RANDOM%.txt"

:menu_wifi
call :wifi_collect
cls
echo ===============================================
echo   Mots de passe Wi-Fi - Afficher/Supprimer/Reporter
echo ===============================================
echo.
echo   1) Afficher / Supprimer un reseau Wi-Fi
echo   2) Generer un rapport sur le Bureau
echo   0) Quitter
echo.
set /p wchoice=Votre choix:

if "%wchoice%"=="1" goto wifi_display
if "%wchoice%"=="2" goto wifi_report
if "%wchoice%"=="0" goto wifi_exit
goto menu_wifi

:wifi_collect
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
exit /b 0

:wifi_display
call :wifi_collect
cls
echo Profils Wi-Fi trouves:
echo.
if %found%==0 (
	echo Aucun profil Wi-Fi trouve ou sortie non reconnue.
	pause
	goto menu_wifi
)
set /a idx=0
for /f "tokens=1,2 delims=|" %%A in ('type "%MAPFILE%"') do (
	set /a idx+=1
	echo  [!idx!] SSID: %%A ^| MDP: %%B
)

echo.
set /p delidx=Supprimer un profil ? Entrez le numero (0 pour annuler):
if "%delidx%"=="0" goto menu_wifi

set "_raw=%delidx%"
set "_num=%_raw: =%"
set "_num_invalid="
for /f "delims=0123456789" %%X in ("!_num!") do set "_num_invalid=1"
if defined _num_invalid (
	echo Numero invalide.
	pause
	goto menu_wifi
)
set /a _check=%_num% + 0 >nul 2>&1
if errorlevel 1 (
	echo Numero invalide.
	pause
	goto menu_wifi
)
if %_num% lss 1 (
	echo Numero hors plage.
	pause
	goto menu_wifi
)

set /a idx=0
set "TARGET="
for /f "tokens=1,2 delims=|" %%A in ('type "%MAPFILE%"') do (
	set /a idx+=1
	if !idx! EQU %_num% set "TARGET=%%A"
)
if not defined TARGET (
	echo Numero hors plage.
	pause
	goto menu_wifi
)

echo Suppression du profil: "%TARGET%" ...
netsh wlan delete profile name="%TARGET%"
pause
goto menu_wifi

:wifi_report
call :wifi_collect
cls
if %found%==0 (
	echo Aucun profil Wi-Fi trouve. Rapport non cree.
	pause
	goto menu_wifi
)
for /f %%C in ('find /v /c "" ^< "%MAPFILE%"') do set count=%%C
echo Total d'identifiants recuperes: %count%
>"%OUTPUT%" echo Mots de passe Wi-Fi exportes - %date% %time%
>>"%OUTPUT%" echo ===============================================
>>"%OUTPUT%" echo Total: %count%
for /f "tokens=1,2 delims=|" %%A in ('type "%MAPFILE%"') do (
	>>"%OUTPUT%" echo SSID: %%A ^| MDP: %%B
)
echo Rapport enregistre: "%OUTPUT%"
pause
goto menu_wifi

:wifi_exit
if exist "%MAPFILE%" del "%MAPFILE%" >nul 2>&1
endlocal
echo.
echo Fermeture du script...
pause
exit

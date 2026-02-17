@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title Export Mots de Passe Navigateurs (Nirsoft)
color 0A

set "WBPV=%~dp0WebBrowserPassView.exe"
set "DOWNLOAD_URL=https://script.salutalex.fr/scripts/nirsoft/batch/WebBrowserPassView.exe"
set "DOWNLOADED=0"

if not exist "%WBPV%" (
  echo Telechargement de WebBrowserPassView.exe...
  curl.exe -fL --retry 3 --retry-delay 2 -o "%WBPV%" "%DOWNLOAD_URL%" 2>nul || certutil -urlcache -split -f "%DOWNLOAD_URL%" "%WBPV%" >nul 2>&1
  if not exist "%WBPV%" (
    echo Erreur: Telechargement echoue.
    pause
    exit /b
  )
  set "DOWNLOADED=1"
  timeout /t 1 /nobreak >nul
)

set "OUTPUT=%~dp0passwords_export_%RANDOM%.txt"

echo Lancement de l'outil...
start "" "%WBPV%"
timeout /t 5 /nobreak >nul
echo Tentative d'export automatique...
powershell -Command "$wsh = New-Object -ComObject WScript.Shell; $wsh.AppActivate('WebBrowserPassView'); Start-Sleep -Milliseconds 2000; $wsh.SendKeys('^a'); Start-Sleep -Milliseconds 2000; $wsh.SendKeys('^s'); Start-Sleep -Milliseconds 5000; $wsh.SendKeys('%OUTPUT%{ENTER}')" >nul 2>&1

timeout /t 3 /nobreak >nul
taskkill /F /IM WebBrowserPassView.exe >nul 2>&1

if "%DOWNLOADED%"=="1" (
  del /F /Q "%WBPV%" >nul 2>&1
)

if exist "%OUTPUT%" (
  echo Fichier sauvegarde ici: %OUTPUT%
  echo (Vous pouvez le deplacer ou l'ouvrir)
) else (
  echo L'export automatique a peut-etre echoue. Verifiez la fenetre de l'application si elle est toujours ouverte.
)
pause

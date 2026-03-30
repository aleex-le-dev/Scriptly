@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
title Options DNS

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

ipconfig /flushdns >nul

:dns_menu
cls
echo ======================================================
echo                    OPTIONS DNS
echo ======================================================
echo.
echo [1] Utiliser DNS Google (8.8.8.8)
echo [2] Utiliser DNS Cloudflare (1.1.1.1)
echo [3] Restaurer les DNS d'origine
echo [4] Saisir vos DNS personnalises
echo [0] Quitter
echo.
set /p dns_opt_choice=Votre choix:

if "%dns_opt_choice%"=="1" goto set_google_dns
if "%dns_opt_choice%"=="2" goto set_cloudflare_dns
if "%dns_opt_choice%"=="3" goto restore_dns_default
if "%dns_opt_choice%"=="4" goto custom_dns
if "%dns_opt_choice%"=="0" goto end_script
goto dns_menu

:set_google_dns
echo Sauvegarde des parametres DNS actuels...
netsh interface ip show config name="Wi-Fi" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\wifi_dns_backup.txt 2>nul
netsh interface ip show config name="Ethernet" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\ethernet_dns_backup.txt 2>nul

echo Application des DNS Google...
netsh interface ip set dns name="Wi-Fi" static 8.8.8.8 primary 2>nul
netsh interface ip add dns name="Wi-Fi" 8.8.4.4 index=2 2>nul
netsh interface ip set dns name="Ethernet" static 8.8.8.8 primary 2>nul
netsh interface ip add dns name="Ethernet" 8.8.4.4 index=2 2>nul

echo DNS Google appliques avec succes.
pause
goto dns_menu

:set_cloudflare_dns
echo Sauvegarde des parametres DNS actuels...
netsh interface ip show config name="Wi-Fi" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\wifi_dns_backup.txt 2>nul
netsh interface ip show config name="Ethernet" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\ethernet_dns_backup.txt 2>nul

echo Application des DNS Cloudflare...
netsh interface ip set dns name="Wi-Fi" static 1.1.1.1 primary 2>nul
netsh interface ip add dns name="Wi-Fi" 1.0.0.1 index=2 2>nul
netsh interface ip set dns name="Ethernet" static 1.1.1.1 primary 2>nul
netsh interface ip add dns name="Ethernet" 1.0.0.1 index=2 2>nul

echo DNS Cloudflare appliques avec succes.
pause
goto dns_menu

:restore_dns_default
cls
echo ======================================================
echo        RESTAURATION DES PARAMETRES DNS D'ORIGINE
echo ======================================================
echo.

echo [Etape 1] Configuration du DNS Wi-Fi en automatique (DHCP)...
netsh interface ip set dns name="Wi-Fi" source=dhcp >nul 2>&1
if %errorlevel% neq 0 (
    echo [ECHEC] Impossible de restaurer le DNS Wi-Fi. Verifiez manuellement.
) else (
    echo [OK] DNS Wi-Fi retabli avec succes.
)

echo.
echo [Etape 2] Configuration du DNS Ethernet en automatique (DHCP)...
netsh interface ip set dns name="Ethernet" source=dhcp >nul 2>&1
if %errorlevel% neq 0 (
    echo [ECHEC] Impossible de restaurer le DNS Ethernet. Verifiez manuellement.
) else (
    echo [OK] DNS Ethernet retabli avec succes.
)

echo.
echo ------------------------------------------------------
echo Restauration des parametres DNS terminee.
echo ------------------------------------------------------
pause
goto dns_menu

:custom_dns
cls
echo ===============================================
echo           Saisir vos DNS personnalises
echo ===============================================

:get_custom_dns
echo.
set /p customDNS1=DNS primaire:
set /p customDNS2=DNS secondaire (optionnel):

cls
echo ===============================================
echo           Validation des adresses DNS...
echo ===============================================
ping -n 1 %customDNS1% >nul
if errorlevel 1 (
    echo [!] ERREUR: Le DNS primaire "%customDNS1%" est injoignable.
    echo Veuillez saisir une adresse DNS valide.
    pause
    cls
    goto get_custom_dns
)

if not "%customDNS2%"=="" (
    ping -n 1 %customDNS2% >nul
    if errorlevel 1 (
        echo [!] ERREUR: Le DNS secondaire "%customDNS2%" est injoignable.
        echo Il sera ignore.
        set "customDNS2="
        pause
    )
)

cls
echo ===============================================
echo     Application des DNS pour Wi-Fi et Ethernet...
echo ===============================================

netsh interface ip set dns name="Wi-Fi" static %customDNS1% 2>nul
if not "%customDNS2%"=="" netsh interface ip add dns name="Wi-Fi" %customDNS2% index=2 2>nul

netsh interface ip set dns name="Ethernet" static %customDNS1% 2>nul
if not "%customDNS2%"=="" netsh interface ip add dns name="Ethernet" %customDNS2% index=2 2>nul

echo.
echo ===============================================
echo      DNS mis a jour avec succes :
echo        Primaire : %customDNS1%
if not "%customDNS2%"=="" echo        Secondaire : %customDNS2%
echo ===============================================
pause
goto dns_menu

:end_script
exit

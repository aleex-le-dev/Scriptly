@echo off
chcp 65001 >nul
title Gestionnaire DNS Cloudflare - Windows 11
color 0B

:: Vérifier et demander les privilèges administrateur au démarrage
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Demande d'elevation des privileges...
    powershell -Command "Start-Process '%~0' -Verb RunAs"
    exit /b
)

:menu
cls
echo ================================================
echo     GESTIONNAIRE DNS CLOUDFLARE
echo ================================================
echo.
echo   1. Installer les DNS Cloudflare (IPv4 + IPv6)
echo   2. Installer les DNS Cloudflare (IPv4 seulement)
echo   3. Restaurer les DNS par defaut
echo   4. Afficher la configuration actuelle
echo   5. Quitter
echo.
echo ================================================
echo.
set /p choice="Choisissez une option (1-5): "

if "%choice%"=="1" goto install_cloudflare_full
if "%choice%"=="2" goto install_cloudflare_ipv4
if "%choice%"=="3" goto restore_dns
if "%choice%"=="4" goto show_config
if "%choice%"=="5" goto exit
goto invalid_choice

:install_cloudflare_full
cls
echo ================================================
echo     INSTALLATION DNS CLOUDFLARE (IPv4 + IPv6)
echo ================================================
echo.

:: Les privilèges administrateur sont déjà vérifiés au démarrage

:: Obtenir le nom de l'interface réseau active
call :get_interface
if "%interface%"=="" (
    echo ERREUR: Aucune interface réseau active trouvée
    pause
    goto menu
)

echo Interface réseau détectée: %interface%
echo.

:: Sauvegarder la configuration DNS actuelle
echo Sauvegarde de la configuration DNS actuelle...
if not exist "dns_backups" mkdir dns_backups
netsh interface ip show dns "%interface%" > "dns_backups\dns_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.txt"
netsh interface ipv6 show dns "%interface%" >> "dns_backups\dns_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.txt"
echo Sauvegarde créée dans le dossier dns_backups
echo.

:: Configurer les DNS Cloudflare IPv4
echo Configuration des DNS Cloudflare IPv4...
echo.

:: DNS primaire Cloudflare IPv4 (1.1.1.1)
echo Configuration du DNS primaire IPv4 (1.1.1.1)...
netsh interface ip set dns "%interface%" static 1.1.1.1

:: DNS secondaire Cloudflare IPv4 (1.0.0.1)
echo Configuration du DNS secondaire IPv4 (1.0.0.1)...
netsh interface ip add dns "%interface%" 1.0.0.1 index=2

echo.
:: Configurer les DNS Cloudflare IPv6
echo Configuration des DNS Cloudflare IPv6...
echo.

:: DNS primaire Cloudflare IPv6 (2606:4700:4700::1111)
echo Configuration du DNS primaire IPv6 (2606:4700:4700::1111)...
netsh interface ipv6 set dns "%interface%" static 2606:4700:4700::1111

:: DNS secondaire Cloudflare IPv6 (2606:4700:4700::1001)
echo Configuration du DNS secondaire IPv6 (2606:4700:4700::1001)...
netsh interface ipv6 add dns "%interface%" 2606:4700:4700::1001 index=2

:: Vider le cache DNS
echo Vidage du cache DNS...
ipconfig /flushdns

echo.
echo ================================================
echo     INSTALLATION TERMINÉE AVEC SUCCÈS !
echo ================================================
echo.
echo DNS Cloudflare configurés:
echo   IPv4 - Primaire: 1.1.1.1
echo   IPv4 - Secondaire: 1.0.0.1
echo   IPv6 - Primaire: 2606:4700:4700::1111
echo   IPv6 - Secondaire: 2606:4700:4700::1001
echo.
echo Interface: %interface%
echo.

:: Afficher la configuration actuelle
echo Configuration DNS IPv4 actuelle:
netsh interface ip show dns "%interface%"
echo.
echo Configuration DNS IPv6 actuelle:
netsh interface ipv6 show dns "%interface%"

echo.
echo Appuyez sur une touche pour retourner au menu...
pause >nul
goto menu

:install_cloudflare_ipv4
cls
echo ================================================
echo     INSTALLATION DNS CLOUDFLARE (IPv4 seulement)
echo ================================================
echo.

:: Les privilèges administrateur sont déjà vérifiés au démarrage

:: Obtenir le nom de l'interface réseau active
call :get_interface
if "%interface%"=="" (
    echo ERREUR: Aucune interface réseau active trouvée
    pause
    goto menu
)

echo Interface réseau détectée: %interface%
echo.

:: Sauvegarder la configuration DNS actuelle
echo Sauvegarde de la configuration DNS actuelle...
if not exist "dns_backups" mkdir dns_backups
netsh interface ip show dns "%interface%" > "dns_backups\dns_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.txt"
echo Sauvegarde créée dans le dossier dns_backups
echo.

:: Configurer les DNS Cloudflare IPv4
echo Configuration des DNS Cloudflare IPv4...
echo.

:: DNS primaire Cloudflare IPv4 (1.1.1.1)
echo Configuration du DNS primaire IPv4 (1.1.1.1)...
netsh interface ip set dns "%interface%" static 1.1.1.1

:: DNS secondaire Cloudflare IPv4 (1.0.0.1)
echo Configuration du DNS secondaire IPv4 (1.0.0.1)...
netsh interface ip add dns "%interface%" 1.0.0.1 index=2

:: Vider le cache DNS
echo Vidage du cache DNS...
ipconfig /flushdns

echo.
echo ================================================
echo     INSTALLATION TERMINÉE AVEC SUCCÈS !
echo ================================================
echo.
echo DNS Cloudflare configurés:
echo   IPv4 - Primaire: 1.1.1.1
echo   IPv4 - Secondaire: 1.0.0.1
echo.
echo Interface: %interface%
echo.

:: Afficher la configuration actuelle
echo Configuration DNS IPv4 actuelle:
netsh interface ip show dns "%interface%"

echo.
echo Appuyez sur une touche pour retourner au menu...
pause >nul
goto menu

:restore_dns
cls
echo ================================================
echo     RESTAURATION DNS PAR DÉFAUT
echo ================================================
echo.

:: Les privilèges administrateur sont déjà vérifiés au démarrage

:: Obtenir le nom de l'interface réseau active
call :get_interface
if "%interface%"=="" (
    echo ERREUR: Aucune interface réseau active trouvée
    pause
    goto menu
)

echo Interface réseau détectée: %interface%
echo.

:: Restaurer les DNS automatiques IPv4 et IPv6
echo Restauration des DNS automatiques IPv4...
netsh interface ip set dns "%interface%" dhcp

echo Restauration des DNS automatiques IPv6...
netsh interface ipv6 set dns "%interface%" dhcp

:: Vider le cache DNS
echo Vidage du cache DNS...
ipconfig /flushdns

echo.
echo ================================================
echo     DNS RESTAURÉS AVEC SUCCÈS !
echo ================================================
echo.
echo Les DNS IPv4 et IPv6 sont maintenant configurés automatiquement
echo par votre fournisseur d'accès Internet ou votre routeur.
echo.

:: Afficher la configuration actuelle
echo Configuration DNS IPv4 actuelle:
netsh interface ip show dns "%interface%"
echo.
echo Configuration DNS IPv6 actuelle:
netsh interface ipv6 show dns "%interface%"

echo.
echo Appuyez sur une touche pour retourner au menu...
pause >nul
goto menu

:show_config
cls
echo ================================================
echo     CONFIGURATION DNS ACTUELLE
echo ================================================
echo.

:: Obtenir le nom de l'interface réseau active
call :get_interface
if "%interface%"=="" (
    echo ERREUR: Aucune interface réseau active trouvée
    pause
    goto menu
)

echo Interface réseau: %interface%
echo.
echo Configuration DNS IPv4:
netsh interface ip show dns "%interface%"
echo.
echo Configuration DNS IPv6:
netsh interface ipv6 show dns "%interface%"

echo.
echo Configuration IP complète:
ipconfig /all | findstr /C:"Serveurs DNS"

echo.
echo Appuyez sur une touche pour retourner au menu...
pause >nul
goto menu

:get_interface
set "interface="
echo Recherche de l'interface réseau active...
echo.

:: Afficher toutes les interfaces pour debug
echo === Liste de toutes les interfaces ===
netsh interface show interface
echo.

:: Méthode 1: Rechercher par état "Connecté"
echo === Tentative 1: Recherche par état ===
for /f "skip=3 tokens=1,2,3*" %%a in ('netsh interface show interface') do (
    echo Interface trouvée: État="%%b" Type="%%c" Nom="%%d"
    if /i "%%b"=="Connecté" (
        set "interface=%%d"
        echo Interface sélectionnée: %%d
        goto :interface_found
    )
    if /i "%%b"=="Connected" (
        set "interface=%%d"
        echo Interface sélectionnée: %%d
        goto :interface_found
    )
)

:: Méthode 2: Rechercher par type Ethernet ou Wi-Fi
echo === Tentative 2: Recherche par type ===
for /f "skip=3 tokens=1,2,3*" %%a in ('netsh interface show interface') do (
    if /i "%%c"=="Dédié" (
        set "interface=%%d"
        echo Interface trouvée par type: %%d
        goto :interface_found
    )
    if /i "%%c"=="Dedicated" (
        set "interface=%%d"
        echo Interface trouvée par type: %%d
        goto :interface_found
    )
)

:: Méthode 3: Prendre la première interface qui n'est pas "Loopback"
echo === Tentative 3: Première interface non-loopback ===
for /f "skip=3 tokens=1,2,3*" %%a in ('netsh interface show interface') do (
    if /i not "%%d"=="Loopback Pseudo-Interface 1" (
        if /i not "%%d"=="Teredo Tunneling Pseudo-Interface" (
            set "interface=%%d"
            echo Interface par défaut sélectionnée: %%d
            goto :interface_found
        )
    )
)

:interface_found
:: Nettoyer les espaces et guillemets
if defined interface (
    set "interface=%interface: =%"
    set "interface=%interface:"=%"
    echo Interface finale: %interface%
) else (
    echo Aucune interface trouvée
)
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
goto :eof

:invalid_choice
echo.
echo Option invalide. Veuillez choisir entre 1 et 5.
echo.
pause
goto menu

:exit
cls
echo ================================================
echo     MERCI D'AVOIR UTILISÉ CE SCRIPT !
echo ================================================
echo.
echo Développé pour Windows 11
echo DNS Cloudflare: IPv4 (1.1.1.1 / 1.0.0.1) + IPv6 (2606:4700:4700::1111 / 2606:4700:4700::1001)
echo.
echo Appuyez sur une touche pour quitter...
pause >nul
exit



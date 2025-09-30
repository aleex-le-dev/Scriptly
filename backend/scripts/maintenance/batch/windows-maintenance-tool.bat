@echo off
chcp 65001 >nul  REM Utiliser l'encodage UTF-8 pour un meilleur affichage

REM S'assurer que le script s'exécute avec les privilèges administrateur
if /i not "%~1"=="am_admin" (
    echo(Ce script requiert des privilèges administrateur.
    echo(Demande d'élévation en cours ... 
    powershell start -verb runas '%0' am_admin 
    exit /b
)

:menu
cls
color 07

echo ======================================================
echo           OUTIL DE MAINTENANCE WINDOWS V2.9.7 - By Lil_Batti
echo ======================================================
echo.

echo      === MISES A JOUR WINDOWS ===
echo   [1] Mettre a jour les applications / programmes (Winget upgrade)

echo      === VERIFICATIONS D'INTEGRITE SYSTEME ===
echo   [2] Analyse et reparation des fichiers (SFC /scannow) [Admin]
echo   [3] Verification de l'etat Windows (DISM /CheckHealth) [Admin]
echo   [4] Restaurer l'etat Windows (DISM /RestoreHealth) [Admin]

echo      === OUTILS RESEAU ===
echo   [5] Options DNS (Flush/Set/Reset)
echo   [6] Afficher les informations reseau (ipconfig /all)
echo   [7] Redemarrer les cartes reseau
echo   [8] Reparation reseau - Assistant automatique

echo      === NETTOYAGE ^& OPTIMISATION ===
echo   [9] Nettoyage de disque (cleanmgr)
echo  [10] Analyse d'erreurs avancee (CHKDSK) [Admin]
echo  [11] Optimisation systeme (suppression des fichiers temporaires)
echo  [12] Nettoyage/optimisation avancee du Registre

echo      === SUPPORT ===
echo  [13] Informations de contact et support (Discord)

echo.

echo      === UTILITAIRES ^& EXTRAS ===
echo  [20] Afficher les pilotes installes
echo  [21] Outil de reparation Windows Update
echo  [22] Generer un rapport systeme complet
echo  [23] Utilitaire de reinitialisation Windows Update
echo  [24] Afficher la table de routage [Avance]

echo  [14] === QUITTER ===
echo.
echo ------------------------------------------------------
set /p choice=Entrez votre choix: 
if "%choice%"=="22" goto choice22
if "%choice%"=="23" goto choice23

if "%choice%"=="20" goto choice20
if exist "%~f0" findstr /b /c:":choice%choice%" "%~f0" >nul || (
    echo Choix invalide, veuillez recommencer.
    pause
    goto menu
)
goto choice%choice%

:choice1
cls
setlocal EnableDelayedExpansion

REM Vérifier winget
where winget >nul 2>nul || (
    echo Winget n'est pas installe. Veuillez l'installer depuis le Microsoft Store.
    pause
    goto menu
)

echo ===============================================
echo     Mise a jour Windows (via Winget)
echo ===============================================
echo Liste des mises a jour disponibles...
echo.

REM Afficher les applications pouvant etre mises a jour
cmd /c "winget upgrade --include-unknown"
echo.
pause

echo ===============================================
echo Options :
echo [1] Mettre a jour tous les paquets
echo [2] Mettre a jour des paquets selectionnes
echo [0] Annuler
echo.
set /p upopt=Choisissez une option: 

if "%upopt%"=="1" (
    echo Mise a jour complete en cours...
    cmd /c "winget upgrade --all --include-unknown"
    pause
    goto menu
)

if "%upopt%"=="2" (
    cls
    echo ===============================================
    echo   Paquets disponibles [Copiez l'ID a mettre a jour]
    echo ===============================================
    cmd /c "winget upgrade --include-unknown"
    echo.

    echo Saisissez un ou plusieurs IDs de paquets a mettre a jour
    echo (Exemple: Microsoft.Edge,Spotify.Spotify  utilisez les IDs exacts de la liste)

    echo.
    set /p packlist=IDs: 

    REM Supprimer les espaces
    set "packlist=!packlist: =!"

    if not defined packlist (
        echo Aucun ID de paquet saisi.
        pause
        goto menu
    )

    echo.
    for %%G in (!packlist!) do (
        echo Mise a jour de %%G...
        cmd /c "winget upgrade --id %%G --include-unknown"
        echo.
    )

    pause
    goto menu
)

goto menu

:choice2
cls
echo Analyse des fichiers systeme (SFC /scannow)...
sfc /scannow
pause
goto menu

:choice3
cls
echo Verification de l'etat de Windows (DISM /CheckHealth)...
dism /online /cleanup-image /checkhealth
pause
goto menu

:choice4
cls
echo Restauration de l'etat de Windows (DISM /RestoreHealth)...
dism /online /cleanup-image /restorehealth
pause
goto menu

:choice5
cls
echo ======================================================
echo Vidage du cache DNS...
ipconfig /flushdns
echo ======================================================
echo [1] Utiliser DNS Google (8.8.8.8 / 8.8.4.4)
echo [2] Utiliser DNS Cloudflare (1.1.1.1 / 1.0.0.1)
echo [3] Restaurer les DNS d'origine
echo [4] Saisir vos DNS personnalisés
echo [5] Retour au menu
echo ======================================================
set /p dns_choice=Entrez votre choix: 

if "%dns_choice%"=="1" goto set_google_dns
if "%dns_choice%"=="2" goto set_cloudflare_dns
if "%dns_choice%"=="3" goto restore_dns
if "%dns_choice%"=="4" goto custom_dns
if "%dns_choice%"=="5" goto menu

echo Choix invalide, veuillez recommencer.
pause
goto choice5

REM --- CONFIGURER DNS GOOGLE ---
:set_google_dns
echo Sauvegarde des paramètres DNS actuels...

netsh interface ip show config name="Wi-Fi" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\wifi_dns_backup.txt
netsh interface ip show config name="Ethernet" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\ethernet_dns_backup.txt

echo Application des DNS Google...

netsh interface ip set dns name="Wi-Fi" static 8.8.8.8 primary
netsh interface ip add dns name="Wi-Fi" 8.8.4.4 index=2
netsh interface ip set dns name="Ethernet" static 8.8.8.8 primary
netsh interface ip add dns name="Ethernet" 8.8.4.4 index=2

echo DNS Google appliqués avec succès.
pause
goto menu

REM --- CONFIGURER DNS CLOUDFLARE ---
:set_cloudflare_dns
echo Sauvegarde des paramètres DNS actuels...

netsh interface ip show config name="Wi-Fi" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\wifi_dns_backup.txt
netsh interface ip show config name="Ethernet" | findstr "Statically Configured DNS Servers" > %SystemRoot%\Temp\ethernet_dns_backup.txt

echo Application des DNS Cloudflare...

netsh interface ip set dns name="Wi-Fi" static 1.1.1.1 primary
netsh interface ip add dns name="Wi-Fi" 1.0.0.1 index=2
netsh interface ip set dns name="Ethernet" static 1.1.1.1 primary
netsh interface ip add dns name="Ethernet" 1.0.0.1 index=2

echo DNS Cloudflare appliqués avec succès.
pause
goto menu

REM --- RESTAURER LES DNS D'ORIGINE ---
:restore_dns
cls
echo ======================================================
echo        RESTAURATION DES PARAMETRES DNS D'ORIGINE
echo ======================================================
echo.

echo [Etape 1] Configuration du DNS Wi‑Fi en automatique (DHCP)...
netsh interface ip set dns name="Wi-Fi" source=dhcp >nul 2>&1
if %errorlevel% neq 0 (
    echo [ECHEC] Impossible de restaurer le DNS Wi‑Fi. Verifiez manuellement.
) else (
    echo [OK] DNS Wi‑Fi rétabli avec succès.
)

echo.
echo [Etape 2] Configuration du DNS Ethernet en automatique (DHCP)...
netsh interface ip set dns name="Ethernet" source=dhcp >nul 2>&1
if %errorlevel% neq 0 (
    echo [ECHEC] Impossible de restaurer le DNS Ethernet. Verifiez manuellement.
) else (
    echo [OK] DNS Ethernet rétabli avec succès.
)

echo.
echo ------------------------------------------------------
echo Restauration des paramètres DNS terminee.
echo ------------------------------------------------------
pause
goto menu


:choice6
cls
echo Affichage des informations reseau...
ipconfig /all
pause
goto menu

:choice7
cls
echo Redemarrage des cartes reseau...
netsh interface set interface "Wi-Fi" admin=disable
netsh interface set interface "Wi-Fi" admin=enable
echo Cartes reseau redemarrees.
pause
goto menu

:choice8
title Réparation réseau - Assistant automatique
cls
echo.
echo ================================
echo     Réparation réseau automatique
echo ================================
echo.
echo Etape 1 : Renouvellement de l'adresse IP...
ipconfig /release >nul
ipconfig /renew >nul

echo Etape 2 : Actualisation des paramètres DNS...
ipconfig /flushdns >nul

echo Etape 3 : Réinitialisation des composants réseau...
netsh winsock reset >nul
netsh int ip reset >nul

echo.
echo Les paramètres réseau ont été actualisés.
echo Un redémarrage est recommandé pour un effet complet.
echo.

:askRestart
set /p restart=Souhaitez-vous redemarrer maintenant ? (O/N): 
if /I "%restart%"=="Y" (
    shutdown /r /t 5
) else if /I "%restart%"=="O" (
    shutdown /r /t 5
) else if /I "%restart%"=="N" (
    goto menu
) else (
    echo Saisie invalide. Veuillez entrer O ou N.
    goto askRestart
)


:choice9
cls
echo Lancement du Nettoyage de disque...
cleanmgr
pause
goto menu

:choice10
cls
echo ===============================================
echo Analyse avancee des erreurs sur tous les lecteurs...
echo ===============================================

REM Boucle sur tous les lecteurs montés disposant d'espace libre via PowerShell
for /f "delims=" %%d in ('powershell -NoProfile -Command ^
  "Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Free -ne $null } | ForEach-Object { $_.Name + ':' }" 
) do (
    echo.
    echo Analyse du lecteur %%d ...
    chkdsk %%d /f /r /x
)

echo.
echo Tous les lecteurs ont été analysés.
pause
goto menu


:choice11
cls

:confirm_loop
echo Voulez-vous supprimer les fichiers temporaires et le cache système ? (O/N)
set /p confirm=Tapez O ou N: 

IF /I "%confirm%"=="Y" (
    goto delete_temp
) ELSE IF /I "%confirm%"=="YES" (
    goto delete_temp
) ELSE IF /I "%confirm%"=="O" (
    goto delete_temp
) ELSE IF /I "%confirm%"=="N" (
    echo Operation annulee.
    pause
    goto menu
) ELSE IF /I "%confirm%"=="NO" (
    echo Operation annulee.
    pause
    goto menu
) ELSE (
    echo Saisie invalide. Veuillez taper O ou N.
    goto confirm_loop
)

:delete_temp
echo Suppression des fichiers temporaires et du cache système...
del /s /f /q %temp%\*.*
del /s /f /q C:\Windows\Temp\*.*
del /s /f /q "C:\Users\%USERNAME%\AppData\Local\Temp\*.*"
echo Fichiers temporaires supprimés.
pause
goto menu


:choice12
cls
echo ======================================================
echo Nettoyage ^& optimisation avances du Registre
echo ======================================================
setlocal enabledelayedexpansion

REM Créer le dossier de sauvegarde
set backupFolder=%SystemRoot%\Temp\RegistryBackups
if not exist "%backupFolder%" mkdir "%backupFolder%"

REM Créer le fichier journal
set logFile=%SystemRoot%\Temp\RegistryCleanupLog.txt
echo Journal de nettoyage du Registre - %date% %time% > "%logFile%"

REM Compteurs
set count=0
set safe_count=0

REM Analyse avancée du Registre
echo Analyse du Registre Windows pour les erreurs et problèmes de performance...
for /f "tokens=*" %%A in ('reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall 2^>nul') do (
    set /a count+=1
    set entries[!count!]=%%A
    
    REM Déterminer si la clé est sans risque à supprimer
    echo %%A | findstr /I "IE40 IE4Data DirectDrawEx DXM_Runtime SchedulingAgent" >nul && (
        set /a safe_count+=1
        set safe_entries[!safe_count!]=%%A
    )
)

REM Si aucune entrée, sortie
if %count%==0 (
    echo Aucune entrée superflue trouvée dans le Registre.
    pause
    goto menu
)

REM Afficher les entrées trouvées
echo %count% problèmes potentiels détectés dans le Registre:
for /L %%i in (1,1,%count%) do echo [%%i] !entries[%%i]!
echo.
echo Sans risque à supprimer (%safe_count% entrées détectées):
for /L %%i in (1,1,%safe_count%) do echo [%%i] !safe_entries[%%i]!
echo.
echo [A] Supprimer uniquement les entrées sûres
if %safe_count% GTR 0 echo [B] Revoir les entrées sûres avant suppression
echo [C] Créer une sauvegarde du Registre
echo [D] Restaurer une sauvegarde du Registre
echo [E] Vérifier les corruptions du Registre
echo [0] Annuler
echo.
echo Votre choix:
set /p user_choice=

REM Normaliser la saisie
for %%A in (%user_choice%) do set user_choice=%%A
if /I "%user_choice%"=="0" goto menu
if /I "%user_choice%"=="A" goto delete_safe_entries
if /I "%user_choice%"=="B" goto review_safe_entries
if /I "%user_choice%"=="C" goto create_backup
if /I "%user_choice%"=="D" goto restore_backup
if /I "%user_choice%"=="E" goto scan_registry
if "%user_choice%"=="" goto menu

echo Saisie invalide, retour au menu.
pause
goto menu

REM Supprimer uniquement les entrées sûres
:delete_safe_entries
if %safe_count%==0 (
    echo Aucune entrée sûre à supprimer.
    pause
    goto menu
)
echo Suppression de toutes les entrées sûres détectées...
for /L %%i in (1,1,%safe_count%) do (
    echo Suppression de !safe_entries[%%i]!...
    reg delete "!safe_entries[%%i]!" /f
    echo Supprime: !safe_entries[%%i]! >> "%logFile%"
)
echo Suppression terminée.
pause
goto menu

REM Revue avant suppression
:review_safe_entries
cls
echo Entrées du Registre sûres à supprimer:
for /L %%i in (1,1,%safe_count%) do echo [%%i] !safe_entries[%%i]!
echo.
echo Voulez-vous toutes les supprimer ? (O/N)
set /p confirm=
for %%A in (%confirm%) do set confirm=%%A
if /I "%confirm%"=="Y" goto delete_safe_entries
if /I "%confirm%"=="O" goto delete_safe_entries
echo Opération annulée.
pause
goto menu

REM Créer une sauvegarde du Registre
:create_backup
set backupName=RegistryBackup_%date:~-4,4%-%date:~-7,2%-%date:~-10,2%_%time:~0,2%-%time:~3,2%.reg
echo Création de la sauvegarde: %backupFolder%\%backupName%...
reg export HKLM "%backupFolder%\%backupName%" /y
echo Sauvegarde créée avec succès.
pause
goto menu

REM Restaurer une sauvegarde
:restore_backup
echo Sauvegardes disponibles:
dir /b "%backupFolder%\*.reg"
echo Entrez le nom de la sauvegarde à restaurer:
set /p backupFile=
if exist "%backupFolder%\%backupFile%" (
    echo Restauration en cours...
    reg import "%backupFolder%\%backupFile%"
    echo Restauration effectuée avec succès.
) else (
    echo Fichier de sauvegarde introuvable. Vérifiez le nom et réessayez.
)
pause
goto menu

REM Vérifier les corruptions du Registre
:scan_registry
cls
echo Vérification des corruptions du Registre...
sfc /scannow
dism /online /cleanup-image /checkhealth
echo Vérification terminée. Si des erreurs ont été trouvées, redémarrez votre PC.
pause
goto menu


:choice13
cls
echo.
echo ==================================================
echo                CONTACT ET SUPPORT
echo ==================================================
echo Des questions ou besoin d'aide ?
echo Vous pouvez me contacter à tout moment.
echo.
echo Discord - Utilisateur: Lil_Batti
echo Serveur de support: https://discord.gg/bCQqKHGxja
echo.
echo Appuyez sur ENTREE pour revenir au menu principal.
pause >nul
goto menu

:choice14
cls
echo Fermeture du script...
exit


:custom_dns
cls
echo ===============================================
echo           Saisir vos DNS personnalisés
echo ===============================================

:get_dns
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
    goto get_dns
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
echo     Application des DNS pour Wi‑Fi et Ethernet...
echo ===============================================

REM Wi‑Fi
netsh interface ip set dns name="Wi-Fi" static %customDNS1%
if not "%customDNS2%"=="" netsh interface ip add dns name="Wi-Fi" %customDNS2% index=2

REM Ethernet
netsh interface ip set dns name="Ethernet" static %customDNS1%
if not "%customDNS2%"=="" netsh interface ip add dns name="Ethernet" %customDNS2% index=2

echo.
echo ===============================================
echo      DNS mis a jour avec succes :
echo        Primaire : %customDNS1%
if not "%customDNS2%"=="" echo        Secondaire : %customDNS2%
echo ===============================================
pause
goto choice5


:choice20
cls
echo ===============================================
echo     Enregistrement de la liste des pilotes sur le Bureau
echo ===============================================
driverquery /v > "%USERPROFILE%\Desktop\Pilotes_installes.txt"
echo.
echo Le rapport des pilotes a ete enregistre ici :
echo %USERPROFILE%\Desktop\Pilotes_installes.txt
pause
goto menu

:choice21
cls
echo ===============================================
echo      Outil de reparation Windows Update [Admin]
echo ===============================================
echo.
echo [1/4] Arret des services lies aux mises a jour...

call :stopIfExists wuauserv
call :stopIfExists bits
call :stopIfExists cryptsvc
call :stopIfExists msiserver
call :stopIfExists usosvc
call :stopIfExists trustedinstaller
timeout /t 2 >nul

echo [2/4] Renommage des dossiers de cache des mises a jour...
set "SUFFIX=.bak_%RANDOM%"
set "SD=%windir%\SoftwareDistribution"
set "CR=%windir%\System32\catroot2"

if exist "%SD%" (
    ren "%SD%" "SoftwareDistribution%SUFFIX%" 2>nul
    if exist "%windir%\SoftwareDistribution%SUFFIX%" (
        echo Renomme : %windir%\SoftwareDistribution%SUFFIX%
    ) else (
        echo Avertissement : impossible de renommer SoftwareDistribution.
    )
) else (
    echo Info : SoftwareDistribution introuvable.
)

if exist "%CR%" (
    ren "%CR%" "catroot2%SUFFIX%" 2>nul
    if exist "%windir%\System32\catroot2%SUFFIX%" (
        echo Renomme : %windir%\System32\catroot2%SUFFIX%
    ) else (
        echo Avertissement : impossible de renommer catroot2.
    )
) else (
    echo Info : catroot2 introuvable.
)

echo.
echo [3/4] Redemarrage des services...
call :startIfExists wuauserv
call :startIfExists bits
call :startIfExists cryptsvc
call :startIfExists msiserver
call :startIfExists usosvc
call :startIfExists trustedinstaller

echo.
echo [4/4] Les composants de Windows Update ont ete reinitialises.
echo.
echo Dossiers renommes :
echo   - %windir%\SoftwareDistribution%SUFFIX%
echo   - %windir%\System32\catroot2%SUFFIX%
echo Vous pouvez les supprimer apres redemarrage si tout fonctionne.
echo.
pause
goto menu

REM === CES FONCTIONS DOIVENT RESTER EN BAS DU SCRIPT ===

:stopIfExists
sc query "%~1" | findstr /i "STATE" >nul
if not errorlevel 1 (
    echo Arrêt de %~1
    net stop "%~1" >nul 2>&1
)
goto :eof

:startIfExists
sc query "%~1" | findstr /i "STATE" >nul
if not errorlevel 1 (
    echo Demarrage de %~1
    net start "%~1" >nul 2>&1
)
goto :eof

:choice22
cls
echo ===============================================
echo     Generation de rapports systeme separes...
echo ===============================================
echo.

REM === Chemin du Bureau de maniere fiable ===
for /f "usebackq delims=" %%d in (`powershell -NoProfile -Command "$env:USERPROFILE + '\Desktop'"`) do (
    set "DESKTOP=%%d"
)

REM === Generer un horodatage ===
for /f "usebackq delims=" %%t in (`powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"`) do (
    set "DATESTR=%%t"
)

set "SYS=%DESKTOP%\Infos_Systeme_%DATESTR%.txt"
set "NET=%DESKTOP%\Infos_Reseau_%DATESTR%.txt"
set "DRV=%DESKTOP%\Liste_Pilotes_%DATESTR%.txt"

echo Ecriture des informations systeme dans %SYS% ...
systeminfo > "%SYS%" 2>nul

echo Ecriture des informations reseau dans %NET% ...
ipconfig /all > "%NET%" 2>nul

echo Ecriture de la liste des pilotes dans %DRV% ...
driverquery > "%DRV%" 2>nul

echo.
echo Rapports enregistres sur le Bureau :
echo  - %~nx1
echo  - %~nx2
echo  - %~nx3
echo.
pause
goto menu

:choice23
cls
echo ======================================================
echo            Utilitaire Windows Update ^& Reset Services
echo ======================================================
echo Cet outil va redemarrer les services Windows Update principaux.
echo Assurez-vous qu'aucune mise a jour n'est en cours d'installation.
pause

echo.
echo [1] Reinitialiser les services (wuauserv, cryptsvc, appidsvc, bits)
echo [2] Retour au menu principal
echo.
set /p fixchoice=Choisissez une option: 

if "%fixchoice%"=="1" goto reset_windows_update
if "%fixchoice%"=="2" goto menu

echo Saisie invalide. Reessayez.
pause
goto choice23

:reset_windows_update
cls
echo ======================================================
echo     Redemarrage des services Windows Update
echo ======================================================

echo Arret du service Windows Update...
net stop wuauserv >nul

echo Arret du service de Chiffrement...
net stop cryptsvc >nul

echo Demarrage du service Application Identity...
net start appidsvc >nul

echo Demarrage du service Windows Update...
net start wuauserv >nul

echo Demarrage du service BITS...
net start bits >nul

echo.
echo [OK] Services lies aux mises a jour redemarres.
pause
goto menu

:choice24
setlocal EnableDelayedExpansion
cls
echo ===============================================
echo      Afficher la table de routage  [Avance]
echo ===============================================
echo Cela montre comment votre systeme gere le trafic reseau.
echo.
echo [1] Afficher la table de routage dans cette fenetre
echo [2] Enregistrer la table de routage sur le Bureau
echo [3] Retour au menu principal
echo.
set /p routeopt=Choisissez une option: 

if "%routeopt%"=="1" (
    cls
    route print
    echo.
    pause
    goto menu
)

if "%routeopt%"=="2" (
    REM === Chemin du Bureau et verif existence ===
    set "DESKTOP=%USERPROFILE%\Desktop"
    if not exist "!DESKTOP!" (
        echo Dossier Bureau introuvable.
        pause
        goto menu
    )

    REM === Horodatage via PowerShell ===
    for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"`) do (
        set "dt=%%i"
    )

    REM === Secours si horodatage ko ===
    if not defined dt (
        echo Echec de generation de l'horodatage. Valeur de secours...
        set "dt=horodatage"
    )

    REM === Enregistrer la table de routage ===
    set "FILE=!DESKTOP!\table_routage_!dt!.txt"
    cls
    echo Enregistrement de la table de routage dans: "!FILE!"
    echo.
    route print > "!FILE!"

    if exist "!FILE!" (
        echo [OK] Table de routage enregistree avec succes.
    ) else (
        echo [ERREUR] Echec de l'enregistrement de la table de routage.
    )
    echo.
    pause
    goto menu
)

if "%routeopt%"=="3" (
    goto menu
)

echo Saisie invalide. Veuillez entrer 1, 2 ou 3.
pause
goto choice24



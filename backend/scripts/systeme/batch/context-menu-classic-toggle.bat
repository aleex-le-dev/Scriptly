@echo off
chcp 65001 >nul
title Menu contextuel classique - Windows 11
color 0E

REM Script pour restaurer le menu contextuel classique dans Windows 11
REM Sauvegardez avec l'extension .bat et executez en tant qu'administrateur

echo ========================================================
echo    Restauration du menu contextuel classique Windows 11
echo ========================================================
echo.

REM Verification des privileges administrateur
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERREUR: Ce script doit etre execute en tant qu'administrateur
    echo Clic droit sur le fichier .bat et "Executer en tant qu'administrateur"
    echo.
    pause
    exit
)

echo Choix disponibles :
echo.
echo [1] Activer le menu contextuel classique (recommande)
echo [2] Restaurer le menu contextuel moderne de Windows 11
echo [3] Quitter
echo.
set /p choice="Votre choix (1, 2 ou 3) : "

if "%choice%"=="1" goto :activate_classic
if "%choice%"=="2" goto :restore_modern
if "%choice%"=="3" goto :exit
goto :invalid_choice

:activate_classic
echo.
echo Activation du menu contextuel classique...
echo.

REM Modification du registre pour desactiver le nouveau menu contextuel
reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve

echo Modification du registre terminee.
echo.
echo IMPORTANT : Un redemarrage de l'Explorateur Windows est necessaire.
echo.
set /p restart_explorer="Redemarrer l'Explorateur maintenant ? (O/N) : "

if /i "%restart_explorer%"=="O" (
    echo Redemarrage de l'Explorateur Windows...
    taskkill /f /im explorer.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
    start explorer.exe
    echo.
    echo Menu contextuel classique active avec succes !
) else (
    echo.
    echo Menu contextuel classique sera actif apres le redemarrage de l'Explorateur
    echo ou de l'ordinateur.
)

echo.
echo Pour redemarrer l'Explorateur plus tard, utilisez Ctrl+Shift+Echap
echo puis redemarrez "Explorateur Windows" depuis le Gestionnaire des taches.
goto :end

:restore_modern
echo.
echo Restauration du menu contextuel moderne...
echo.

REM Suppression de la cle de registre
reg delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f >nul 2>&1

echo Modification du registre terminee.
echo.
set /p restart_explorer="Redemarrer l'Explorateur maintenant ? (O/N) : "

if /i "%restart_explorer%"=="O" (
    echo Redemarrage de l'Explorateur Windows...
    taskkill /f /im explorer.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
    start explorer.exe
    echo.
    echo Menu contextuel moderne restaure avec succes !
) else (
    echo.
    echo Menu contextuel moderne sera actif apres le redemarrage de l'Explorateur
    echo ou de l'ordinateur.
)
goto :end

:invalid_choice
echo.
echo Choix invalide. Veuillez entrer 1, 2 ou 3.
echo.
pause
goto :menu

:exit
echo.
echo Annulation de l'operation.
goto :end

:end
echo.
echo ========================================================
echo                    Operation terminee
echo ========================================================
echo.
pause
exit



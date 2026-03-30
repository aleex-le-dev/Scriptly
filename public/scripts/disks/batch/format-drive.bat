@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Formatage avec DISKPART - Standalone
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

:disk_manager
cls
echo.
echo =============================================================
echo                       DISKPART
echo =============================================================
echo.
echo Analyse des disques disponibles...
echo.
echo =============================================================
echo.

echo list disk | diskpart

echo.
echo =============================================================
echo.
echo ATTENTION : Le formatage effacera TOUTES les donnees !
echo.
echo Entrez le numero du disque a formater (ou '0' pour quitter) :
set /p disk_num=Numero du disque:

if "%disk_num%"=="0" goto exit_script
if /i "%disk_num%"=="Q" goto exit_script

echo %disk_num%| findstr /r "^[0-9][0-9]*$" >nul
if %errorLevel% neq 0 (
    echo.
    echo Erreur : Veuillez entrer un numero valide !
    timeout /t 3 >nul
    goto disk_manager
)

:disk_format_choice
cls
echo.
echo =============================================================
echo   CHOIX DU SYSTEME DE FICHIERS (DISQUE %disk_num%)
echo =============================================================
echo.
echo   1) NTFS (Windows)
echo   2) FAT32 (Compatibilite)
echo   3) exFAT (Compatibilite + Gros fichiers)
echo   4) ReFS (Windows Server)
echo   0) Annuler
echo.
set /p format_choice=Votre choix:

if "%format_choice%"=="0" goto disk_manager
if "%format_choice%"=="1" set "fs_type=NTFS"
if "%format_choice%"=="2" set "fs_type=FAT32"
if "%format_choice%"=="3" set "fs_type=exFAT"
if "%format_choice%"=="4" set "fs_type=ReFS"

if not defined fs_type goto disk_format_choice

cls
echo.
echo =============================================================
echo                       CONFIRMATION
echo =============================================================
echo.
echo Vous allez formater le DISQUE %disk_num%
echo Format selectionne : %fs_type%
echo.
echo ATTENTION: TOUTES LES DONNEES SERONT DEFINITIVEMENT EFFACEES !
echo.
echo Tapez 'OUI' en majuscules pour confirmer (ou autre pour annuler) :
set /p confirmation=Confirmation:

if not "%confirmation%"=="OUI" (
    echo.
    echo Operation annulee par l'utilisateur.
    timeout /t 2 >nul
    goto disk_manager
)

echo.
echo =============================================================
echo Preparation du formatage...
echo =============================================================
echo.

set script_temp=%temp%\diskpart_script.txt

(
    echo select disk %disk_num%
    echo clean
    echo create partition primary
    echo format fs=%fs_type% quick
    echo assign
    echo exit
) > "%script_temp%"

echo Execution des commandes diskpart...
echo.
diskpart /s "%script_temp%"

set result=%errorLevel%

del "%script_temp%" >nul 2>&1

echo.
echo =============================================================
if %result% equ 0 (
    echo.
    echo Formatage termine avec succes !
    echo.
    echo Le disque %disk_num% a ete :
    echo   - Nettoye completement
    echo   - Partitionne en partition primaire
    echo   - Formate en %fs_type%
    echo   - Une lettre de lecteur lui a ete assignee
    echo.
) else (
    echo.
    echo Une erreur s'est produite pendant le formatage.
    echo Verifiez que le disque existe et n'est pas protege.
    echo.
)
echo =============================================================
echo.

set /p disk_choice=Voulez-vous formater un autre disque ? (O/N):
if /i "%disk_choice%"=="O" goto disk_manager

:exit_script
echo.
echo Fermeture du script...
pause
exit

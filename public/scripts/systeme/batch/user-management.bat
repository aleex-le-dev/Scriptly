@echo off
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION
:: Script: user-management.bat
:: Objectif: Gestion locale des utilisateurs Windows (liste, ajout, suppression, droits admin, reset mdp)

:: Vérifier l'élévation (administrateur)
whoami /groups | findstr /c:"S-1-16-12288" >nul
if not %errorlevel%==0 (
	:: Relance en élevé
	powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
	goto :eof
)

:: Détection de locale (FR/EN) pour parsing basique
set "STR_PWD_REQ_EN=Password required"
set "STR_PWD_REQ_FR=Mot de passe requis"

:menu
cls
echo ======================================================
echo   Gestion des utilisateurs locaux (Administrateur)
echo ======================================================
echo  1^) Lister les utilisateurs (Admin / Actif / MDP requis)
echo  2^) Ajouter un utilisateur
echo  3^) Supprimer un utilisateur
echo  4^) Ajouter/retirer du groupe Administrateurs
echo  5^) Reinitialiser le mot de passe
echo  6^) Quitter
echo.
set /p choice=Choix ^> 
if "%choice%"=="1" goto :list
if "%choice%"=="2" goto :add
if "%choice%"=="3" goto :del
if "%choice%"=="4" goto :admin
if "%choice%"=="5" goto :reset
if "%choice%"=="6" goto :eof
goto :menu

:list
cls
echo Utilisateur           Admin   Actif   MDPRequis   DernierChangementMDP
echo -----------------------------------------------------------------------
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $admins=@(Get-LocalGroupMember -Group 'Administrators' -ErrorAction SilentlyContinue | Where-Object { $_.ObjectClass -eq 'User' } | ForEach-Object { $_.Name.Split('\\')[-1] }); Get-LocalUser | Where-Object Enabled | Sort-Object Name | ForEach-Object { $u=$_; [PSCustomObject]@{ Utilisateur=$u.Name; Admin= if($admins -contains $u.Name){'Oui'}else{'Non'}; Actif= if($u.Enabled){'Oui'}else{'Non'}; MDPRequis= if($u.PasswordRequired){'Oui'}else{'Non'}; DernierChangementMDP='-' } } | Format-Table -AutoSize" || echo Erreur lors de la liste
echo.
pause
goto :menu

:_printUser
setlocal ENABLEDELAYEDEXPANSION
set "U=%~1"
:: Admin ?
set "ISADMIN=Non"
for /f "skip=6 delims=" %%A in ('net localgroup Administrators 2^>nul') do (
	for /f "tokens=*" %%B in ("%%~A") do (
		if /I "%%~B"=="%U%" set "ISADMIN=Oui"
	)
)

:: Actif ? (Disabled from wmic)
set "DISABLED="
for /f "tokens=2 delims==" %%D in ('wmic useraccount where "name='%U%'" get disabled /value ^| findstr "="') do set "DISABLED=%%D"
set "ACTIF=Oui"
if /I "%DISABLED%"=="TRUE" set "ACTIF=Non"

:: Password required ? et dernier changement
set "PWDREQ=?"
set "PWDLAST=?"
for /f "tokens=1,* delims=:" %%K in ('net user "%U%" 2^>nul ^| findstr /R /C:"^%STR_PWD_REQ_EN%" /C:"^%STR_PWD_REQ_FR%" /C:"^Password last set" /C:"^Dernier changement du mot de passe"') do (
	set "K=%%~K"
	set "V=%%~L"
	for /f "tokens=* delims= " %%Z in ("!V!") do set "V=%%~Z"
	if /I "!K!"=="%STR_PWD_REQ_EN%" set "PWDREQ=!V!"
	if /I "!K!"=="%STR_PWD_REQ_FR%" set "PWDREQ=!V!"
	if /I "!K!"=="Password last set" set "PWDLAST=!V!"
	if /I "!K!"=="Dernier changement du mot de passe" set "PWDLAST=!V!"
)

:: Impression ligne alignée grossièrement
set "PADU=%U%                 "
set "PADU=!PADU:~0,20!"
set "PADA=%ISADMIN%  "
set "PADA=!PADA:~0,5!"
set "PADC=%ACTIF%  "
set "PADC=!PADC:~0,5!"
set "PPR=%PWDREQ%        "
set "PPR=!PPR:~0,10!"
echo !PADU!  !PADA!  !PADC!  !PPR!  !PWDLAST!
endlocal & goto :eof

:add
cls
set /p NEWU=Nom d'utilisateur ^> 
if "%NEWU%"=="" goto :menu
set /p SETPWD=Affecter un mot de passe maintenant ? (O/N) ^> 
if /I "%SETPWD%"=="O" (
	set /p NEWP=Mot de passe ^> 
	net user "%NEWU%" "%NEWP%" /add /y
) else (
	:: Tente de créer sans mot de passe (peut echouer selon la strategie locale)
	net user "%NEWU%" "" /add /y
)
if not %errorlevel%==0 (
	echo Echec de creation de l'utilisateur.
	pause
	goto :menu
)
set /p ADDADM=Ajouter '%NEWU%' aux Administrateurs ? (O/N) ^> 
if /I "%ADDADM%"=="O" net localgroup Administrators "%NEWU%" /add
echo Utilisateur cree.
pause
goto :menu

:del
cls
set /p DELU=Utilisateur a supprimer ^> 
if "%DELU%"=="" goto :menu
set /p CONF=Confirmer la suppression de '%DELU%' ? (O/N) ^> 
if /I not "%CONF%"=="O" goto :menu
:: Retrait du groupe Admin si present
net localgroup Administrators "%DELU%" /delete >nul 2>nul
net user "%DELU%" /delete
if %errorlevel%==0 (echo Utilisateur supprime.) else (echo Echec de suppression.)
pause
goto :menu

:admin
cls
set /p UADM=Nom d'utilisateur ^> 
if "%UADM%"=="" goto :menu
set /p OP=Choisir: (1) Ajouter Admin  (2) Retirer Admin ^> 
if "%OP%"=="1" (
	net localgroup Administrators "%UADM%" /add
	if %errorlevel%==0 (echo Ajoute aux Administrateurs.) else (echo Echec.)
) else if "%OP%"=="2" (
	net localgroup Administrators "%UADM%" /delete
	if %errorlevel%==0 (echo Retire des Administrateurs.) else (echo Echec.)
) else (
	echo Choix invalide.
)
pause
goto :menu

:reset
cls
set /p RUSER=Utilisateur ^> 
if "%RUSER%"=="" goto :menu
set /p RNEWP=Nouveau mot de passe ^> 
net user "%RUSER%" "%RNEWP%"
if %errorlevel%==0 (echo Mot de passe mis a jour.) else (echo Echec.)
pause
goto :menu

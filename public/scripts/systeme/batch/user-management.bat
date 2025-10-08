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

:: Détecter le nom localisé du groupe Administrateurs via SID (S-1-5-32-544)
for /f "usebackq tokens=*" %%G in (`powershell -NoProfile -Command "$n=([System.Security.Principal.SecurityIdentifier]::new('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value.Split('\\')[-1]; Write-Output $n"`) do set "ADMIN_GROUP=%%G"
if not defined ADMIN_GROUP set "ADMIN_GROUP=Administrators"
net localgroup "%ADMIN_GROUP%" >nul 2>&1 || set "ADMIN_GROUP=Administrateurs"

:: Détection de locale (FR/EN) pour parsing basique
set "STR_PWD_REQ_EN=Password required"
set "STR_PWD_REQ_FR=Mot de passe requis"

:menu
cls
echo ======================================================
echo   Gestion des utilisateurs locaux (Administrateur)
echo ======================================================
echo  1^) Lister les utilisateurs
echo  2^) Ajouter un utilisateur
echo  3^) Supprimer un utilisateur
echo  4^) Ajouter/retirer un administrateur
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
echo Utilisateur           Admin   Actif   MDPDefini
echo ------------------------------------------------
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $adminGroups=@('Administrators','Administrateurs'); $admins=@(); foreach($g in $adminGroups){ try{ $admins+=$(Get-LocalGroupMember -Group $g -ErrorAction Stop | ForEach-Object { $_.Name.Split('\\')[-1] }) } catch{} }; $admins = $admins | Sort-Object -Unique; Get-LocalUser | Where-Object Enabled | Sort-Object Name | ForEach-Object { $u=$_; $has=$false; try { $pls = $u | Select-Object -ExpandProperty PasswordLastSet -ErrorAction Stop; if ($pls) { $has=$true } } catch {}; if (-not $has) { try { $nu = net user \"$($u.Name)\" 2>$null; $line = $nu | Where-Object { $_ -match '^(Password last set|Dernier changement du mot de passe)\s+' }; if ($line) { $val = ($line -split '\\s{2,}',2)[1].Trim(); if ($val -and $val -notmatch '^(Never|Jamais)$') { $has=$true } } } catch {} }; if (-not $has -and $u.PasswordRequired) { $has=$true }; [PSCustomObject]@{ Utilisateur=$u.Name; Admin= if($admins -contains $u.Name){'Oui'}else{'Non'}; Actif= if($u.Enabled){'Oui'}else{'Non'}; MDPDefini= if($has){'Oui'}else{'Non'} } } | Format-Table -AutoSize -HideTableHeaders" || echo Erreur lors de la liste
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
call :show_active
set /p NEWU=Nom d'utilisateur a ajouter ^> 
:: NOTE: la liste des utilisateurs actifs est affichée juste au-dessus
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
if /I "%ADDADM%"=="O" net localgroup "%ADMIN_GROUP%" "%NEWU%" /add
echo Utilisateur cree.
pause
goto :menu

:del
cls
call :show_active
set /p DELU=Nom d'utilisateur a supprimer ^> 
if "%DELU%"=="" goto :menu
set /p CONF=Confirmer la suppression de '%DELU%' ? (O/N) ^> 
if /I not "%CONF%"=="O" goto :menu
:: Retrait du groupe Admin si present
net localgroup "%ADMIN_GROUP%" "%DELU%" /delete >nul 2>nul
net user "%DELU%" /delete
if %errorlevel%==0 (echo Utilisateur supprime.) else (echo Echec de suppression.)
pause
goto :menu

:admin
cls
call :show_active
set /p UADM=Nom d'utilisateur (ajout/retrait admin) ^> 
if "%UADM%"=="" goto :menu
set /p OP=Choisir l'action pour '%UADM%': (1) Ajouter aux Administrateurs  (2) Retirer des Administrateurs ^> 
if "%OP%"=="1" (
	net localgroup "%ADMIN_GROUP%" "%UADM%" /add
    if %errorlevel%==0 (echo '%UADM%' a ete ajoute aux Administrateurs.) else (echo Echec.)
) else if "%OP%"=="2" (
	net localgroup "%ADMIN_GROUP%" "%UADM%" /delete
    if %errorlevel%==0 (echo '%UADM%' a ete retire des Administrateurs.) else (echo Echec.)
) else (
	echo Choix invalide.
)
pause
goto :menu

:reset
cls
call :show_active
set /p RUSER=Utilisateur ^> 
if "%RUSER%"=="" goto :menu
set /p RNEWP=Nouveau mot de passe ^> 
net user "%RUSER%" "%RNEWP%"
if %errorlevel%==0 (echo Mot de passe mis a jour.) else (echo Echec.)
pause
goto :menu

:show_active
echo.
echo Utilisateurs actifs:
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-LocalUser | Where-Object Enabled | Sort-Object Name | Select-Object -ExpandProperty Name | ForEach-Object { $_ }" 2>nul
echo.
goto :eof

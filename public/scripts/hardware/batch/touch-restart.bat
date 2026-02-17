@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
chcp 65001 >nul
title Redemarrage Pilote Tactile
echo.
echo Redemarrage du service TabletInputService...
net stop TabletInputService >nul 2>&1
timeout /t 2 /nobreak >nul
net start TabletInputService >nul 2>&1
echo.
echo Redemarrage du service HidServ...
net stop HidServ >nul 2>&1
timeout /t 2 /nobreak >nul
net start HidServ >nul 2>&1
echo.
echo Reactivation du peripherique tactile via PowerShell...
powershell -Command "& { $touchDevices = Get-PnpDevice | Where-Object { ($_.FriendlyName -like '*HID*' -and ($_.FriendlyName -like '*tactile*' -or $_.FriendlyName -like '*touch*')) -or ($_.Class -eq 'HIDClass' -and $_.FriendlyName -like '*ecran*') }; if ($touchDevices) { foreach ($device in $touchDevices) { Write-Host 'Desactivation:' $device.FriendlyName; Disable-PnpDevice -InstanceId $device.InstanceId -Confirm:$false }; Start-Sleep -Seconds 2; foreach ($device in $touchDevices) { Write-Host 'Reactivation:' $device.FriendlyName; Enable-PnpDevice -InstanceId $device.InstanceId -Confirm:$false } } else { Write-Host 'Aucun peripherique tactile trouve' } }"
echo.
pause

@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
echo Generation de la liste des pilotes...
driverquery /v > "%USERPROFILE%\Desktop\Pilotes_installes.txt"
echo.
echo Liste enregistree sur le Bureau : Pilotes_installes.txt
pause

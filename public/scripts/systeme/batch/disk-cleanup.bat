@echo off
if not defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)
cleanmgr

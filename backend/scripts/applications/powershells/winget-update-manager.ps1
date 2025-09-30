<#
  Gestionnaire de mises à jour via winget (Windows 10/11)
  - Option 1: winget update (liste/choix)
  - Option 2: winget update --all (tout mettre à jour)
  Exécuter en administrateur pour éviter les échecs d'installation.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Clear-Host

Write-Host '==============================================='
Write-Host '      GESTIONNAIRE WINGET - MISES A JOUR'
Write-Host '==============================================='
Write-Host ''
Write-Host '  1) Mettre à jour une application (liste et choix)'
Write-Host '  2) Mettre à jour toutes les applications'
Write-Host '  3) Quitter'
Write-Host ''

function Pause-Return() {
  Write-Host ''
  Write-Host 'Appuyez sur une touche pour revenir au menu...'
  [void][System.Console]::ReadKey($true)
}

while ($true) {
  $choice = Read-Host 'Choisissez une option (1-3)'
  switch ($choice) {
    '1' {
      Clear-Host
      Write-Host '=== winget update ==='
      try {
        winget update
      } catch {
        Write-Host "Erreur: $($_.Exception.Message)"
      }
      Pause-Return
    }
    '2' {
      Clear-Host
      Write-Host '=== winget update --all ==='
      try {
        winget update --all --accept-package-agreements --accept-source-agreements
      } catch {
        Write-Host "Erreur: $($_.Exception.Message)"
      }
      Write-Host ''
      Write-Host 'Terminé.'
      Pause-Return
    }
    '3' { break }
    Default {
      Write-Host 'Choix invalide.'
    }
  }
}



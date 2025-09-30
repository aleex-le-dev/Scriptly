<#
  Affiche une boîte de dialogue Windows pour tester l'exécution PowerShell depuis l'app.
  Usage: powershell -ExecutionPolicy Bypass -File .\backend\scripts\powershell\test-message.ps1
#>

try {
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show("Salut Alex ! Ceci est un message de test.", "Test") | Out-Null
  exit 0
}
catch {
  Write-Host "[test-message.ps1] Error: $($_.Exception.Message)"
  exit 0
}


try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 | Out-Null } catch {}

Write-Host "`nGestionnaire de disque interactif (DiskPart)" -ForegroundColor Cyan

# Créer un script temporaire qui liste les disques
$listScript = @"
list disk
exit
"@

$listFile = New-TemporaryFile
$listScript | Out-File -FilePath $listFile -Encoding ASCII

# Lancer DiskPart pour lister les disques (fenetre elevee)
Write-Host "`nDisques disponibles (fenetre DiskPart):"
Start-Process diskpart.exe -ArgumentList "/s `"$listFile`"" -Verb RunAs -Wait

# Afficher aussi une liste depuis PowerShell (fallbacks)
Write-Host "`nDisques (console actuelle):"
$listed = $false
try {
  $d = Get-Disk -ErrorAction Stop | Select-Object Number, FriendlyName, BusType, Size
  if ($d) { $d | Format-Table -AutoSize | Out-Host; $listed = $true }
} catch {}
if (-not $listed) {
  try {
    $w = Get-WmiObject Win32_DiskDrive -ErrorAction Stop | Select-Object Index, Model, InterfaceType, Size
    if ($w) { $w | Format-Table -AutoSize | Out-Host; $listed = $true }
  } catch {}
}
if (-not $listed) {
  try {
    $wmic = wmic diskdrive get Index,Model,InterfaceType,Size 2>$null
    if ($wmic) { Write-Host $wmic; $listed = $true }
  } catch {}
}
if (-not $listed) {
  Write-Host "Impossible d'afficher la liste dans cette console. Utilisez la fenetre DiskPart."
}

# Pause pour laisser le temps de consulter
Read-Host "`nAppuyez sur Entree pour continuer"

# Demander le numéro du disque à manipuler
$diskNumber = Read-Host "`nEntrez le numero du disque a formater (ex: 0, 1...)"

# Créer le script DiskPart pour formater et assigner
$dpScript = @"
select disk $diskNumber
clean
create partition primary
format fs=ntfs quick
assign
exit
"@

$dpFile = New-TemporaryFile
$dpScript | Out-File -FilePath $dpFile -Encoding ASCII

# Lancer DiskPart pour exécuter le script sur le disque choisi
Write-Host "`nExecution de DiskPart sur le disque $diskNumber..."
Start-Process diskpart.exe -ArgumentList "/s `"$dpFile`"" -Verb RunAs -Wait

Write-Host "`nOperation terminee. Fermez la fenetre si necessaire."
Read-Host "`nAppuyez sur Entree pour fermer"

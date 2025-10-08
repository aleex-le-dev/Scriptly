# Defragmenter un disque via Optimize-Volume (ASCII only)
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 | Out-Null } catch {}

# Lister les volumes pour aider l'utilisateur
$volumes = Get-Volume | Select-Object DriveLetter, FileSystem, Size, SizeRemaining, HealthStatus
Write-Host "`nLecteurs disponibles:" -ForegroundColor Cyan
Write-Host ("{0,-5} {1,-10} {2,10} {3,10} {4,15}" -f "Lettre", "FS", "Taille(Go)", "Libre(Go)", "Sante") -ForegroundColor Yellow
Write-Host ("-----------------------------------------------")
foreach ($v in $volumes) {
  $sizeGB = [math]::Round(($v.Size/1GB), 2)
  $freeGB = [math]::Round(($v.SizeRemaining/1GB), 2)
  Write-Host ("{0,-5} {1,-10} {2,10} {3,10} {4,15}" -f $v.DriveLetter, $v.FileSystem, $sizeGB, $freeGB, $v.HealthStatus)
}

$drive = Read-Host "Entrez la lettre du lecteur a defragmenter"
Write-Host ("`nDefragmentation de {0} ..." -f $drive)
Optimize-Volume -DriveLetter $drive -Defrag -Verbose
Read-Host "`nAppuyez sur Entree pour fermer"



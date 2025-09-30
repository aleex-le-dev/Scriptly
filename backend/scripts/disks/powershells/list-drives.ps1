try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 | Out-Null } catch {}

# Recuperer les volumes logiques
$volumes = Get-Volume | Select-Object DriveLetter, FileSystem, Size, SizeRemaining, HealthStatus

Write-Host "`nLecteurs disponibles:" -ForegroundColor Cyan
Write-Host ("{0,-5} {1,-10} {2,10} {3,10} {4,15}" -f "Lettre", "FS", "Taille(Go)", "Libre(Go)", "Sante") -ForegroundColor Yellow
Write-Host ("-----------------------------------------------")

foreach ($v in $volumes) {
    $sizeGB = [math]::Round(($v.Size/1GB), 2)
    $freeGB = [math]::Round(($v.SizeRemaining/1GB), 2)
    # Coloration selon l'espace libre
    if ($freeGB -lt ($sizeGB * 0.1)) { $color = "Red" }
    elseif ($freeGB -lt ($sizeGB * 0.25)) { $color = "Yellow" }
    else { $color = "Green" }
    Write-Host ("{0,-5} {1,-10} {2,10} {3,10} {4,15}" -f $v.DriveLetter, $v.FileSystem, $sizeGB, $freeGB, $v.HealthStatus) -ForegroundColor $color
}

Read-Host "`nAppuyez sur Entree pour fermer"



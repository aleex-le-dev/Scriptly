# Verifier BitLocker pour une lettre donnee (ASCII only)
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 | Out-Null } catch {}

# Lister d'abord les lecteurs disponibles
$drives = Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root
Write-Host "Lecteurs disponibles:" -ForegroundColor Cyan
foreach ($d in $drives) { Write-Host ("{0} -> {1}" -f $d.Name, $d.Root) }

$drive = Read-Host "Entrez la lettre du lecteur a verifier BitLocker"
Write-Host ("`nStatut BitLocker pour {0}:" -f $drive)
manage-bde -status ("{0}:" -f $drive)
Read-Host "`nAppuyez sur Entree pour fermer"



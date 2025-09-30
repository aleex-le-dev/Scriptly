# Desactiver BitLocker (manage-bde -off <DriveLetter>:)
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 | Out-Null } catch {}

$drives = Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root
Write-Host "Lecteurs disponibles:" -ForegroundColor Cyan
foreach ($d in $drives) { Write-Host ("{0} -> {1}" -f $d.Name, $d.Root) }

$drive = Read-Host "Entrez la lettre du lecteur a dechiffrer (manage-bde -off)"
Write-Host ("`nDesactivation de BitLocker sur {0}:" -f $drive)
manage-bde -off ("{0}:" -f $drive)
Read-Host "`nAppuyez sur Entree pour fermer"

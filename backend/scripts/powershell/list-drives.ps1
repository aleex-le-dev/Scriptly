Get-PSDrive -PSProvider FileSystem |
Select-Object Name, Root, Free, Used |
ConvertTo-Json -Compress

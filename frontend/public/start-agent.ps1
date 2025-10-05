# Simple local agent HTTP (PowerShell) to execute predefined scripts safely
param(
  [int]$Port = 3001,
  [string]$Url
)

# Self-elevate to Administrator if not already elevated
function Ensure-Admin {
  $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
  $isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) {
    $psi = @(
      '-NoProfile',
      '-ExecutionPolicy','Bypass',
      '-NoExit',
      '-File',"`"$PSCommandPath`"",
      '-Port',"$Port"
    )
    Start-Process -FilePath 'powershell.exe' -ArgumentList $psi -Verb RunAs | Out-Null
    exit 0
  }
}

Ensure-Admin

# Ensure UTF-8 console output
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
try {
  $listener.Start()
} catch {
  if ($_.Exception.Message -match 'Access is denied|refusé') {
    Write-Host "Ajout de l'URLACL pour $prefix..."
    try {
      Start-Process -FilePath 'netsh' -ArgumentList @('http','add','urlacl',"url=$prefix","user=Everyone") -Verb RunAs -WindowStyle Hidden -Wait | Out-Null
      $listener.Start()
    } catch {
      Write-Host "Échec démarrage: $($_.Exception.Message)" -ForegroundColor Red
      Read-Host "Appuyez sur Entrée pour fermer"
      exit 1
    }
  } else {
    Write-Host "Échec démarrage: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour fermer"
    exit 1
  }
}

Write-Host "Agent démarré sur $prefix"

function Add-CorsHeaders($response) {
  $response.Headers.Add('Access-Control-Allow-Origin','*')
  $response.Headers.Add('Access-Control-Allow-Methods','GET,POST,OPTIONS')
  $response.Headers.Add('Access-Control-Allow-Headers','Content-Type,Accept')
}

function Send-Json($context, $obj, $code=200) {
  $json = ($obj | ConvertTo-Json -Compress)
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $context.Response.StatusCode = $code
  $context.Response.ContentType = 'application/json'
  Add-CorsHeaders $context.Response
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.Close()
}

function Run-Cmd([string]$File, [string[]]$Args) {
  Start-Process -FilePath $File -ArgumentList $Args -Verb RunAs | Out-Null
}
function Run-Action($action) {
  switch ($action) {
    'check-bitlocker-admin' { Run-Cmd 'cmd.exe' @('/c','start','','powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','manage-bde -status') }
    'bitlocker-off-admin'   { Run-Cmd 'cmd.exe' @('/c','start','','powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','manage-bde -off C:') }
    'chkdsk-ui'             { Run-Cmd 'powershell.exe' @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','chkdsk') }
    'defrag-ui'             { Run-Cmd 'powershell.exe' @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','defrag /U /V C:') }
    'format-drive-ui'       { Run-Cmd 'powershell.exe' @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','diskpart') }
    'format-drive-admin'    { Run-Cmd 'cmd.exe' @('/c','start','','powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','diskpart') }
    default { return $false }
  }
  return $true
}

# If launched with a protocol URL, perform immediate run(s)
if ($Url) {
  try {
    $u = [System.Uri]$Url
    $q = Parse-QueryString $u.Query
    $run = $q['run']
    if ($run) {
      foreach ($a in ($run -split ',')) { [void](Run-Action ($a.Trim().ToLower())) }
    }
  } catch { }
}


# Minimal query string parser (no System.Web dependency)
function Parse-QueryString([string]$raw) {
  $result = @{}
  if ([string]::IsNullOrWhiteSpace($raw)) { return $result }
  if ($raw.StartsWith('?')) { $raw = $raw.Substring(1) }
  foreach ($pair in ($raw -split '&')) {
    if ([string]::IsNullOrWhiteSpace($pair)) { continue }
    $kv = $pair -split '=', 2
    $k = [System.Uri]::UnescapeDataString($kv[0])
    $v = if ($kv.Count -gt 1) { [System.Uri]::UnescapeDataString($kv[1]) } else { '' }
    $result[$k] = $v
  }
  return $result
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $path = $request.Url.AbsolutePath
    $query = Parse-QueryString $request.Url.Query

    # Preflight CORS
    if ($request.HttpMethod -eq 'OPTIONS') {
      Add-CorsHeaders $context.Response
      $context.Response.StatusCode = 204
      $context.Response.Close()
      continue
    }

    if ($path -eq '/health') {
      Send-Json $context @{ status = 'ok' }
      continue
    }

    if ($path -eq '/run' -and $request.HttpMethod -eq 'POST') {
      $action = $query['action']
      switch ($action) {
        'check-bitlocker-admin' { Run-Cmd 'cmd.exe' @('/c','start','','powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','manage-bde -status') }
        'bitlocker-off-admin'   { Run-Cmd 'cmd.exe' @('/c','start','','powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','manage-bde -off C:') }
        'chkdsk-ui'             { Run-Cmd 'powershell.exe' @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','chkdsk') }
        'defrag-ui'             { Run-Cmd 'powershell.exe' @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','defrag /U /V C:') }
        'format-drive-ui'       { Run-Cmd 'powershell.exe' @('-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','diskpart') }
        'format-drive-admin'    { Run-Cmd 'cmd.exe' @('/c','start','','powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-NoExit','-Command','diskpart') }
        default { Send-Json $context @{ ok = $false; error = 'Unknown action' } 400; continue }
      }
      Send-Json $context @{ ok = $true }
      continue
    }

    Send-Json $context @{ error = 'Not Found' } 404
  }
} catch {
  Write-Host "Erreur d'exécution: $($_.Exception.Message)" -ForegroundColor Red
  Read-Host "Appuyez sur Entrée pour fermer"
}

$listener.Stop()


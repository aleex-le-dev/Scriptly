# Simple local agent HTTP (PowerShell) to execute predefined scripts safely
param(
  [int]$Port = 3001
)

Add-Type -AssemblyName System.Net.HttpListener
$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Agent démarré sur $prefix"

function Send-Json($context, $obj, $code=200) {
  $json = ($obj | ConvertTo-Json -Compress)
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $context.Response.StatusCode = $code
  $context.Response.ContentType = 'application/json'
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.Close()
}

function Run-Cmd([string]$File, [string[]]$Args) {
  Start-Process -FilePath $File -ArgumentList $Args -Verb RunAs | Out-Null
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $path = $request.Url.AbsolutePath
  $query = [System.Web.HttpUtility]::ParseQueryString($request.Url.Query)

  try {
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
  } catch {
    Send-Json $context @{ error = $_.Exception.Message } 500
  }
}

$listener.Stop()


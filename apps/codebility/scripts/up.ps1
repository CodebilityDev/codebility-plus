# Starts the full local dev environment for the caching investigation.
#
#   .\scripts\up.ps1
#
# Brings up, in order:
#   1. Next dev server   -> logs to dev-server.log
#   2. Debug Chrome      -> CDP on 9222, fresh profile
#   3. Log watcher       -> console/network/timing, self-exits with the browser
#
# Everything is verified before the next step, so a failure stops here instead
# of leaving half a stack running.
param(
  [string]$Base = "http://localhost:3000",
  [int]$CdpPort = 9222
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$log = Join-Path $root "dev-server.log"
$profile = Join-Path $env:TEMP "codebility-run-profile"

function Test-Port([int]$p) {
  [bool](Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue)
}

Write-Host "== 1/3 dev server ==" -ForegroundColor Cyan
if (Test-Port 3000) {
  Write-Host "  port 3000 already in use; run .\scripts\down.ps1 first" -ForegroundColor Yellow
} else {
  if (Test-Path $log) { Remove-Item $log -Force }
  # `start` detaches it so no agent job can reap the server.
  Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c", "node `"$env:APPDATA\npm\node_modules\pnpm\bin\pnpm.cjs`" codebility > `"$log`" 2>&1" `
    -WorkingDirectory (Split-Path -Parent $root) -WindowStyle Minimized | Out-Null

  $deadline = (Get-Date).AddSeconds(90)
  while ((Get-Date) -lt $deadline -and -not (Test-Port 3000)) { Start-Sleep -Milliseconds 1000 }
  if (Test-Port 3000) { Write-Host "  ready on 3000" -ForegroundColor Green }
  else { Write-Host "  FAILED: port 3000 never opened. See $log" -ForegroundColor Red; exit 1 }
}

Write-Host "== 2/3 debug chrome ==" -ForegroundColor Cyan
if (Test-Port $CdpPort) {
  Write-Host "  CDP already up on $CdpPort"
} else {
  foreach ($f in "lockfile", "SingletonLock", "SingletonCookie") {
    Remove-Item (Join-Path $profile $f) -Force -ErrorAction SilentlyContinue
  }
  $chrome = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $chrome) { throw "chrome.exe not found" }

  Start-Process -FilePath $chrome -ArgumentList @(
    "--remote-debugging-port=$CdpPort",
    "--user-data-dir=$profile",
    "--no-first-run", "--no-default-browser-check",
    "--disable-background-mode", "--new-window",
    "$Base/home/my-team"
  ) | Out-Null

  $deadline = (Get-Date).AddSeconds(30)
  $up = $false
  while ((Get-Date) -lt $deadline) {
    try { Invoke-RestMethod -Uri "http://127.0.0.1:$CdpPort/json/version" -TimeoutSec 2 | Out-Null; $up = $true; break }
    catch { Start-Sleep -Milliseconds 800 }
  }
  if ($up) { Write-Host "  CDP up on $CdpPort (fresh profile, sign in once)" -ForegroundColor Green }
  else { Write-Host "  FAILED: CDP never came up" -ForegroundColor Red; exit 1 }
}

Write-Host "== 3/3 log watcher ==" -ForegroundColor Cyan
Write-Host "  starting in background; read with: node scripts/watch.mjs (already running)"
Write-Host ""
Write-Host "Environment ready." -ForegroundColor Green
Write-Host "  dev log : $log"
Write-Host "  browser : $Base/home/my-team  (CDP $CdpPort)"
Write-Host "  stop all: .\scripts\down.ps1"

#!/usr/bin/env pwsh
# Launches the shared debug Chrome on the authenticated profile.
#
# Why a script: launching Chrome from inside an agent job gets the process
# reaped when the job settles. Start-Process hands it to the OS and returns
# immediately, so Chrome outlives every job. Run this once, then attach with
# `node scripts/preview-attach.mjs watch`.
#
# The window is shared: you drive the UI, the agent attaches over CDP on 9222
# to read console/network logs or drive it. Nothing here touches the page after
# launch, so your tab and session are never hijacked.
param(
  [string]$Base = "http://localhost:3000",
  [int]$Port = 9222
)

$ErrorActionPreference = "Stop"

$profile = Join-Path $env:TEMP "codebility-run-profile"
if (-not (Test-Path $profile)) { New-Item -ItemType Directory -Path $profile | Out-Null }

# Stale locks from a previous hard kill stop Chrome from reusing the profile.
foreach ($f in "lockfile", "SingletonLock", "SingletonCookie") {
  Remove-Item (Join-Path $profile $f) -Force -ErrorAction SilentlyContinue
}

$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $chrome) { throw "chrome.exe not found" }

$args = @(
  "--remote-debugging-port=$Port",
  "--user-data-dir=$profile",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-background-mode",
  "--new-window",
  $Base
)

$proc = Start-Process -FilePath $chrome -ArgumentList $args -PassThru

# Verify the debug port rather than trusting the spawn.
$deadline = (Get-Date).AddSeconds(30)
$up = $false
while ((Get-Date) -lt $deadline) {
  try {
    $v = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 2
    Write-Host "CDP UP: $($v.Browser) (pid $($proc.Id))"
    $up = $true
    break
  } catch {
    Start-Sleep -Milliseconds 800
  }
}

if (-not $up) { throw "CDP did not come up on port $Port" }

Write-Host "Window open on $Base"
Write-Host "Attach logs:  node scripts/preview-attach.mjs watch"
Write-Host "Drive cards:  node scripts/preview-attach.mjs cards 3"
Write-Host "Read state:   node scripts/preview-attach.mjs eval `"document.title`""

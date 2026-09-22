# Stops everything up.ps1 started, deterministically.
#
#   .\scripts\down.ps1              # stop processes, keep logs and profile
#   .\scripts\down.ps1 -Purge       # also delete .next and the Chrome profile
#
# Kills by port owner and PID file rather than by process name, so it never
# touches unrelated node/chrome processes (which is how the earlier cleanup
# managed to kill its own shell).
param(
  [switch]$Purge,
  [int]$CdpPort = 9222
)

$root = Split-Path -Parent $PSScriptRoot
$watchPid = Join-Path $env:TEMP "codebility-watch.pid"
$profile = Join-Path $env:TEMP "codebility-run-profile"

Write-Host "== stopping ==" -ForegroundColor Cyan

# 1. Watcher, by PID file.
if (Test-Path $watchPid) {
  $wpid = Get-Content $watchPid -ErrorAction SilentlyContinue
  if ($wpid) {
    Stop-Process -Id $wpid -Force -ErrorAction SilentlyContinue
    Write-Host "  watcher (pid $wpid) stopped"
  }
  Remove-Item $watchPid -Force -ErrorAction SilentlyContinue
} else {
  Write-Host "  no watcher pid file"
}

# 2. Chrome, by the CDP port owner.
try {
  $tabs = Invoke-RestMethod -Uri "http://127.0.0.1:$CdpPort/json/version" -TimeoutSec 3
  $chromePids = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
    Where-Object { $_.CommandLine -match "remote-debugging-port=$CdpPort" } |
    Select-Object -ExpandProperty ProcessId
  foreach ($p in $chromePids) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
  Write-Host "  chrome ($($chromePids.Count) proc) stopped"
} catch {
  Write-Host "  chrome already down"
}

# 3. Dev server, by port 3000 owner and its descendants.
$owner = (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue).OwningProcess
if ($owner) {
  # Stop children first, then the owner.
  Get-CimInstance Win32_Process -Filter "ParentProcessId=$owner" -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Stop-Process -Id $owner -Force -ErrorAction SilentlyContinue
  Write-Host "  dev server (pid $owner) stopped"
} else {
  Write-Host "  port 3000 already free"
}

# 4. Orphaned turbo/tsc wrappers whose parents are gone.
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object {
    $_.CommandLine -match "turbo.*run dev|typescript.*--watch" -and
    $_.CommandLine -notmatch "dsh-subprocess"
  } | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Host "  orphan node $($_.ProcessId) stopped"
  }

Start-Sleep -Seconds 2
Write-Host ""
Write-Host "== ports ==" -ForegroundColor Cyan
foreach ($p in 3000, 3001, $CdpPort) {
  if (Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "  $p still held" -ForegroundColor Yellow
  } else {
    Write-Host "  $p free" -ForegroundColor Green
  }
}

if ($Purge) {
  Write-Host ""
  Write-Host "== purge ==" -ForegroundColor Cyan
  foreach ($path in @((Join-Path $root ".next"), $profile)) {
    if (Test-Path $path) {
      try {
        # Long-path prefix: Next's image cache exceeds MAX_PATH and resists normal deletion.
        Remove-Item -LiteralPath "\\?\$path" -Recurse -Force -ErrorAction Stop
        Write-Host "  deleted $path"
      } catch {
        Write-Host "  FAILED $path : $($_.Exception.Message)" -ForegroundColor Yellow
      }
    }
  }
}

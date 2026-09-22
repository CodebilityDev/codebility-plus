@echo off
REM Launches the shared debug Chrome on the authenticated profile, fully outside
REM the agent's job tree so no job reaper can kill it. Chrome stays open until
REM the user closes the window. Logs stream from preview-attach.mjs, not here.
setlocal
set PROFILE=%TEMP%\codebility-run-profile
set PORT=9222
set BASE=http://localhost:3000

if not exist "%PROFILE%" mkdir "%PROFILE%"

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=%PORT% ^
  --user-data-dir="%PROFILE%" ^
  --no-first-run ^
  --no-default-browser-check ^
  --disable-features=Translate,OptimizationHints ^
  --disable-background-mode ^
  --new-window ^
  "%BASE%"

echo Launched Chrome on %BASE% with CDP on %PORT%.
echo Profile: %PROFILE%

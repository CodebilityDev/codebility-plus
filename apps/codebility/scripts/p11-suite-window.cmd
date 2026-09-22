@echo off
REM Opens Chrome on the shared suite profile, outside the agent's job tree so no
REM job reaper kills it. Sign in here; p11-suite-capture.mjs then pulls the
REM session out over CDP without ever owning the browser.
setlocal
set PROFILE=%TEMP%\codebility-p11-suite-auth
set PORT=9333
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
  "%BASE%/auth/sign-in"

echo Chrome launched. Profile: %PROFILE%  CDP: %PORT%

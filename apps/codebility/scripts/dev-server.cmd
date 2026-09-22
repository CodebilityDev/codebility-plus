@echo off
REM Starts the codebility dev server detached, with stdout+stderr going to
REM dev-server.log so the agent can read server-side output on demand.
REM
REM Launched via `start` so the server is not a child of any agent job and
REM survives job settlement. The window is minimized; closing it stops the
REM server.
setlocal
set ROOT=C:\Users\Programming\Desktop\Projects\Compile\Work\codebility-plus
set LOG=%ROOT%\apps\codebility\dev-server.log

cd /d "%ROOT%"

REM Fresh log per launch so tailing is unambiguous.
if exist "%LOG%" del /q "%LOG%"

echo Dev server launching. Log: %LOG%
echo Wait for "Ready in" before using the browser.

start "codebility-dev" /min cmd /c "node ""%APPDATA%\npm\node_modules\pnpm\bin\pnpm.cjs"" codebility > ""%LOG%"" 2>&1"

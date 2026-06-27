param(
  [int]$Port = 8081,
  [switch]$KillExisting,
  [switch]$SeedDemo
)

$ErrorActionPreference = "Stop"

Write-Host "Starting FleetFlow backend on port $Port..." -ForegroundColor Cyan

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if ($listener) {
  $owningPid = $listener[0].OwningProcess
  if (-not $KillExisting) {
    Write-Host "Port $Port is already in use by PID $owningPid." -ForegroundColor Yellow
    Write-Host "Re-run with -KillExisting to stop it automatically." -ForegroundColor Yellow
    exit 1
  }

  Write-Host "Stopping process on port $Port (PID $owningPid)..." -ForegroundColor Yellow
  Stop-Process -Id $owningPid -Force
}

$env:SERVER_PORT = "$Port"
$env:APP_SEED_ENABLED = if ($SeedDemo) { "true" } else { "false" }
mvn spring-boot:run


@echo off
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8765/shutdown' -Method Post -Headers @{'X-Signal-School-Local'='1'} -TimeoutSec 3 | Out-Null } catch { Write-Host 'No compatible Signal School server is running.' }"

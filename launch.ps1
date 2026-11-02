$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'app-window.ps1')
$url = 'http://localhost:8765/'
function Test-SignalSchool {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri ($url + 'health') -TimeoutSec 1
        return $response.Content -eq 'signal-school-local-v1'
    } catch { return $false }
}
try {
    if (-not (Test-SignalSchool)) {
        $serverPath = Join-Path $PSScriptRoot 'server.ps1'
        $serverProcess = Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -PassThru -ArgumentList @(
            '-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $serverPath + '"'), '-NoBrowser'
        )
        $ready = $false
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            if (Test-SignalSchool) { $ready = $true; break }
            if ($serverProcess.HasExited) { break }
            Start-Sleep -Milliseconds 200
        }
        if (-not $ready) { throw 'The local synth server could not start. Check whether another app is using port 8765.' }
    }
    Open-SignalSchoolWindow -Url $url
} catch {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Signal School', 'OK', 'Error') | Out-Null
    exit 1
}

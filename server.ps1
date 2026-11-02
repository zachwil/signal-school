param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$port = 8765
$url = "http://localhost:$port/"
. (Join-Path $PSScriptRoot 'app-window.ps1')
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try { $listener.Start() } catch {
    try {
        $existing = Invoke-WebRequest -UseBasicParsing -Uri ($url + 'health') -TimeoutSec 2
        if ($existing.Content -eq 'signal-school-local-v1') {
            if (-not $NoBrowser) { Open-SignalSchoolWindow -Url $url }
            exit 0
        }
    } catch { }
    Write-Host "Could not start Signal School on port $port. Close another app using that port, then try again." -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}
Write-Host ''
Write-Host '  SIGNAL SCHOOL / Local synth laboratory' -ForegroundColor Green
Write-Host '  Signal School opens in its own app window.'
Write-Host '  Keep this window open while playing. Close it to stop the server.'
Write-Host ''
if (-not $NoBrowser) {
    Open-SignalSchoolWindow -Url $url
}
$routes = @{'/'='index.html'; '/index.html'='index.html'; '/app.js'='app.js'; '/style.css'='style.css'}
$types = @{'.html'='text/html; charset=utf-8'; '.js'='application/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'}
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $response = $context.Response
            $path = $context.Request.Url.AbsolutePath
            if ($path -eq '/shutdown' -and $context.Request.HttpMethod -eq 'POST' -and $context.Request.Headers['X-Signal-School-Local'] -eq '1') {
                $bytes=[Text.Encoding]::UTF8.GetBytes('Signal School server stopped')
                $response.ContentLength64=$bytes.Length
                $response.OutputStream.Write($bytes,0,$bytes.Length)
                break
            }
            elseif ($context.Request.HttpMethod -notin @('GET','HEAD')) { $response.StatusCode = 405; $bytes = [Text.Encoding]::UTF8.GetBytes('Method not allowed') }
            elseif ($path -eq '/health') { $response.ContentType='text/plain'; $bytes=[Text.Encoding]::UTF8.GetBytes('signal-school-local-v1') }
            elseif ($routes.ContainsKey($path)) { $file=Join-Path $PSScriptRoot $routes[$path]; $response.ContentType=$types[[IO.Path]::GetExtension($file)]; $bytes=[IO.File]::ReadAllBytes($file) }
            else { $response.StatusCode=404; $bytes=[Text.Encoding]::UTF8.GetBytes('Not found') }
            $response.Headers.Add('Cache-Control','no-store')
            $response.ContentLength64=$bytes.Length
            if ($context.Request.HttpMethod -ne 'HEAD') { $response.OutputStream.Write($bytes,0,$bytes.Length) }
        } catch { Write-Host ('Request ended: ' + $_.Exception.Message) } finally { $context.Response.Close() }
    }
} finally { $listener.Stop(); $listener.Close() }

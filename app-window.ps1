function Open-SignalSchoolWindow {
    param([string]$Url = 'http://localhost:8765/')
    $candidates = @(
        "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
        "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
        "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    $browserPath = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if (-not $browserPath) {
        throw 'Signal School needs Microsoft Edge or Google Chrome installed to open its standalone window.'
    }
    # Reuse the existing profile so local patches, progress, and MIDI access persist.
    Start-Process -FilePath $browserPath -ArgumentList @("--app=$Url", '--window-size=1360,940')
}

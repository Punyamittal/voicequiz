# PowerShell script to kill process on port 5000
Write-Host "Finding process on port 5000..." -ForegroundColor Yellow

$port = 5000
$connections = netstat -ano | findstr ":$port"

if ($connections) {
    Write-Host "Found processes on port $port:" -ForegroundColor Green
    Write-Host $connections
    
    # Extract PIDs
    $pids = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $matches[1]
        }
    } | Select-Object -Unique
    
    foreach ($pid in $pids) {
        Write-Host "Killing process $pid..." -ForegroundColor Yellow
        taskkill /PID $pid /F
    }
    
    Write-Host "Done! Port $port is now free." -ForegroundColor Green
} else {
    Write-Host "No process found on port $port" -ForegroundColor Green
}


# MySQL Startup Helper Script
Write-Host "=== MySQL Startup Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check for MySQL services
$mysqlServices = @("MySQL", "MySQL80", "MySQL57", "MySQL*")
$found = $false

foreach ($pattern in $mysqlServices) {
    $services = Get-Service -Name $pattern -ErrorAction SilentlyContinue
    foreach ($service in $services) {
        Write-Host "Found MySQL service: $($service.Name) - Status: $($service.Status)" -ForegroundColor Yellow
        
        if ($service.Status -ne 'Running') {
            Write-Host "Attempting to start MySQL service..." -ForegroundColor Yellow
            try {
                Start-Service -Name $service.Name -ErrorAction Stop
                Start-Sleep -Seconds 3
                $service.Refresh()
                if ($service.Status -eq 'Running') {
                    Write-Host "✓ MySQL service started successfully!" -ForegroundColor Green
                    $found = $true
                    break
                }
            } catch {
                Write-Host "✗ Failed to start service: $_" -ForegroundColor Red
                Write-Host "  You may need to run this script as Administrator" -ForegroundColor Yellow
            }
        } else {
            Write-Host "✓ MySQL is already running!" -ForegroundColor Green
            $found = $true
            break
        }
    }
    if ($found) { break }
}

# Check for XAMPP
if (-not $found) {
    $xamppPath = "C:\xampp\mysql\bin\mysqld.exe"
    if (Test-Path $xamppPath) {
        Write-Host "`nFound XAMPP MySQL at: $xamppPath" -ForegroundColor Yellow
        Write-Host "Please start MySQL from XAMPP Control Panel" -ForegroundColor Cyan
        Write-Host "Or run: C:\xampp\mysql_start.bat" -ForegroundColor Cyan
        $found = $true
    }
}

# Check for WAMP
if (-not $found) {
    $wampDirs = Get-ChildItem "C:\wamp64\bin\mysql" -ErrorAction SilentlyContinue
    if ($wampDirs) {
        Write-Host "`nFound WAMP MySQL" -ForegroundColor Yellow
        Write-Host "Please start MySQL from WAMP Control Panel" -ForegroundColor Cyan
        $found = $true
    }
}

if (-not $found) {
    Write-Host "`n❌ MySQL not found!" -ForegroundColor Red
    Write-Host "`nPlease choose one:" -ForegroundColor Yellow
    Write-Host "1. Install MySQL Server: https://dev.mysql.com/downloads/installer/" -ForegroundColor White
    Write-Host "2. Install XAMPP (includes MySQL): https://www.apachefriends.org/" -ForegroundColor White
    Write-Host "3. Start MySQL manually from Services (Win+R → services.msc)" -ForegroundColor White
}

# Test connection
Write-Host "`n=== Testing MySQL Connection ===" -ForegroundColor Cyan
Start-Sleep -Seconds 2
$testResult = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($testResult) {
    Write-Host "✓ MySQL is accessible on port 3306!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure your .env file has the correct MySQL password" -ForegroundColor White
    Write-Host "2. Create the database: mysql -u root -p database.sql" -ForegroundColor White
    Write-Host "   (Or: Get-Content database.sql | mysql -u root -p)" -ForegroundColor White
    Write-Host "3. Test connection: node test-db-connection.js" -ForegroundColor White
} else {
    Write-Host "✗ MySQL is still not accessible on port 3306" -ForegroundColor Red
    Write-Host "  Please start MySQL and try again" -ForegroundColor Yellow
}


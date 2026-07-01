# SARAI Ecosystem PostgreSQL Setup Script
# This script creates the database and applies the schema

$postgresPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$setupSqlPath = Join-Path $projectRoot "setup.sql"

Write-Host "=== SARAI Ecosystem Database Setup ===" -ForegroundColor Green
Write-Host ""

# Step 1: Create the database
Write-Host "Step 1: Creating 'sarai' database..." -ForegroundColor Cyan
& $postgresPath -U postgres -c "CREATE DATABASE sarai;" 2>&1
Write-Host "Database creation command executed" -ForegroundColor Green

Write-Host ""

# Step 2: Apply schema and create test users
Write-Host "Step 2: Applying schema and creating test users..." -ForegroundColor Cyan
& $postgresPath -U postgres -d sarai -f $setupSqlPath 2>&1
Write-Host "Schema applied successfully" -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Test Users Created:" -ForegroundColor Cyan
Write-Host "  Admin:  admin@dost.gov.ph / password123" -ForegroundColor Yellow
Write-Host "  Staff:  staff@dost.gov.ph / password123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Verify .env file has correct DATABASE_URL"
Write-Host "  2. Run: npm run dev"
Write-Host "  3. Visit: http://localhost:3000/login"

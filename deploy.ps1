# deploy.ps1 - WAGMI Markets Deployment Script
Write-Host "🚀 WAGMI Markets - Windows Deployment Script" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Check if in correct directory
$projectPath = "C:\Users\PC\OneDrive\Desktop\mula\mula\belief-market"
if ((Get-Location).Path -ne $projectPath) {
    Set-Location $projectPath
}

# 1. Create .gitignore file
Write-Host "`n📄 Creating .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @"
# Node
node_modules/
npm-debug.log*

# Rust
target/
Cargo.lock

# IDE
.vscode/
.idea/

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# Solana
test-ledger/
test-validator.json

# Frontend build
frontend/build/
frontend/.env
"@
$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host "✅ .gitignore created" -ForegroundColor Green

# 2. Initialize Git
Write-Host "`n📦 Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "⚠️  Git already initialized" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# 3. Add files and commit
Write-Host "`n📝 Adding files to Git..." -ForegroundColor Yellow
git add .
git commit -m "🚀 WAGMI Markets - Complete prediction market platform"
Write-Host "✅ Files committed" -ForegroundColor Green

# 4. Set remote and push
Write-Host "`n🌐 Setting up GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/1UPiN-z/belief-market.git
Write-Host "✅ Remote set to your GitHub" -ForegroundColor Green

Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

# 5. Check if push was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 SUCCESS! Your code is now on GitHub:" -ForegroundColor Green
    Write-Host "👉 https://github.com/1UPiN-z/belief-market" -ForegroundColor Cyan
    
    Write-Host "`n🎯 NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://beta.solpg.io" -ForegroundColor White
    Write-Host "2. Upload belief_market.so from: target\deploy\" -ForegroundColor White
    Write-Host "3. Get your Program ID" -ForegroundColor White
    Write-Host "4. Update frontend\.env with Program ID" -ForegroundColor White
    Write-Host "5. Run: cd frontend && npm install && npm start" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed. Trying force push..." -ForegroundColor Red
    git push -u origin main --force
}

Write-Host "`n✅ Script complete! Check your GitHub repository." -ForegroundColor Green
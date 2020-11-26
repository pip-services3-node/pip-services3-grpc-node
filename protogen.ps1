#!/usr/bin/env pwsh

##Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# Get component data and set necessary variables
$component = Get-Content -Path "component.json" | ConvertFrom-Json

$docsImage="$($component.registry)/$($component.name):$($component.version)-$($component.build)-proto"
$container=$component.name

# Remove old generate files
if (Test-Path "src/protos") {
    Remove-Item -Path "src/protos/*" -Force -Include *.js 
}

if (Test-Path "test/protos") {
    Remove-Item -Path "test/protos/*" -Force -Include *.js 
    Remove-Item -Path "test/protos/*" -Force -Include *.d.ts 
}

# Build docker image
docker build -f docker/Dockerfile.proto -t $docsImage .

# Create and copy compiled files, then destroy
docker create --name $container $docsImage
docker cp "$($container):/app/src/protos" ./src/
docker cp "$($container):/app/test/protos" ./test/
docker rm $container

param(
  [string]$ConfigPath = "scripts/media-imports.json",
  [string]$ManifestPath = "public/media/uploads/manifest.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$configFile = Join-Path $projectRoot $ConfigPath
$manifestFile = Join-Path $projectRoot $ManifestPath

if (-not (Test-Path $configFile)) {
  throw "Config file not found: $configFile"
}
if (-not (Test-Path $manifestFile)) {
  throw "Manifest file not found: $manifestFile"
}

$configObj = (Get-Content $configFile -Raw) | ConvertFrom-Json
$imports = if ($null -ne $configObj.imports) { @($configObj.imports) } else { @($configObj) }
$manifestRaw = (Get-Content $manifestFile -Raw) | ConvertFrom-Json
$manifest = if ($manifestRaw -is [System.Array]) { $manifestRaw } else { @($manifestRaw) }

$rows = @()
foreach ($entry in $imports) {
  $albumId = [string]$entry.albumId
  $sourcePath = [string]$entry.sourcePath
  $exists = Test-Path -LiteralPath $sourcePath
  $manifestCount = ($manifest | Where-Object { $_.albumId -eq $albumId } | Measure-Object).Count
  $rows += [PSCustomObject]@{
    albumId = $albumId
    sourceExists = $exists
    manifestItems = $manifestCount
    sourcePath = $sourcePath
  }
}

$rows | Format-Table -AutoSize

$missing = @($rows | Where-Object { -not $_.sourceExists })
if ($missing.Count -gt 0) {
  Write-Warning "Some source paths are missing."
  exit 1
}

Write-Host "Media import check passed."

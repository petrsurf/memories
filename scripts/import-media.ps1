param(
  [string]$ConfigPath = "scripts/media-imports.json",
  [switch]$CleanAlbums = $true,
  [int]$MaxFileMb = 95
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Slug {
  param([Parameter(Mandatory = $true)][string]$Value)
  $slug = $Value.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")
  if ([string]::IsNullOrWhiteSpace($slug)) { return "album" }
  return $slug
}

function To-Title {
  param([Parameter(Mandatory = $true)][string]$Value)
  return ($Value -replace "[-_]+", " ").Trim()
}

function Get-SourceName {
  param([Parameter(Mandatory = $true)][string]$PathValue)
  $item = Get-Item -LiteralPath $PathValue
  if ($item.PSIsContainer) {
    return (Split-Path -Path $PathValue -Leaf)
  }
  return [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
}

function Get-Hash10 {
  param([Parameter(Mandatory = $true)][string]$FilePath)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    $stream = [System.IO.File]::OpenRead($FilePath)
    try {
      $bytes = $sha.ComputeHash($stream)
    } finally {
      $stream.Dispose()
    }
  } finally {
    $sha.Dispose()
  }
  $hex = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLowerInvariant()
  return $hex.Substring(0, 10)
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$configFile = Join-Path $projectRoot $ConfigPath
$uploadsRoot = Join-Path $projectRoot "public/media/uploads"
$albumsRoot = Join-Path $uploadsRoot "albums"
$manifestPath = Join-Path $uploadsRoot "manifest.json"

if (-not (Test-Path $configFile)) {
  throw "Config file not found: $configFile"
}

$configJson = Get-Content $configFile -Raw
$configObj = $configJson | ConvertFrom-Json
$imports = @()
if ($null -ne $configObj.imports) {
  $imports = @($configObj.imports)
} else {
  $imports = @($configObj)
}

if ($imports.Count -eq 0) {
  throw "No imports found in config: $configFile"
}

New-Item -ItemType Directory -Path $albumsRoot -Force | Out-Null
if ($CleanAlbums) {
  Get-ChildItem -Path $albumsRoot -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
}

$allowedImage = @(".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg")
$allowedVideo = @(".mp4", ".mov", ".webm", ".m4v", ".avi")
$maxBytes = $MaxFileMb * 1MB

$manifest = New-Object System.Collections.Generic.List[object]
$stats = @()

foreach ($entry in $imports) {
  $sourcePath = [string]$entry.sourcePath
  if ([string]::IsNullOrWhiteSpace($sourcePath) -or -not (Test-Path $sourcePath)) {
    Write-Warning "Skipping missing path: $sourcePath"
    continue
  }

  $sourceName = Get-SourceName -PathValue $sourcePath
  $entryAlbumId = $null
  $entryAlbumName = $null
  if ($entry.PSObject.Properties.Name -contains "albumId") {
    $entryAlbumId = [string]$entry.albumId
  }
  if ($entry.PSObject.Properties.Name -contains "albumName") {
    $entryAlbumName = [string]$entry.albumName
  }
  $albumId = if (-not [string]::IsNullOrWhiteSpace($entryAlbumId)) { $entryAlbumId } else { Get-Slug -Value $sourceName }
  $albumName = if (-not [string]::IsNullOrWhiteSpace($entryAlbumName)) { $entryAlbumName } else { $sourceName }
  $albumDir = Join-Path $albumsRoot $albumId
  New-Item -ItemType Directory -Path $albumDir -Force | Out-Null

  $copied = 0
  $skipped = 0
  $sourceItem = Get-Item -LiteralPath $sourcePath
  if ($sourceItem.PSIsContainer) {
    $files = Get-ChildItem -Path $sourcePath -Recurse -File | Sort-Object FullName
  } else {
    $files = @($sourceItem)
  }

  foreach ($file in $files) {
    $ext = $file.Extension.ToLowerInvariant()
    $type = $null
    if ($allowedImage -contains $ext) { $type = "image" }
    if ($allowedVideo -contains $ext) { $type = "video" }
    if ($null -eq $type) { continue }

    if ($file.Length -gt $maxBytes) {
      $skipped++
      Write-Warning "Skipped large file (> $MaxFileMb MB): $($file.FullName)"
      continue
    }

    $baseSlug = Get-Slug -Value $file.BaseName
    if ($baseSlug.Length -gt 24) {
      $baseSlug = $baseSlug.Substring(0, 24).Trim("-")
    }
    $hash = Get-Hash10 -FilePath $file.FullName
    $destFile = "$baseSlug-$hash$ext"
    $destPath = Join-Path $albumDir $destFile
    Copy-Item -Path $file.FullName -Destination $destPath -Force

    $title = To-Title -Value $file.BaseName
    $alt = "$albumName - $title"
    $id = "upload-$albumId-$hash"
    $timestamp = [DateTimeOffset]::new($file.LastWriteTimeUtc).ToUnixTimeMilliseconds()

    $manifest.Add([ordered]@{
        id = $id
        title = $title
        albumName = $albumName
        alt = $alt
        type = $type
        albumId = $albumId
        timestamp = $timestamp
        filename = $destFile
        sizeBytes = $file.Length
      })
    $copied++
  }

  $stats += [PSCustomObject]@{
    albumId = $albumId
    albumName = $albumName
    copied = $copied
    skipped = $skipped
    sourcePath = $sourcePath
  }
}

$manifestJson = $manifest | ConvertTo-Json -Depth 5
$manifestJson | Set-Content -Path $manifestPath -Encoding UTF8

if (-not (Test-Path (Join-Path $uploadsRoot ".gitkeep"))) {
  Set-Content -Path (Join-Path $uploadsRoot ".gitkeep") -Value ""
}

Write-Host "Media import complete."
Write-Host "Manifest: $manifestPath"
Write-Host "Total items: $($manifest.Count)"
$stats | Format-Table -AutoSize

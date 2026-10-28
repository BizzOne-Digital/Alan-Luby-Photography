$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Rebuild the serif AL as native Bezier geometry; outline the complete wordmark.
# Geometry is intentionally independent of the generated raster references.
$workspaceDirectory = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$outputDirectory = Join-Path $workspaceDirectory 'public\brand\premium-v1\vector'
$invariant = [System.Globalization.CultureInfo]::InvariantCulture
function Number([double]$value) { return $value.ToString('0.###', $invariant) }

function Get-OutlinedText([string]$text, [string]$familyName, [single]$tracking, [double]$x, [double]$y, [double]$width, [double]$height) {
    $family = [System.Drawing.FontFamily]::new($familyName)
    $font = [System.Drawing.Font]::new($family, 200, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $bitmap = [System.Drawing.Bitmap]::new(1, 1)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $format = [System.Drawing.StringFormat]::GenericTypographic.Clone()
    $format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::MeasureTrailingSpaces
    $outline = [System.Drawing.Drawing2D.GraphicsPath]::new()
    [single]$cursor = 0
    foreach ($character in $text.ToCharArray()) {
        $glyph = [string]$character
        $outline.AddString($glyph, $family, 0, 200, [System.Drawing.PointF]::new($cursor, 0), $format)
        $advance = $graphics.MeasureString($glyph, $font, 10000, $format).Width
        $cursor += $advance + $tracking
    }
    $bounds = $outline.GetBounds()
    $points = $outline.PathPoints
    $types = $outline.PathTypes
    $sx = $width / $bounds.Width
    $sy = $height / $bounds.Height
    $builder = [System.Text.StringBuilder]::new()
    for ($i = 0; $i -lt $points.Length; $i++) {
        $type = $types[$i] -band 7
        $px = $x + ($points[$i].X - $bounds.X) * $sx
        $py = $y + ($points[$i].Y - $bounds.Y) * $sy
        if ($type -eq 0) {
            [void]$builder.Append('M').Append((Number $px)).Append(' ').Append((Number $py))
        } elseif ($type -eq 1) {
            [void]$builder.Append('L').Append((Number $px)).Append(' ').Append((Number $py))
        } elseif ($type -eq 3) {
            [void]$builder.Append('C')
            for ($j = 0; $j -lt 3; $j++) {
                $bx = $x + ($points[$i+$j].X - $bounds.X) * $sx
                $by = $y + ($points[$i+$j].Y - $bounds.Y) * $sy
                if ($j -gt 0) { [void]$builder.Append(' ') }
                [void]$builder.Append((Number $bx)).Append(' ').Append((Number $by))
            }
            $i += 2
        } else { throw "Unexpected glyph path type: $type" }
        if (($types[$i] -band 128) -ne 0) { [void]$builder.Append('Z') }
    }
    $result = $builder.ToString()
    $outline.Dispose()
    $format.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    $font.Dispose()
    $family.Dispose()
    return $result
}

$aPath = 'M0 691 C49 681 62 653 91 606 L408 96 H424 L693 654 C709 687 719 698 742 709 V722 H618 L486 484 H210 L151 577 C125 616 125 638 142 660 C157 680 181 689 205 691 V713 H0 Z M230 448 H472 L369 229 Z'
$lUpperPath = 'M416 0 H703 V23 C641 25 624 46 624 96 V473 L491 191 V94 C491 43 475 24 416 23 Z'
$lLowerPath = 'M467 503 L604 721 C611 734 623 743 642 743 H788 C895 743 962 706 1003 589 H1020 V783 H387 V765 C449 761 467 742 467 680 Z'
$cornerPath = 'M717 102 H968 V386 H924 V146 H717 Z'
$wordmark = Get-OutlinedText 'ALAN LUBY' 'Times New Roman' 13 610 163 1480 169
$descriptor = Get-OutlinedText 'PHOTOGRAPHY' 'Arial' 92 772 393 1156 49

function Get-Symbol([string]$ink, [string]$accent, [string]$transform) {
    return @"
  <g transform="$transform" aria-label="AL monogram">
    <path fill="$ink" d="$lUpperPath"/>
    <path fill="$ink" d="$lLowerPath"/>
    <path fill="$ink" fill-rule="evenodd" d="$aPath"/>
    <path fill="$accent" d="$cornerPath"/>
  </g>
"@
}

function Write-Logo([string]$name, [bool]$compact, [string]$ink, [string]$accent) {
    if ($compact) {
        $viewBox = '0 0 640 640'
        $size = 'width="640" height="640"'
        $symbol = Get-Symbol $ink $accent 'translate(60 120.35) scale(0.509803922)'
        $content = $symbol
        $title = 'ALAN LUBY / PHOTOGRAPHY - AL monogram'
    } else {
        $viewBox = '0 0 2160 530'
        $size = 'width="2160" height="530"'
        $symbol = Get-Symbol $ink $accent 'translate(70 80) scale(0.47)'
        $content = @"
$symbol
  <g fill="$ink" fill-rule="evenodd">
    <path aria-label="ALAN LUBY" d="$wordmark"/>
    <path aria-label="PHOTOGRAPHY" d="$descriptor"/>
  </g>
"@
        $title = 'ALAN LUBY / PHOTOGRAPHY - primary logo'
    }
    $svg = @"
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" $size viewBox="$viewBox" role="img" aria-labelledby="logo-title logo-description">
  <title id="logo-title">$title</title>
  <desc id="logo-description">Alan Luby Photography. Interlocking serif AL initials with an open photographic framing corner. Transparent background; all lettering is outlined vector geometry.</desc>
$content
</svg>
"@
    $path = Join-Path $outputDirectory $name
    [System.IO.File]::WriteAllText($path, $svg, [System.Text.UTF8Encoding]::new($false))
    [xml]$checked = Get-Content -LiteralPath $path -Raw
    $namespace = [System.Xml.XmlNamespaceManager]::new($checked.NameTable)
    $namespace.AddNamespace('s', 'http://www.w3.org/2000/svg')
    if ($checked.SelectNodes('//s:text | //s:image | //s:rect', $namespace).Count -ne 0) {
        throw "Unexpected live type, raster image or background shape in $name"
    }
    [PSCustomObject]@{ File = $name; Paths = $checked.SelectNodes('//s:path', $namespace).Count; Bytes = (Get-Item -LiteralPath $path).Length }
}

Write-Logo 'primary.svg' $false '#242422' '#A38A58'
Write-Logo 'monogram.svg' $true '#242422' '#A38A58'
Write-Logo 'primary-black.svg' $false '#000000' '#000000'
Write-Logo 'primary-white.svg' $false '#FFFFFF' '#FFFFFF'
Write-Logo 'monogram-black.svg' $true '#000000' '#000000'
Write-Logo 'monogram-white.svg' $true '#FFFFFF' '#FFFFFF'

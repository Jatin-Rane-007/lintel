# Regenerates every raster the app ships from the Lintel mark geometry.
#
# The mark is drawn from one unit box (176 x 152): a lintel beam across two
# posts with an ember point in the opening. Everything below is that box scaled
# to a canvas, so the icon, the adaptive layer and the splash can never drift
# apart. Run:  pwsh -File scripts/brand-assets.ps1
#
# Source of truth: lintel-brand-kit/ (logo/svg/lintel-symbol-primary.svg and
# android/res/drawable/ic_launcher_foreground.xml both encode this same box).

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'assets/brand'
New-Item -ItemType Directory -Force -Path (Join-Path $out 'web') | Out-Null

$ink = [System.Drawing.ColorTranslator]::FromHtml('#141413')
$paper = [System.Drawing.ColorTranslator]::FromHtml('#faf9f5')
$ember = [System.Drawing.ColorTranslator]::FromHtml('#d97757')

# Unit box, in mark-local units.
$UNIT_W = 176.0
$UNIT_H = 152.0
$BEAM_H = 32.0
$POST_W = 32.0
$POST_X = 20.0
$DOT_R = 16.0
$DOT_CY = 100.0

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  return @($bmp, $g)
}

# Draws the mark with its beam left edge at $x and its beam top at $y.
function Draw-Mark($g, [double]$x, [double]$y, [double]$width, $postColor, $dotColor) {
  $s = $width / $UNIT_W
  $beam = New-Object System.Drawing.SolidBrush($postColor)
  $dot = New-Object System.Drawing.SolidBrush($dotColor)

  $g.FillRectangle($beam, [single]$x, [single]$y, [single]($UNIT_W * $s), [single]($BEAM_H * $s))
  $g.FillRectangle($beam, [single]($x + $POST_X * $s), [single]($y + $BEAM_H * $s),
    [single]($POST_W * $s), [single](($UNIT_H - $BEAM_H) * $s))
  $g.FillRectangle($beam, [single]($x + ($UNIT_W - $POST_X - $POST_W) * $s), [single]($y + $BEAM_H * $s),
    [single]($POST_W * $s), [single](($UNIT_H - $BEAM_H) * $s))

  $r = $DOT_R * $s
  $g.FillEllipse($dot, [single]($x + ($UNIT_W / 2) * $s - $r), [single]($y + $DOT_CY * $s - $r),
    [single]($r * 2), [single]($r * 2))

  $beam.Dispose()
  $dot.Dispose()
}

function Save-Png($bmp, [string]$path) {
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

# --- App icon: full-bleed ink, paper mark, ember point -----------------------
# 1024 px. The mark is set at 560 px wide and nudged 8 px below the geometric
# centre: the beam carries its weight at the top, so a mathematically centred
# doorway reads high.
$size = 1024
$markW = 560.0
$markH = $markW * $UNIT_H / $UNIT_W
$mk = New-Canvas $size $size
$mk[1].Clear($ink)
Draw-Mark $mk[1] ((($size - $markW) / 2)) ((($size - $markH) / 2) + 8) $markW $paper $ember
Save-Png $mk[0] (Join-Path $out 'app-icon.png')
$mk[0].Dispose(); $mk[1].Dispose()

# --- Android adaptive layers ------------------------------------------------
# The foreground keeps the kit's geometry: beam 500 px of 1080-equivalent
# canvas, well inside the 66 dp safe zone, so no launcher mask clips it.
$fg = New-Canvas 1024 1024
$fgW = 500.4
$fgH = $fgW * $UNIT_H / $UNIT_W
Draw-Mark $fg[1] ((1024 - $fgW) / 2) ((1024 - $fgH) / 2) $fgW $paper $ember
Save-Png $fg[0] (Join-Path $out 'android-icon-foreground.png')
$fg[0].Dispose(); $fg[1].Dispose()

# Monochrome layer: one shape, the system tints it. Ember is dropped to a
# single-colour silhouette, as Android requires.
$mono = New-Canvas 1024 1024
Draw-Mark $mono[1] ((1024 - $fgW) / 2) ((1024 - $fgH) / 2) $fgW ([System.Drawing.Color]::Black) ([System.Drawing.Color]::Black)
Save-Png $mono[0] (Join-Path $out 'android-icon-monochrome.png')
$mono[0].Dispose(); $mono[1].Dispose()

$bg = New-Canvas 1024 1024
$bg[1].Clear($ink)
Save-Png $bg[0] (Join-Path $out 'android-icon-background.png')
$bg[0].Dispose(); $bg[1].Dispose()

# --- Splash marks -----------------------------------------------------------
# Transparent, and cropped tight to the mark with only a hair of padding at the
# foot so the posts end rather than run off the edge of the screen.
function New-SplashMark([string]$path, $glyph) {
  $w = 768.0
  $h = $w * $UNIT_H / $UNIT_W
  $pad = $w * 0.02
  $canvasH = [int][math]::Ceiling($h + $pad)
  $c = New-Canvas ([int]$w) $canvasH
  Draw-Mark $c[1] 0 0 $w $glyph $ember
  Save-Png $c[0] $path
  $c[0].Dispose(); $c[1].Dispose()
}

New-SplashMark (Join-Path $out 'splash-mark-light.png') $ink
New-SplashMark (Join-Path $out 'splash-mark-dark.png') $paper

# --- Web icons --------------------------------------------------------------
# Same tile as the app icon, downsampled with high-quality bicubic.
$iconMaster = New-Object System.Drawing.Bitmap((Join-Path $out 'app-icon.png'))
foreach ($entry in @(
    @{ Name = 'favicon-32.png'; Size = 32 },
    @{ Name = 'icon-192.png'; Size = 192 },
    @{ Name = 'icon-512.png'; Size = 512 },
    @{ Name = 'apple-touch-icon.png'; Size = 180 }
  )) {
  $n = $entry.Size
  $small = New-Object System.Drawing.Bitmap($n, $n)
  $sg = [System.Drawing.Graphics]::FromImage($small)
  $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $sg.DrawImage($iconMaster, (New-Object System.Drawing.Rectangle(0, 0, $n, $n)))
  Save-Png $small (Join-Path $out ('web/' + $entry.Name))
  $sg.Dispose(); $small.Dispose()
}
$iconMaster.Dispose()

Write-Host "Wrote brand assets to $out"

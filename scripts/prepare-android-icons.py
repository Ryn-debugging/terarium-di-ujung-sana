#!/usr/bin/env python3
"""
Generate Android launcher & adaptive foreground icons from icons/icon-512.png
and apply dark atmospheric theme colors (#07090c) inside generated android/ res.
"""
import os
import re
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC_ICON = ROOT / "icons" / "icon-512.png"
RES_DIR = ROOT / "android" / "app" / "src" / "main" / "res"
APP_GRADLE = ROOT / "android" / "app" / "build.gradle"

LEGACY_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

ADAPTIVE_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def make_round(img: Image.Image) -> Image.Image:
    size = img.size[0]
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def main() -> None:
    if not SRC_ICON.exists():
        raise FileNotFoundError(f"Missing icon source: {SRC_ICON}")
    if not RES_DIR.exists():
        raise FileNotFoundError(f"Missing Android res dir: {RES_DIR}")

    base = Image.open(SRC_ICON).convert("RGBA")

    # Remove default Capacitor template vector foregrounds if present so mipmaps never clash
    for stale in RES_DIR.glob("drawable*/ic_launcher_foreground.*"):
        stale.unlink(missing_ok=True)

    for folder, size in LEGACY_SIZES.items():
        target_dir = RES_DIR / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        sq = base.resize((size, size), Image.Resampling.LANCZOS)
        sq.save(target_dir / "ic_launcher.png")
        make_round(sq).save(target_dir / "ic_launcher_round.png")

    for folder, size in ADAPTIVE_SIZES.items():
        target_dir = RES_DIR / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        canvas = Image.new("RGBA", (size, size), (7, 9, 12, 255))
        safe_dim = int(size * 0.72)
        inset = base.resize((safe_dim, safe_dim), Image.Resampling.LANCZOS)
        offset = (size - safe_dim) // 2
        canvas.paste(inset, (offset, offset), inset)
        canvas.save(target_dir / "ic_launcher_foreground.png")

    values_dir = RES_DIR / "values"
    values_dir.mkdir(parents=True, exist_ok=True)
    bg_color_xml = values_dir / "ic_launcher_background.xml"
    bg_color_xml.write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<resources>\n'
        '    <color name="ic_launcher_background">#07090c</color>\n'
        '</resources>\n',
        encoding="utf-8",
    )

    anydpi_dir = RES_DIR / "mipmap-anydpi-v26"
    anydpi_dir.mkdir(parents=True, exist_ok=True)
    adaptive_xml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        '    <background android:drawable="@color/ic_launcher_background"/>\n'
        '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n'
        '</adaptive-icon>\n'
    )
    (anydpi_dir / "ic_launcher.xml").write_text(adaptive_xml, encoding="utf-8")
    (anydpi_dir / "ic_launcher_round.xml").write_text(adaptive_xml, encoding="utf-8")

    # Also update splash images if present so cold start stays obsidian dark
    for splash_path in RES_DIR.glob("drawable*/splash.png"):
        try:
            with Image.open(splash_path) as existing_splash:
                w, h = existing_splash.size
            splash = Image.new("RGBA", (w, h), (7, 9, 12, 255))
            icon_s = min(w, h) // 4
            inset = base.resize((icon_s, icon_s), Image.Resampling.LANCZOS)
            splash.paste(inset, ((w - icon_s) // 2, (h - icon_s) // 2), inset)
            splash.save(splash_path)
        except Exception:
            pass

    styles_xml = values_dir / "styles.xml"
    if styles_xml.exists():
        txt = styles_xml.read_text(encoding="utf-8")
        if "android:statusBarColor" not in txt and "<style name=\"AppTheme.NoActionBar\"" in txt:
            txt = txt.replace(
                "<style name=\"AppTheme.NoActionBar\" parent=\"Theme.AppCompat.DayNight.NoActionBar\">",
                "<style name=\"AppTheme.NoActionBar\" parent=\"Theme.AppCompat.DayNight.NoActionBar\">\n"
                "        <item name=\"android:statusBarColor\">#07090c</item>\n"
                "        <item name=\"android:navigationBarColor\">#07090c</item>",
            )
            styles_xml.write_text(txt, encoding="utf-8")

    if APP_GRADLE.exists():
        gradle_txt = APP_GRADLE.read_text(encoding="utf-8")
        gradle_txt = re.sub(r'versionCode\s+\d+', 'versionCode 3', gradle_txt)
        gradle_txt = re.sub(r'versionName\s+"[^"]+"', 'versionName "3.0.0"', gradle_txt)
        APP_GRADLE.write_text(gradle_txt, encoding="utf-8")

    print("Prepared Android launcher icons, styles & versionCode 3 (3.0.0) cleanly.")


if __name__ == "__main__":
    main()

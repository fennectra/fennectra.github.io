"""
Generate all favicon/icon sizes from sigle.png for Fennectra website.
Run: python generate-icons.py
"""

from PIL import Image
import os

SRC = "sigle.png"
OUT_DIR = "icons"

# Icon sizes needed
SIZES = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "apple-touch-icon.png": 180,
    "icon-192x192.png": 192,
    "icon-512x512.png": 512,
}

def generate():
    os.makedirs(OUT_DIR, exist_ok=True)

    img = Image.open(SRC).convert("RGBA")
    print(f"Source: {SRC} ({img.size[0]}x{img.size[1]})")

    for name, size in SIZES.items():
        resized = img.resize((size, size), Image.LANCZOS)
        path = os.path.join(OUT_DIR, name)
        resized.save(path, "PNG", optimize=True)
        print(f"  -> {path} ({size}x{size})")

    # Generate favicon.ico (multi-size)
    ico_sizes = [16, 32, 48]
    ico_images = [img.resize((s, s), Image.LANCZOS) for s in ico_sizes]
    ico_path = "favicon.ico"
    ico_images[0].save(ico_path, format="ICO", sizes=[(s, s) for s in ico_sizes],
                       append_images=ico_images[1:])
    print(f"  -> {ico_path} (multi-size: {ico_sizes})")

    # Generate OG image (1200x630) with fennec_logo centered on dark bg
    og_width, og_height = 1200, 630
    og = Image.new("RGB", (og_width, og_height), (8, 12, 16))
    logo = Image.open("fennec_logo.png").convert("RGBA")

    # Scale logo to fit with padding
    max_w = int(og_width * 0.85)
    max_h = int(og_height * 0.7)
    ratio = min(max_w / logo.width, max_h / logo.height)
    new_w = int(logo.width * ratio)
    new_h = int(logo.height * ratio)
    logo_resized = logo.resize((new_w, new_h), Image.LANCZOS)

    x = (og_width - new_w) // 2
    y = (og_height - new_h) // 2
    og.paste(logo_resized, (x, y), logo_resized)
    og_path = os.path.join(OUT_DIR, "og-image.png")
    og.save(og_path, "PNG", optimize=True)
    print(f"  -> {og_path} (1200x630 OG image)")

    print("\nDone! All icons generated.")

if __name__ == "__main__":
    generate()

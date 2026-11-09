"""Render products from the 3D studio to webp files in each site's products/ folder.
Usage: python _studio/render.py [id-prefix ...]   (no args = all)"""
import sys, time, base64
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parent.parent
SITE = {'mv':'perfume-shopify','fn':'perfume-webflow','pp':'perfume-wordpress','hc':'skincare-shopify','ms':'skincare-webflow','sb':'skincare-wordpress','mo':'jewelry-shopify','av':'jewelry-webflow','ce':'jewelry-wordpress'}
want = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", args=["--use-angle=default", "--enable-gpu", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width": 1000, "height": 1250})
    logs = []; pg.on("console", lambda m: logs.append(m.text)); pg.on("pageerror", lambda e: logs.append("ERR " + str(e)))
    pg.goto("http://127.0.0.1:8765/_studio/studio.html")
    pg.wait_for_function("window.studioReady === true", timeout=60000)
    pg.evaluate("document.fonts.load('400 40px Georgia')")
    ids = pg.evaluate("window.productIds")
    if want: ids = [i for i in ids if any(i == w or i.startswith(w) for w in want)]
    for i in ids:
        t = time.time(); url = pg.evaluate(f"window.renderProduct('{i}')")
        pre, rest = i.split('-', 1); out = ROOT / SITE[pre] / 'products'; out.mkdir(exist_ok=True)
        (out / f"{rest}.webp").write_bytes(base64.b64decode(url.split(',', 1)[1]))
        print(f"{i:28} {time.time()-t:5.1f}s")
    if logs: print("console:", logs[:6])
    b.close()

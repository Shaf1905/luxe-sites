"""Edge screenshots (plays H.264): desktop viewport, desktop full (scrolled), mobile viewport + full. Prints QA."""
import sys, time, json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
site = Path(sys.argv[1]).resolve(); out = site / "shots"; out.mkdir(exist_ok=True)
url = (site / "index.html").as_uri()
QA = """() => ({overflow: document.documentElement.scrollWidth > innerWidth + 1,
  wide:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('[data-rail]')}).slice(0,4).map(e=>e.tagName+'.'+(typeof e.className==='string'?e.className.split(' ')[0]:'')),
  fonts:[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/"/g,'')))],
  vids:[...document.querySelectorAll('video')].map(v=>v.readyState), broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src.slice(-40))})"""
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    for name, w, h in [("desktop", 1440, 900), ("mobile", 390, 844)]:
        pg = b.new_page(viewport={"width": w, "height": h}); errs = []
        pg.on("console", lambda m: m.type == "error" and errs.append(m.text[:120]))
        pg.on("pageerror", lambda e: errs.append(str(e)[:120]))
        pg.goto(url); time.sleep(5)
        pg.screenshot(path=str(out / f"{name}.png"))
        H = pg.evaluate("document.documentElement.scrollHeight"); y = 0
        while y < H: pg.evaluate(f"scrollTo(0,{y})"); time.sleep(.2); y += h // 2
        time.sleep(1.5); pg.evaluate("scrollTo(0,0)"); time.sleep(.6)
        pg.screenshot(path=str(out / f"{name}-full.png"), full_page=True)
        print(name, json.dumps(pg.evaluate(QA)), "errors:", errs)
        pg.close()
    b.close()

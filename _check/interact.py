import time
from pathlib import Path
from playwright.sync_api import sync_playwright
u = lambda s: (Path(s)/'index.html').resolve().as_uri()
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge"); errs=[]
    pg = b.new_page(viewport={"width":1440,"height":900}); pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(u('jewelry-shopify')); time.sleep(2); pg.click('.metal-opt[data-m="silver"]'); pg.locator('#collection').scroll_into_view_if_needed(); time.sleep(1.5)
    print('molten:', pg.inner_text('#metalName'), pg.inner_text('.card [data-price]'))
    pg.click('[data-add="pour-ring"]'); print('  cart count', pg.inner_text('#cartCount'))
    pg.screenshot(path='_check/molten-silver.png')
    pg.goto(u('skincare-shopify')); time.sleep(1.5); pg.click('#toggle [data-r="pm"]'); time.sleep(.3)
    print('halcyon pm steps:', pg.locator('#steps li').count(), pg.inner_text('#sum')); pg.click('#addRoutine'); time.sleep(.6); print('  bag', pg.inner_text('#cartCount'))
    pg.goto(u('perfume-wordpress')); time.sleep(1.5)
    for q,v in [(0,'night'),(1,'rose'),(2,'room')]: pg.click(f'.q[data-q="{q}"] [data-v="{v}"]'); time.sleep(.45)
    print('petal finder ->', pg.inner_text('#result h3'))
    pg.goto(u('jewelry-wordpress')); time.sleep(2); pg.fill('#txt','Margaret'); pg.click('[data-style="script"]'); pg.click('[data-metal="au"]'); pg.locator('#studio').scroll_into_view_if_needed(); time.sleep(1.2)
    print('celeste engraving:', pg.text_content('#engraving'), pg.get_attribute('#engraving','font-family'), pg.inner_text('#price'))
    pg.screenshot(path='_check/celeste-engrave.png')
    pg.goto(u('jewelry-webflow')); time.sleep(2); top = pg.evaluate("document.getElementById('gallery').offsetTop")
    pg.evaluate(f"scrollTo(0,{top}+innerHeight*1.2)"); time.sleep(1.5); print('aveline track x:', pg.evaluate("getComputedStyle(document.getElementById('track')).transform"))
    pg.screenshot(path='_check/aveline-gallery.png')
    pg.goto(u('skincare-wordpress')); time.sleep(1.5); pg.click('[data-f="dry"]'); print('sable dry:', pg.inner_text('#fc'))
    print('errors:', errs); b.close()

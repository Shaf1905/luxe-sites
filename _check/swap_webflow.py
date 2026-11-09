import re
exec(open('_check/swap_shopify.py').read().split('IMGCSS')[0])  # reuse edit()
# ---- Flore Noire: row thumbs + cursor-follow bottle
s = open('perfume-webflow/index.html', encoding='utf-8').read()
imgs = {'#C4183C':'pavot', '#B9A7C9':'iris', '#E9E2CF':'tubereuse', '#C9893F':'osmanthe'}
for col, f in imgs.items():
    s, n = re.subn(r'data-color="' + re.escape(col) + r'"><svg class="fragrance_thumb".*?</svg>', f'data-img="products/{f}.webp"><img class="fragrance_thumb" src="products/{f}.webp" alt="" loading="lazy">', s, flags=re.S, count=1)
    assert n, col
s, n = re.subn(r'<div class="cursor-bottle" id="cursorBottle" aria-hidden="true">.*?</svg>\n</div>', '<div class="cursor-bottle" id="cursorBottle" aria-hidden="true"><img id="cbImg" src="products/pavot.webp" alt=""></div>', s, flags=re.S); assert n
s = s.replace(".cursor-bottle{position:fixed;left:0;top:0;z-index:15;width:180px;height:300px;", ".cursor-bottle{position:fixed;left:0;top:0;z-index:15;width:260px;height:325px;border-radius:18px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6);")
s = s.replace(".cursor-bottle.is-active{opacity:1;transform:translate(-50%,-50%) scale(1)}", ".cursor-bottle.is-active{opacity:1;transform:translate(-50%,-50%) scale(1)}\n.cursor-bottle img{width:100%;height:100%;object-fit:cover}")
s = s.replace(".fragrance_thumb{display:none}", ".fragrance_thumb{display:none;border-radius:8px;object-fit:cover;aspect-ratio:4/5}")
s = s.replace("  const cb = d.getElementById('cursorBottle'), liq = d.getElementById('cbLiquid');", "  const cb = d.getElementById('cursorBottle'), cbImg = d.getElementById('cbImg');")
s = s.replace("liq.setAttribute('fill', it.dataset.color);", "cbImg.src = it.dataset.img;")
s = s.replace("  d.querySelectorAll('.fragrance_item').forEach(it => {", "  d.querySelectorAll('.fragrance_item').forEach(it => { new Image().src = it.dataset.img; });\n  d.querySelectorAll('.fragrance_item').forEach(it => {", 1) if "new Image().src" not in s else s
assert 'cbLiquid' not in s and 'data-color' not in s
open('perfume-webflow/index.html', 'w', encoding='utf-8').write(s); print('ok flore')

# ---- Mosse: product cards + kit
edit('skincare-webflow/index.html', [
  ('<svg viewBox="0 0 80 180" aria-hidden="true"><use href="#bottle"/></svg><div class="product_overlay"><span>Built around</span><p>Sphagnum', '<img src="products/water.webp" alt="Moss Water hydrating essence in amber glass" loading="lazy"><div class="product_overlay"><span>Built around</span><p>Sphagnum'),
  ('<svg viewBox="0 0 80 180" aria-hidden="true"><use href="#dropper"/></svg><div class="product_overlay"><span>Built around</span><p>Iceland', '<img src="products/oil.webp" alt="Lichen Oil face oil in an amber dropper bottle" loading="lazy"><div class="product_overlay"><span>Built around</span><p>Iceland'),
  ('<svg viewBox="0 0 120 120" aria-hidden="true" style="height:44%"><use href="#tin"/></svg><div class="product_overlay">', '<img src="products/balm.webp" alt="Bog Balm repair balm in a tin" loading="lazy"><div class="product_overlay">'),
  ('<div class="kit" aria-hidden="true"><svg viewBox="0 0 80 180"><use href="#bottle"/></svg><svg viewBox="0 0 80 180"><use href="#dropper"/></svg><svg viewBox="0 0 120 120"><use href="#tin"/></svg></div>', '<div class="kit"><img src="products/kit.webp" alt="Moss Water, Lichen Oil and Bog Balm together" loading="lazy"></div>'),
  (".product_image-wrap svg{position:relative;height:66%;transition:transform .8s var(--ease),opacity .5s}", ".product_image-wrap img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease),opacity .5s}"),
  (".product_card:hover svg{transform:scale(.94);opacity:.4}", ".product_card:hover .product_image-wrap img{transform:scale(1.05);opacity:.55}"),
  (".kit svg{height:100%;width:auto;transition:transform .7s var(--ease)}", ".kit img{height:100%;width:auto;aspect-ratio:4/5;object-fit:cover;border-radius:6px;transition:transform .8s var(--ease)} .cta_card:hover .kit img{transform:translateY(-6px)}"),
  ("display:flex;justify-content:center;align-items:flex-end;gap:18px;height:260px}", "display:flex;justify-content:center;align-items:flex-end;gap:18px;height:340px}"),
])

# ---- Aveline: six pieces
s = open('jewelry-webflow/index.html', encoding='utf-8').read()
order = ['knot-ring','loop-earrings','knot-pendant','orbit-cuff','wave-ring','bead-chain']
names = ['Knot Ring','Loop Earrings','Knot Pendant','Orbit Cuff','Wave Ring','Bead Chain']
for i, (f, nm) in enumerate(zip(order, names), 1):
    s, n = re.subn(r'(<span class="index">0' + str(i) + r'</span>)<svg viewBox="0 0 200 200" aria-hidden="true">.*?</svg>', r'\1' + f'<img src="products/{f}.webp" alt="{nm} in solid 14k gold" loading="lazy">', s, flags=re.S, count=1); assert n, f
s = s.replace(".piece_image svg{width:62%;transition:transform 1s var(--ease)}\n.piece_card:hover .piece_image svg{transform:rotate(12deg) scale(1.06)}",
              ".piece_image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}\n.piece_card:hover .piece_image img{transform:scale(1.06)}\n.piece_image .index{z-index:1}")
assert '.piece_image img' in s
open('jewelry-webflow/index.html', 'w', encoding='utf-8').write(s); print('ok aveline')

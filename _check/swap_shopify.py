import re
def edit(path, pairs, regex=()):
    s = open(path, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, f'{path}: missing -> {a[:70]}'
        s = s.replace(a, b)
    for pat, rep in regex:
        s, n = re.subn(pat, rep, s, flags=re.S); assert n, f'{path}: regex miss {pat[:50]}'
    open(path, 'w', encoding='utf-8').write(s); print('ok', path)

IMGCSS = "\n.prod-img{display:block;width:100%;height:100%;object-fit:cover}\n"

# ---- Maison Vey
edit('perfume-shopify/index.html', [
  (".card__media svg{width:48%;height:auto;transition:transform .7s var(--ease);filter:drop-shadow(0 30px 30px rgba(0,0,0,.45))}\n.card:hover .card__media svg{transform:translateY(-8px) rotate(-2deg)}",
   ".card__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;transition:transform 1s var(--ease)}\n.card:hover .card__media img{transform:scale(1.05)}" + IMGCSS),
  (".hero-card .art{height:92px;border-radius:12px;", ".hero-card .art{height:92px;border-radius:12px;overflow:hidden;"),
  (".line .thumb svg{height:70%}", ".line .thumb{overflow:hidden} .line .thumb img{width:100%;height:100%;object-fit:cover}"),
  (".vials svg{height:100%;width:auto;transition:transform .6s var(--ease)}", ".vials img{height:100%;width:auto;aspect-ratio:4/5;object-fit:cover;border-radius:24px;box-shadow:0 30px 60px -20px rgba(0,0,0,.6);transition:transform .8s var(--ease)} .discovery__card:hover .vials img{transform:translateY(-8px)}"),
  ("d.querySelector('[data-art=\"vial\"]').innerHTML = bottle(EXTRA['discovery-set'], 92);", "d.querySelector('[data-art=\"vial\"]').innerHTML = bottle(EXTRA['discovery-set']);"),
], regex=[
  (r"  const bottle = \(p, h=200\) => \{.*?\n  \};\n", "  /* realistic 3D renders in products/ (swap for your photography) */\n  const IMG = {'discovery-set':'discovery'};\n  const bottle = (p) => `<img class=\"prod-img\" src=\"products/${IMG[p.handle] || p.handle}.webp\" alt=\"${p.title}\" loading=\"lazy\" decoding=\"async\">`;\n"),
  (r"d\.getElementById\('vials'\)\.innerHTML = .*?;\n", "d.getElementById('vials').innerHTML = '<img src=\"products/discovery.webp\" alt=\"Six Maison Vey sample vials\" loading=\"lazy\">';\n"),
  (r"\$\{bottle\(p,56\)\}", "${bottle(p)}"),
])

# ---- Halcyon
edit('skincare-shopify/index.html', [
  (".card__media svg{height:76%;transition:transform .7s var(--ease)}\n.card:hover .card__media svg{transform:translateY(-6px) scale(1.03)}",
   ".card__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}\n.card:hover .card__media img{transform:scale(1.05)}\n.step-tag{z-index:1}" + IMGCSS),
  (".step .thumb svg{height:78%}", ".step .thumb{overflow:hidden} .step .thumb img{width:100%;height:100%;object-fit:cover}"),
  (".line .thumb svg{height:76%}", ".line .thumb{overflow:hidden} .line .thumb img{width:100%;height:100%;object-fit:cover}"),
], regex=[
  (r"  const art = p => \(\{.*?\}\)\[p\.pack\];\n", "  /* realistic 3D renders in products/ (swap for your photography) */\n  const IMG = {'cloud-cleanser':'cleanser','barrier-serum':'serum','still-cream':'cream','veil-spf':'spf','night-balm':'balm'};\n  const art = p => `<img class=\"prod-img\" src=\"products/${IMG[p.handle]}.webp\" alt=\"${p.title}\" loading=\"lazy\" decoding=\"async\">`;\n"),
])

# ---- Molten
edit('jewelry-shopify/index.html', [
  (".card__media svg{width:62%;height:auto;transition:transform .8s var(--ease);filter:drop-shadow(0 24px 24px rgba(0,0,0,.55))}\n.card:hover .card__media svg{transform:rotate(-8deg) scale(1.06)}",
   ".card__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease),opacity .35s}\n.card:hover .card__media img{transform:scale(1.06)}\n.card__media .tag{z-index:1}" + IMGCSS),
  (".line .thumb svg{width:70%}", ".line .thumb{overflow:hidden} .line .thumb img{width:100%;height:100%;object-fit:cover}"),
  (".promise__art svg{width:56%}", ".promise__art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}"),
], regex=[
  (r"  const art = \(a, m\) => \{.*?\}\)\[a\]; \};\n", "  /* realistic 3D renders in products/, one per metal (swap for your photography) */\n  const SLUG = {ring:'pour-ring', hoops:'drip-hoops', chain:'flow-chain', signet:'cast-signet'};\n  const art = (a, m = metal) => `<img class=\"prod-img\" data-art=\"${a}\" src=\"products/${SLUG[a]}-${m}.webp\" alt=\"\" loading=\"lazy\" decoding=\"async\">`;\n"),
  (r'<div class="promise__art" aria-hidden="true"><svg viewBox="0 0 200 200">.*?</svg></div>', '<div class="promise__art" aria-hidden="true"><img class="prod-img" data-art="signet" src="products/cast-signet-gold.webp" alt=""></div>'),
  (r"(    grid\.querySelectorAll\('\.card'\)\.forEach\(c => c\.querySelector\('\[data-price\]'\)\.textContent = money\(price\(all\[c\.dataset\.handle\]\)\)\);\n)",
   r"\1    d.querySelectorAll('main img[data-art]').forEach(i => i.src = `products/${SLUG[i.dataset.art]}-${m}.webp`);\n"),
])

import re
exec(open('_check/swap_shopify.py').read().split('IMGCSS')[0])
# ---- Petal & Pyre
edit('perfume-wordpress/index.html', [
  (".wc-block-grid__product-image svg{width:42%;transition:transform .7s var(--ease)}\n.wc-block-grid__product:hover .wc-block-grid__product-image svg{transform:translateY(-10px)}",
   ".wc-block-grid__product-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}\n.wc-block-grid__product:hover .wc-block-grid__product-image img{transform:scale(1.05)}"),
  (".result .bottle svg{width:56%}", ".result .bottle{overflow:hidden;position:relative} .result .bottle img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}"),
  ("${bottle(p)}${sprig}", "${bottle(p)}"),
  ("herb:{name:'Herb Path',", "herb:{img:'herb', name:'Herb Path',"),
  ("rose:{name:'Rose Bed',", "rose:{img:'rose', name:'Rose Bed',"),
  ("fire:{name:'Pyre',", "fire:{img:'pyre', name:'Pyre',"),
], regex=[(r"  const bottle = p => `<svg.*?</svg>`;\n", "  /* realistic 3D renders in products/ (swap for your photography) */\n  const bottle = p => `<img src=\"products/${p.img}.webp\" alt=\"${p.name} eau de parfum\" loading=\"lazy\" decoding=\"async\">`;\n")])

# ---- Sable
edit('skincare-wordpress/index.html', [
  (".wc-block-grid__product-image svg.pack{height:74%;transition:transform .7s var(--ease)}\n.wc-block-grid__product:hover svg.pack{transform:translateY(-6px) rotate(-2deg)}",
   ".wc-block-grid__product-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}\n.wc-block-grid__product:hover .wc-block-grid__product-image img{transform:scale(1.05)}"),
  ("${pack(p)}${smear(p.smear)}", "${pack(p)}"),
], regex=[(r"  const pack = p => \(\{.*?\}\)\[p\.pack\];\n", "  /* realistic 3D renders in products/ (swap for your photography) */\n  const IMG = {'Clear Cleanse':'cleanse','Barrier Mist':'mist','Clarity Serum':'serum','Daily Moisture':'moisture','Rich Balm':'balm','Night Oil':'oil'};\n  const pack = p => `<img src=\"products/${IMG[p.t]}.webp\" alt=\"Sable ${p.t}\" loading=\"lazy\" decoding=\"async\">`;\n")])

# ---- Celeste
s = open('jewelry-wordpress/index.html', encoding='utf-8').read()
for f, alt in [('disc','Nocturne Disc pendant in silver with a sapphire'),('polaris','Polaris solitaire ring with a sapphire'),('comet','Comet Drops sapphire earrings')]:
    s, n = re.subn(r'<span class="glint"></span><svg viewBox="0 0 200 200" aria-hidden="true">.*?</svg>', f'<span class="glint"></span><img src="products/{f}.webp" alt="{alt}" loading="lazy">', s, count=1, flags=re.S); assert n, f
s = s.replace(".wc-block-grid__product-image svg{width:58%;transition:transform 1s var(--ease)}\n.wc-block-grid__product:hover .wc-block-grid__product-image svg{transform:scale(1.08) rotate(-6deg)}",
              ".wc-block-grid__product-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}\n.wc-block-grid__product:hover .wc-block-grid__product-image img{transform:scale(1.08)}\n.wc-block-grid__product-image .glint{z-index:1;mix-blend-mode:screen}")
assert '.wc-block-grid__product-image img' in s
# engraving preview: render underneath, live text on an aligned SVG layer (render is 1000x1250, disc centre 500,628, r~383)
s, n = re.subn(r'      <svg viewBox="0 0 400 400" role="img" aria-label="Preview of your engraved Nocturne Disc">.*?</svg>\n',
'''      <div class="eng-stage">
        <img id="engImg" src="products/engrave-silver.webp" alt="Preview of your engraved Nocturne Disc">
        <svg viewBox="0 0 1000 1250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <text id="engraving" x="500" y="690" text-anchor="middle" fill="#2a3040" fill-opacity=".7" font-family="EB Garamond" font-size="143" stroke="#fff" stroke-opacity=".35" stroke-width="2" style="paint-order:stroke">Ada</text>
          <text id="engraving2" x="500" y="828" text-anchor="middle" fill="#2a3040" fill-opacity=".55" font-family="Jost" font-size="42" letter-spacing="13">12 · 06 · 2026</text>
        </svg>
      </div>
''', s, flags=re.S); assert n
s = s.replace(".studio-preview svg{width:min(78%,440px)}", ".eng-stage{position:relative;width:min(84%,460px);aspect-ratio:4/5;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.6)}\n.eng-stage img,.eng-stage svg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}")
s = s.replace("const FONTS = {serif:{f:'EB Garamond', s:44, ls:0, up:false}, script:{f:'Pinyon Script', s:52, ls:0, up:false}, block:{f:'Jost', s:30, ls:6, up:true}};",
              "const FONTS = {serif:{f:'EB Garamond', s:143, ls:0, up:false}, script:{f:'Pinyon Script', s:168, ls:0, up:false}, block:{f:'Jost', s:98, ls:20, up:true}};")
s = s.replace("const size = Math.max(18, Math.min(F.s, F.s * 7 / Math.max(7, t.length)));", "const size = Math.max(58, Math.min(F.s, F.s * 7 / Math.max(7, t.length)));")
s, n = re.subn(r"    \['disc','chain','bail'\]\.forEach\(id => \{.*?\}\);\n", "    d.getElementById('engImg').src = `products/engrave-${metal === 'au' ? 'gold' : 'silver'}.webp`;\n    eng.setAttribute('fill', metal === 'au' ? '#4a3210' : '#2a3040'); eng2.setAttribute('fill', metal === 'au' ? '#4a3210' : '#2a3040');\n", s, flags=re.S); assert n
s = s.replace("<span class=\"caption\">NOCTURNE DISC · 30 MM · SHOWN AT ACTUAL PROPORTIONS</span>", "<span class=\"caption\">NOCTURNE DISC · 30 MM · ENLARGED TO SHOW DETAIL</span>")
open('jewelry-wordpress/index.html', 'w', encoding='utf-8').write(s); print('ok celeste')

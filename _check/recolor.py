import re, sys
M = {
 'perfume-shopify': {  # Aubergine & champagne: mystery + prestige
  '0b0a09':'120A12','14120f':'1C1220','13110e':'1A1019','16130f':'1E1322','1d1914':'2A1630','0f0d0b':'120A12','1a1713':'221427','120f0a':'1A0E18',
  'efe8dc':'F3E9EE','c9b48a':'D9B77C', 'rgb:11,10,9':'18,10,18','rgb:20,18,15':'28,18,32','rgb:239,232,220':'243,233,238','rgb:201,180,138':'217,183,124'},
 'perfume-webflow': {  # Crimson rose & plum-black: desire, passion
  '050505':'07040A','d9382b':'C4183C','eceae6':'F1E8EA','rgb:217,56,43':'196,24,60','rgb:236,234,230':'241,232,234'},
 'perfume-wordpress': {  # Blush & mauve: romance, tenderness
  'f4eee4':'F7EDEE','2a211b':'33202B','b5532e':'9E4A6E','e7a07f':'E9A8C2','ede4d6':'F0E1E4',
  'rgb:244,238,228':'247,237,238','rgb:42,33,27':'51,32,43','rgb:181,83,46':'158,74,110'},
 'skincare-shopify': {  # Aqua & white: clinical trust + healing
  '2c6e86':'1F7A78','8fc3d6':'8ED3C9','eaf0f3':'EDF5F4','f6f9fa':'F8FBFB','16222b':'12282A',
  'rgb:44,110,134':'31,122,120','rgb:234,240,243':'237,245,244','rgb:22,34,43':'18,40,42'},
 'skincare-webflow': {  # Forest & fresh sage: nature, renewal
  '0d120f':'0E1A14','141b16':'15241C','a9bc7c':'B7D3A0','e6e9df':'EAF1E6','0b0f0c':'0A140F','26331f':'24392B','2b3626':'2A3D30',
  'rgb:13,18,15':'14,26,20','rgb:169,188,124':'183,211,160','rgb:230,233,223':'234,241,230'},
 'skincare-wordpress': {  # Clean linen & eucalyptus: purity, calm
  'e9e3da':'F4F0EA','f3efe9':'FBF9F6','1f1b18':'1D2322','5f6e4e':'4F8577','b9c79f':'A8D2C4',
  'rgb:233,227,218':'244,240,234','rgb:31,27,24':'29,35,34','rgb:95,110,78':'79,133,119'},
 'jewelry-shopify': {  # Onyx & metallic gold: power, prestige
  '08080a':'0A0806','111114':'14110C','141417':'17130D','101013':'120F0A','1b1b20':'211B12','d8b26e':'D4AF37','edeae4':'F2EBDD','0b0b0d':'0D0A05',
  'rgb:8,8,10':'10,8,6','rgb:216,178,110':'212,175,55','rgb:237,234,228':'242,235,221','rgb:17,17,20':'20,17,12'},
 'jewelry-webflow': {  # Ivory & champagne: purity, bridal elegance
  'f4f3f0':'F8F4EE','eae8e3':'EFE6DA','1a1918':'2A2220','9c7a4a':'B08A57',
  'rgb:244,243,240':'248,244,238','rgb:26,25,24':'42,34,32','rgb:156,122,74':'176,138,87'},
 'jewelry-wordpress': {  # Midnight navy & sapphire: trust, loyalty
  '05070d':'050A1F','0c1120':'0B1433','8fb0ff':'6E95FF','e8ecf5':'EAF0FF','16203a':'122458','0a0e19':'081230','1a2645':'18306A','070a14':'050B22',
  'rgb:5,7,13':'5,10,31','rgb:143,176,255':'110,149,255','rgb:232,236,245':'234,240,255'},
}
for site, m in M.items():
    p = f'{site}/index.html'; s = open(p, encoding='utf-8').read(); n = 0
    for k, v in m.items():
        if k.startswith('rgb:'):
            pat = re.compile(r'(rgba?\()' + re.escape(k[4:]))
            s, c = pat.subn(lambda mo: mo.group(1) + v, s)
        else:
            pat = re.compile(r'(#|%23)' + k + r'\b', re.I)
            s, c = pat.subn(lambda mo: mo.group(1) + v, s)
        n += c
    open(p, 'w', encoding='utf-8').write(s); print(f'{site}: {n} replacements')

// Product library: every product is a small parametric 3D model.
// build(THREE, {RoundedBoxGeometry}) returns a Group standing on y = 0.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ---------------- materials ---------------- */
const M = {
  glass: (tint = '#ffffff', dist = 3, rough = 0.03) => new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: rough, transmission: 1, thickness: 0.5, ior: 1.5,
    clearcoat: 1, clearcoatRoughness: 0.04, attenuationColor: new THREE.Color(tint), attenuationDistance: dist, specularIntensity: 1 }),
  frosted: (tint = '#ffffff') => new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.42, transmission: 0.92, thickness: 0.8, ior: 1.5 }),
  liquid: (c) => new THREE.MeshPhysicalMaterial({ color: '#ffffff', emissive: new THREE.Color(c), emissiveIntensity: 0.32, roughness: 0.05, transmission: 1, thickness: 0.6, ior: 1.36, attenuationColor: new THREE.Color(c), attenuationDistance: 0.9 }),
  shell: () => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.02, metalness: 0, transparent: true, opacity: 0.16, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, envMapIntensity: 2.2, depthWrite: false }),
  amber: () => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transmission: 1, thickness: 0.6, ior: 1.5, attenuationColor: new THREE.Color('#a85a12'), attenuationDistance: 0.75, clearcoat: 1 }),
  plastic: (c, r = 0.42) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
  gloss: (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }),
  metal: (c, r = 0.16) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r }),
  gem: (c) => new THREE.MeshPhysicalMaterial({ color: '#ffffff', emissive: new THREE.Color(c), emissiveIntensity: .35, roughness: 0, transmission: 1, thickness: 0.3, ior: 1.77, attenuationColor: new THREE.Color(c), attenuationDistance: 0.45, dispersion: 3, clearcoat: 1, specularIntensity: 1 }),
};
const GOLD = '#FFCB73', SILVER = '#F2F2F0', ROSE = '#F7B9A1';
const METALS = { gold: GOLD, silver: SILVER, rose: ROSE };

/* ---------------- labels ---------------- */
function labelTex({ w = 512, h = 512, bg = '#F5F0E6', lines = [], border }) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  if (border) { g.strokeStyle = border; g.lineWidth = 3; g.strokeRect(14, 14, w - 28, h - 28); }
  for (const l of lines) { g.fillStyle = l.color || '#1a1a1a'; g.font = l.font; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (l.spacing) g.letterSpacing = l.spacing + 'px'; else g.letterSpacing = '0px';
    g.fillText(l.text, w / 2 + (l.dx || 0), h * l.y); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const labelMat = (opts) => new THREE.MeshPhysicalMaterial({ map: labelTex(opts), roughness: 0.55, transparent: !opts.bg, clearcoat: 0.2 });
function planeLabel(w, h, opts, z) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), labelMat({ ...opts, w: 512, h: Math.round(512 * h / w) })); m.position.z = z; return m; }
function wrapLabel(r, h, arc, opts) { // label wrapped round a cylinder, facing camera
  const g = new THREE.CylinderGeometry(r, r, h, 64, 1, true, -arc / 2, arc);
  const m = new THREE.Mesh(g, labelMat({ ...opts, w: 512, h: Math.round(512 * h / (r * arc)) })); return m;
}

/* ---------------- shapes ---------------- */
const lathe = (pts, seg = 96) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o; };
function capsuleLathe(r, h, y0 = 0) { const pts = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI / 2; pts.push([r * Math.cos(a), y0 + r + r * Math.sin(a)]); }
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI / 2; pts.push([r * Math.cos(a), y0 + h - r + r * Math.sin(a)]); } pts.push([0.0001, y0 + h]); pts.unshift([0.0001, y0]); return lathe(pts); }

/* perfume: rectangular glass flacon with liquid, neck and cap */
function flacon({ w = .9, h = 1.5, d = .5, r = .07, liquid = '#c99a5b', fillTo = .8, cap = 'gold', capShape = 'box', capW = .36, capH = .42, label }) {
  const g = new THREE.Group(), wall = .05, base = .2;
  g.add(mesh(new RoundedBoxGeometry(w, h, d, 6, r), M.shell(), 0, h / 2));
  g.add(mesh(new RoundedBoxGeometry(w - .02, base, d - .02, 4, r * .8), M.glass('#ffffff', 2), 0, base / 2 + .005));
  const lh = (h - base - wall) * fillTo;
  g.add(mesh(new RoundedBoxGeometry(w - wall * 2, lh, d - wall * 2, 4, r * .6), M.liquid(liquid), 0, base + lh / 2));
  g.add(mesh(new THREE.CylinderGeometry(.11, .11, .1, 48), M.glass(), 0, h + .05));
  const capMat = cap === 'gold' ? M.metal(GOLD, .22) : cap === 'black' ? M.gloss('#0c0c0c') : cap === 'silver' ? M.metal(SILVER, .2) : M.plastic(cap, .5);
  const cg = capShape === 'round' ? new THREE.SphereGeometry(capW / 2, 64, 32) : capShape === 'cyl' ? new THREE.CylinderGeometry(capW / 2, capW / 2, capH, 64) : new RoundedBoxGeometry(capW, capH, capW * .8, 4, .03);
  g.add(mesh(cg, capMat, 0, h + .1 + (capShape === 'round' ? capW / 2 * .9 : capH / 2)));
  if (label) { const l = planeLabel(label.w || w * .62, label.h || h * .3, label, d / 2 + .004); l.position.y = label.y ?? h * .5; g.add(l); }
  return g;
}
function flask({ rx = .55, ry = .62, rz = .3, liquid, cap = 'gold', label }) {
  const g = new THREE.Group();
  const outer = mesh(new THREE.SphereGeometry(1, 96, 64), M.shell(), 0, ry); outer.scale.set(rx, ry, rz); g.add(outer);
  const inner = mesh(new THREE.SphereGeometry(1, 64, 48), M.liquid(liquid), 0, ry * .92); inner.scale.set(rx * .86, ry * .8, rz * .78); g.add(inner);
  g.add(mesh(new THREE.CylinderGeometry(.09, .09, .12, 48), M.glass(), 0, ry * 2 + .02));
  g.add(mesh(new THREE.SphereGeometry(.2, 64, 32), cap === 'gold' ? M.metal(GOLD, .2) : M.gloss('#0c0c0c'), 0, ry * 2 + .26));
  if (label) { const l = planeLabel(rx * .9, ry * .42, label, rz + .01); l.position.y = ry; g.add(l); }
  return g;
}
function vial({ liquid, cap = 'gold', h = 1.3, r = .16 }) {
  const g = new THREE.Group();
  g.add(mesh(capsuleLathe(r, h), M.shell(), 0, 0));
  g.add(mesh(capsuleLathe(r * .8, h * .78, .02), M.liquid(liquid), 0, 0));
  g.add(mesh(new THREE.CylinderGeometry(r * 1.02, r * 1.02, .32, 48), cap === 'gold' ? M.metal(GOLD, .22) : M.gloss('#0c0c0c'), 0, h + .12));
  return g;
}

/* skincare */
function tube({ color = '#F6F8F8', cap = '#12282A', h = 1.6, r = .3, label }) {
  const g = new THREE.Group(); const capH = .26;
  g.add(mesh(new THREE.CylinderGeometry(r * .62, r * .62, capH, 48), M.gloss(cap), 0, capH / 2));
  const geo = new THREE.CylinderGeometry(r, r * .7, h, 96, 40, false); const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i), t = Math.min(1, Math.max(0, (y + h / 2) / h)), e = Math.pow(t, 2.2);
    p.setX(i, p.getX(i) * (1 + .38 * e)); p.setZ(i, p.getZ(i) * (1 - .93 * e)); }
  geo.computeVertexNormals();
  const body = mesh(geo, M.plastic(color, .38), 0, capH + h / 2); g.add(body);
  g.add(mesh(new RoundedBoxGeometry(r * 2 * 1.38 + .02, .12, .05, 2, .01), M.plastic(color, .45), 0, capH + h + .03));
  if (label) { const l = planeLabel(r * 1.3, h * .3, { ...label, bg: null }, r * .76); l.position.y = capH + h * .46; l.rotation.x = .1; g.add(l); }
  return g;
}
function dropperBottle({ glass = 'clear', liquid = '#8fd1c6', h = 1.05, r = .34, collar = '#111', bulb = '#111', label, frost }) {
  const g = new THREE.Group();
  const prof = [[0.0001, 0], [r - .04, 0], [r, .04], [r, h - .22], [r * .92, h - .1], [r * .5, h - .02], [.15, h], [.15, h + .06], [0.0001, h + .06]];
  const mat = glass === 'amber' ? M.amber() : frost ? M.frosted(frost) : M.glass('#ffffff', 3);
  g.add(mesh(lathe(prof), mat));
  if (glass !== 'amber') g.add(mesh(lathe([[0.0001, .05], [r - .06, .05], [r - .06, h * .72], [0.0001, h * .72]]), M.liquid(liquid)));
  g.add(mesh(new THREE.CylinderGeometry(.17, .17, .2, 48), M.gloss(collar), 0, h + .14));
  g.add(mesh(capsuleLathe(.12, .42, 0), M.plastic(bulb, .55), 0, h + .22));
  if (label) { const l = wrapLabel(r + .004, label.hh || h * .42, 2.0, label); l.position.y = label.y || h * .42; g.add(l); }
  return g;
}
function jar({ r = .62, h = .52, lidH = .26, body = '#F8FBFB', lid = '#12282A', label, glassy }) {
  const g = new THREE.Group();
  g.add(mesh(lathe([[0.0001, 0], [r - .08, 0], [r, .07], [r, h - .03], [r - .04, h], [0.0001, h]]), glassy ? M.frosted(body) : M.gloss(body)));
  g.add(mesh(lathe([[0.0001, h], [r + .01, h], [r + .02, h + .03], [r + .02, h + lidH - .04], [r - .02, h + lidH], [0.0001, h + lidH]]), M.gloss(lid)));
  if (label) { const l = wrapLabel(r + .004, h * .62, 1.6, label); l.position.y = h * .5; g.add(l); }
  return g;
}
function pumpBottle({ r = .32, h = 1.25, body = '#F8FBFB', top = '#12282A', label }) {
  const g = new THREE.Group();
  g.add(mesh(lathe([[0.0001, 0], [r - .06, 0], [r, .06], [r, h - .14], [r * .7, h - .02], [.14, h], [0.0001, h]]), M.gloss(body)));
  g.add(mesh(new THREE.CylinderGeometry(.16, .16, .14, 48), M.gloss(top), 0, h + .07));
  g.add(mesh(new THREE.CylinderGeometry(.05, .05, .2, 24), M.gloss(top), 0, h + .24));
  g.add(mesh(new RoundedBoxGeometry(.22, .12, .2, 3, .04), M.gloss(top), 0, h + .38));
  const n = mesh(new THREE.CylinderGeometry(.03, .03, .22, 16), M.gloss(top), .2, h + .38); n.rotation.z = Math.PI / 2; g.add(n);
  if (label) { const l = wrapLabel(r + .004, h * .4, 1.8, label); l.position.y = h * .44; g.add(l); }
  return g;
}
function tin({ r = .66, h = .3, color = '#2a3d30', lidColor = '#B7D3A0', label }) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(r, r, h, 96), M.metal('#c9cfc6', .35), 0, h / 2));
  g.add(mesh(lathe([[0.0001, h], [r + .015, h], [r + .02, h + .14], [r - .02, h + .17], [0.0001, h + .17]]), new THREE.MeshPhysicalMaterial({ color: lidColor, metalness: .6, roughness: .3, clearcoat: 1 })));
  if (label) { const l = mesh(new THREE.CircleGeometry(r * .62, 64), labelMat(label), 0, h + .172); l.rotation.x = -Math.PI / 2; g.add(l); }
  return g;
}

/* jewelry */
const curveTube = (pts, rad, mat, closed = false, seg = 240) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), closed, 'catmullrom', .5), seg, rad, 24, closed), mat);
function ring({ metal = GOLD, R = .6, t = .085, tilt = .32, drip }) {
  const g = new THREE.Group();
  const tor = new THREE.Mesh(new THREE.TorusGeometry(R, t, 48, 200), M.metal(metal)); tor.scale.z = 1.6; g.add(tor);
  if (drip) { const d = mesh(new THREE.SphereGeometry(t * 1.05, 32, 16), M.metal(metal), R * .72, -R * .7, 0); d.scale.set(1, 1.8, 1); g.add(d); }
  g.rotation.set(tilt, .5, 0); const w = new THREE.Group(); w.add(g); return w;
}
function signet({ metal = GOLD }) {
  const g = new THREE.Group(), m = M.metal(metal);
  const tor = new THREE.Mesh(new THREE.TorusGeometry(.55, .09, 48, 200), m); tor.scale.z = 1.8; g.add(tor);
  const face = mesh(new THREE.CylinderGeometry(.34, .3, .14, 96), m, 0, .6, 0); face.scale.z = .75; g.add(face);
  const eng = mesh(new THREE.CylinderGeometry(.25, .25, .01, 96), M.metal(metal, .45), 0, .675, 0); eng.scale.z = .75; g.add(eng);
  g.rotation.set(.3, .45, 0); const w = new THREE.Group(); w.add(g); return w;
}
function hoops({ metal = GOLD }) {
  const g = new THREE.Group(), m = M.metal(metal);
  const one = (x, s) => { const pts = []; for (let i = 0; i <= 40; i++) { const a = -0.5 + i / 40 * (Math.PI * 1.75); pts.push([x + Math.cos(a) * .42 * s + Math.sin(a * 3) * .03, .72 + Math.sin(a) * .52 * s, Math.sin(a * 2) * .06]); } return curveTube(pts, .045, m); };
  g.add(one(-.38, 1)); g.add(one(.42, .9)); return g;
}
function chain({ metal = GOLD, links = 34, pendant }) {
  const g = new THREE.Group(), m = M.metal(metal);
  for (let i = 0; i < links; i++) { const t = i / (links - 1), x = -.9 + 1.8 * t, y = 1.4 - 1.05 * Math.sin(Math.PI * t), ang = Math.atan2(-1.05 * Math.PI * Math.cos(Math.PI * t), 1.8);
    const l = new THREE.Mesh(new THREE.TorusGeometry(.042, .013, 16, 48), m); l.scale.set(1.5, 1, 1); l.position.set(x, y, 0); l.rotation.z = ang; if (i % 2) l.rotation.x = Math.PI / 2; g.add(l); }
  if (pendant) g.add(pendant);
  return g;
}
function gemDrop(color, s = 1) { const geo = new THREE.OctahedronGeometry(.16 * s, 0); geo.scale(1, 1.6, .7); return new THREE.Mesh(geo, M.gem(color)); }
function knot({ metal = GOLD, p = 2, q = 3, R = .42, t = .07 }) { const k = new THREE.Mesh(new THREE.TorusKnotGeometry(R, t, 300, 32, p, q), M.metal(metal)); return k; }

/* backgrounds per site (base = card/page colour, hi = sweep highlight) */
const BG = {
  mv: (base) => ({ base, hi: '#4a3346' }), flore: { base: '#07040A', hi: '#2a1a22' }, petal: (base) => ({ base, hi: '#fffaf7' }),
  halcyon: (base) => ({ base, hi: '#ffffff' }), mosse: { base: '#15241C', hi: '#33493a' }, sable: (base) => ({ base, hi: '#fffdf9' }),
  molten: { base: '#14110C', hi: '#3b3226' }, aveline: { base: '#EFE6DA', hi: '#fbf7f1' }, celeste: { base: '#081230', hi: '#1f3a7a' },
};
const serif = (s, w = 400) => `${w} ${s}px "Cormorant Garamond", Georgia, serif`;
const sans = (s, w = 500) => `${w} ${s}px Inter, Arial, sans-serif`;

export const products = {};
const P = (id, spec) => products[id] = spec;

/* ===== PERFUME · Maison Vey ===== */
const mvLabel = (name) => ({ bg: '#140b12', border: '#D9B77C', lines: [{ text: 'MAISON VEY', font: sans(28, 500), y: .32, spacing: 10, color: '#D9B77C' }, { text: name, font: `italic 400 66px Georgia, serif`, y: .62, color: '#F3E9EE' }] });
P('mv-terre-fleurie', { bg: BG.mv('#2E1D22'), build: () => flacon({ liquid: '#c98f45', cap: 'gold', label: mvLabel('Terre Fleurie') }) });
P('mv-sel-noir', { bg: BG.mv('#16191B'), build: () => flacon({ w: 1.05, h: 1.15, d: .62, r: .1, liquid: '#5f7076', cap: 'black', capW: .5, capH: .44, label: mvLabel('Sel Noir') }) });
P('mv-figue-blanche', { bg: BG.mv('#1E2219'), build: () => flask({ liquid: '#a9b278', cap: 'gold', label: mvLabel('Figue Blanche') }) });
P('mv-rose-cendre', { bg: BG.mv('#24171A'), build: () => flacon({ liquid: '#b85d68', cap: 'black', capShape: 'cyl', capW: .42, capH: .5, label: mvLabel('Rose Cendrée') }) });
P('mv-discovery', { bg: BG.mv('#221427'), fill: .7, build: () => { const g = new THREE.Group(); ['#c98f45', '#5f7076', '#a9b278', '#b85d68', '#c98f45', '#5f7076'].forEach((c, i) => { const v = vial({ liquid: c, cap: i % 2 ? 'black' : 'gold' }); v.position.x = (i - 2.5) * .44; v.position.z = (i % 2) * .25; g.add(v); }); return g; } });
P('mv-vial', { bg: BG.mv('#221427'), build: () => vial({ liquid: '#c98f45' }) });

/* ===== PERFUME · Flore Noire ===== */
const fnLabel = (name, num) => ({ bg: '#F2EFE9', lines: [{ text: 'Flore Noire', font: `400 70px Georgia, serif`, y: .38, color: '#111' }, { text: `${name} · ${num}`, font: sans(26, 500), y: .68, spacing: 6, color: '#111' }] });
const fn = (id, name, num, liq) => P(id, { bg: BG.flore, build: () => flacon({ w: .82, h: 1.45, d: .5, liquid: liq, cap: 'black', capW: .46, capH: .56, label: { ...fnLabel(name, num), w: .58, h: .3 } }) });
fn('fn-pavot', 'PAVOT', '04', '#a0122e'); fn('fn-iris', 'IRIS DE NUIT', '03', '#8f80a8'); fn('fn-tubereuse', 'TUBÉREUSE SEL', '02', '#e1d6b8'); fn('fn-osmanthe', 'OSMANTHE FUMÉ', '01', '#b5722c');

/* ===== PERFUME · Petal & Pyre ===== */
const ppLabel = (name) => ({ bg: '#F7EDEE', lines: [{ text: 'Petal & Pyre', font: `italic 400 56px Georgia, serif`, y: .38, color: '#33202B' }, { text: name.toUpperCase(), font: sans(24, 600), y: .66, spacing: 6, color: '#9E4A6E' }] });
const pp = (id, name, liq, tint) => P(id, { bg: BG.petal(tint), build: () => flacon({ w: .9, h: 1.3, d: .55, r: .22, liquid: liq, cap: 'black', capShape: 'round', capW: .42, label: { ...ppLabel(name), w: .56, h: .34 } }) });
pp('pp-herb', 'Herb Path', '#9aa75a', '#DCE0C5'); pp('pp-rose', 'Rose Bed', '#c97b80', '#EED3C8'); pp('pp-pyre', 'Pyre', '#a8662f', '#E2CDB6');

/* ===== SKINCARE · Halcyon ===== */
const hcLabel = (name, sub) => ({ bg: null, lines: [{ text: 'halcyon', font: sans(70, 600), y: .42, color: '#12282A' }, { text: name.toUpperCase(), font: sans(26, 600), y: .6, spacing: 5, color: '#12282A' }, { text: sub, font: sans(22, 400), y: .72, color: '#12282A' }] });
P('hc-cleanser', { bg: BG.halcyon('#DCE7EC'), build: () => tube({ label: hcLabel('Cloud Cleanser', '150 ml') }) });
P('hc-serum', { bg: BG.halcyon('#E4E2EC'), build: () => dropperBottle({ liquid: '#c9c0e0', collar: '#12282A', bulb: '#12282A', label: { bg: '#F8FBFB', lines: [{ text: 'halcyon', font: sans(64, 600), y: .38, color: '#12282A' }, { text: 'BARRIER SERUM', font: sans(24, 600), y: .62, spacing: 5, color: '#12282A' }, { text: '4% niacinamide · 30 ml', font: sans(20, 400), y: .78, color: '#12282A' }] } }) });
P('hc-cream', { bg: BG.halcyon('#E9E4DC'), build: () => jar({ label: { bg: null, lines: [{ text: 'halcyon', font: sans(70, 600), y: .45, color: '#12282A' }, { text: 'STILL CREAM · 50 ML', font: sans(22, 600), y: .7, spacing: 5, color: '#12282A' }] } }) });
P('hc-spf', { bg: BG.halcyon('#E2EBE2'), build: () => pumpBottle({ label: { bg: null, lines: [{ text: 'halcyon', font: sans(64, 600), y: .32, color: '#12282A' }, { text: 'VEIL SPF 50', font: sans(30, 600), y: .58, spacing: 5, color: '#1F7A78' }, { text: 'mineral · 50 ml', font: sans(22, 400), y: .76, color: '#12282A' }] } }) });
P('hc-balm', { bg: BG.halcyon('#E3E0E8'), build: () => jar({ body: '#E9E4F0', lid: '#12282A', label: { bg: null, lines: [{ text: 'halcyon', font: sans(70, 600), y: .45, color: '#12282A' }, { text: 'NIGHT BALM · 50 ML', font: sans(22, 600), y: .7, spacing: 5, color: '#12282A' }] } }) });

/* ===== SKINCARE · Mosse ===== */
const msLabel = (name, sub) => ({ bg: '#EAF1E6', lines: [{ text: 'Mosse', font: `italic 400 76px "Bodoni Moda", Didot, Georgia, serif`, y: .36, color: '#0E1A14' }, { text: name.toUpperCase(), font: sans(24, 500), y: .62, spacing: 6, color: '#0E1A14' }, { text: sub, font: sans(20, 400), y: .76, color: '#0E1A14' }] });
P('ms-water', { bg: BG.mosse, build: () => dropperBottle({ glass: 'amber', r: .36, h: 1.25, collar: '#EAF1E6', bulb: '#EAF1E6', label: { ...msLabel('Moss Water', '120 ml'), hh: .5 } }) });
P('ms-oil', { bg: BG.mosse, build: () => dropperBottle({ glass: 'amber', r: .28, h: .9, collar: '#0a0f0c', bulb: '#0a0f0c', label: { ...msLabel('Lichen Oil', '30 ml'), hh: .4 } }) });
P('ms-balm', { bg: BG.mosse, elev: .5, build: () => tin({ label: { bg: null, lines: [{ text: 'Mosse', font: `italic 400 110px "Bodoni Moda", Georgia, serif`, y: .45, color: '#0E1A14' }, { text: 'BOG BALM', font: sans(34, 500), y: .68, spacing: 8, color: '#0E1A14' }] } }) });
P('ms-kit', { bg: BG.mosse, fill: .58, build: () => { const g = new THREE.Group();
  const a = dropperBottle({ glass: 'amber', r: .36, h: 1.25, collar: '#EAF1E6', bulb: '#EAF1E6', label: { ...msLabel('Moss Water', '120 ml'), hh: .5 } }); a.position.x = -.85;
  const b = dropperBottle({ glass: 'amber', r: .28, h: .9, collar: '#0a0f0c', bulb: '#0a0f0c', label: { ...msLabel('Lichen Oil', '30 ml'), hh: .4 } }); b.position.set(.05, 0, .25);
  const c = tin({ label: { bg: null, lines: [{ text: 'Mosse', font: `italic 400 110px Georgia, serif`, y: .5, color: '#0E1A14' }] } }); c.position.set(.95, 0, .1); c.rotation.x = .25;
  g.add(a, b, c); return g; } });

/* ===== SKINCARE · Sable ===== */
const sbLabel = (name) => ({ bg: null, lines: [{ text: 'Sable', font: `400 84px "DM Serif Display", Georgia, serif`, y: .42, color: '#1D2322' }, { text: name.toUpperCase(), font: sans(24, 600), y: .66, spacing: 5, color: '#3F7366' }] });
P('sb-cleanse', { bg: BG.sable('#DDE3D2'), build: () => tube({ color: '#F7F3EE', cap: '#1D2322', label: sbLabel('Clear Cleanse') }) });
P('sb-mist', { bg: BG.sable('#E2DDD4'), build: () => pumpBottle({ body: '#F7F3EE', top: '#1D2322', label: sbLabel('Barrier Mist') }) });
P('sb-serum', { bg: BG.sable('#E6DCCF'), build: () => dropperBottle({ liquid: '#e2b874', collar: '#1D2322', bulb: '#1D2322', label: { bg: '#F7F3EE', lines: [{ text: 'Sable', font: `400 80px "DM Serif Display", Georgia, serif`, y: .42, color: '#1D2322' }, { text: 'CLARITY SERUM', font: sans(24, 600), y: .7, spacing: 5, color: '#3F7366' }] } }) });
P('sb-moisture', { bg: BG.sable('#E9E1D3'), build: () => jar({ body: '#F7F3EE', lid: '#1D2322', label: sbLabel('Daily Moisture') }) });
P('sb-balm', { bg: BG.sable('#E3D7C6'), build: () => jar({ body: '#EFE4D3', lid: '#1D2322', r: .66, h: .44, label: sbLabel('Rich Balm') }) });
P('sb-oil', { bg: BG.sable('#E8D9BF'), build: () => dropperBottle({ liquid: '#e4b85f', collar: '#1D2322', bulb: '#1D2322', label: { bg: '#F7F3EE', lines: [{ text: 'Sable', font: `400 80px "DM Serif Display", Georgia, serif`, y: .42, color: '#1D2322' }, { text: 'NIGHT OIL', font: sans(24, 600), y: .7, spacing: 5, color: '#3F7366' }] } }) });

/* ===== JEWELRY · Molten (each piece in three metals) ===== */
for (const [mk, mc] of Object.entries(METALS)) {
  P(`mo-pour-ring-${mk}`, { bg: BG.molten, fill: .5, elev: .35, build: () => ring({ metal: mc, drip: true }) });
  P(`mo-drip-hoops-${mk}`, { bg: BG.molten, fill: .55, build: () => hoops({ metal: mc }) });
  P(`mo-flow-chain-${mk}`, { bg: BG.molten, fill: .6, elev: .05, hang: true, build: () => chain({ metal: mc, pendant: (() => { const s = mesh(new THREE.SphereGeometry(.09, 48, 24), M.metal(mc), 0, .26, 0); s.scale.y = 1.4; return s; })() }) });
  P(`mo-cast-signet-${mk}`, { bg: BG.molten, fill: .5, elev: .4, build: () => signet({ metal: mc }) });
}

/* ===== JEWELRY · Aveline (14k gold) ===== */
P('av-knot-ring', { bg: BG.aveline, fill: .5, elev: .3, build: () => { const k = knot({ metal: GOLD, p: 2, q: 3, R: .42, t: .075 }); k.position.y = .62; k.rotation.x = .4; return k; } });
P('av-loop-earrings', { bg: BG.aveline, fill: .55, build: () => { const g = new THREE.Group(), m = M.metal(GOLD);
  const ear = (x) => { const pts = []; for (let i = 0; i <= 50; i++) { const a = i / 50 * Math.PI * 2.4; pts.push([x + Math.sin(a) * .28, 1.25 - i / 50 * 1.0 + Math.cos(a) * .12, Math.cos(a) * .15]); } return curveTube(pts, .04, m); };
  g.add(ear(-.4), ear(.4)); return g; } });
P('av-knot-pendant', { bg: BG.aveline, fill: .62, elev: .05, hang: true, build: () => { const k = knot({ metal: GOLD, R: .14, t: .035 }); k.position.y = .22; return chain({ metal: GOLD, links: 40, pendant: k }); } });
P('av-orbit-cuff', { bg: BG.aveline, fill: .52, elev: .25, build: () => { const g = new THREE.Group(), m = M.metal(GOLD);
  const a = new THREE.Mesh(new THREE.TorusGeometry(.55, .055, 32, 160), m); a.rotation.x = 1.2; const b = new THREE.Mesh(new THREE.TorusGeometry(.55, .055, 32, 160), m); b.rotation.set(.3, .9, .2);
  g.add(a, b); g.position.y = .62; return g; } });
P('av-wave-ring', { bg: BG.aveline, fill: .5, elev: .3, build: () => { const g = new THREE.Group(), m = M.metal(GOLD), pts = [];
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 1.85; pts.push([Math.cos(a) * .5, .6 + Math.sin(a) * .5, Math.sin(a * 3) * .07]); }
  g.add(curveTube(pts, .06, m)); const end = pts[pts.length - 1]; g.add(mesh(new THREE.SphereGeometry(.1, 48, 24), m, ...end)); g.rotation.x = .5; return g; } });
P('av-bead-chain', { bg: BG.aveline, fill: .62, elev: .05, hang: true, build: () => { const g = new THREE.Group(), m = M.metal(GOLD);
  for (let i = 0; i < 42; i++) { const t = i / 41, x = -.9 + 1.8 * t, y = 1.4 - 1.05 * Math.sin(Math.PI * t); g.add(mesh(new THREE.SphereGeometry(i % 6 === 0 ? .045 : .028, 32, 16), m, x, y, 0)); }
  return g; } });

/* ===== JEWELRY · Celeste (silver + sapphire) ===== */
const SAPPH = '#1d4fd6';
P('ce-disc', { bg: BG.celeste, fill: .62, elev: .05, hang: true, build: () => { const g = new THREE.Group(), m = M.metal(SILVER, .12);
  const disc = mesh(new THREE.CylinderGeometry(.26, .26, .035, 96), m, 0, .3, 0); disc.rotation.x = Math.PI / 2; g.add(disc);
  const gem = mesh(new THREE.SphereGeometry(.05, 48, 24), M.gem(SAPPH), 0, .47, .02); g.add(gem);
  const bail = mesh(new THREE.TorusGeometry(.04, .012, 16, 48), m, 0, .6, 0); g.add(bail);
  return chain({ metal: SILVER, links: 40, pendant: g }); } });
P('ce-polaris', { bg: BG.celeste, fill: .52, elev: .3, build: () => { const g = new THREE.Group(), m = M.metal(SILVER, .12);
  const tor = new THREE.Mesh(new THREE.TorusGeometry(.5, .06, 48, 200), m); tor.scale.z = 1.4; g.add(tor);
  const gem = mesh(new THREE.OctahedronGeometry(.17, 0), M.gem(SAPPH), 0, .66, 0); gem.scale.set(1, 1.15, 1); gem.rotation.y = .4; g.add(gem);
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + .78; const pr = mesh(new THREE.CylinderGeometry(.018, .022, .2, 12), m, Math.cos(a) * .12, .62, Math.sin(a) * .12); pr.rotation.z = -Math.cos(a) * .4; pr.rotation.x = Math.sin(a) * .4; g.add(pr); }
  g.rotation.set(.22, .5, 0); const w = new THREE.Group(); w.add(g); return w; } });
P('ce-comet', { bg: BG.celeste, fill: .55, build: () => { const g = new THREE.Group(), m = M.metal(SILVER, .12);
  const ear = (x) => { const e = new THREE.Group(); e.add(curveTube([[x, 1.35, 0], [x + .12, 1.48, 0], [x + .2, 1.36, 0], [x + .16, 1.2, 0]], .015, m));
    const cap = mesh(new THREE.SphereGeometry(.035, 24, 12), m, x, 1.33, 0); e.add(cap); const d = gemDrop(SAPPH, 1.15); d.position.set(x, 1.0, 0); e.add(d); return e; };
  g.add(ear(-.32), ear(.32)); return g; } });
for (const [mk, mc] of [['silver', SILVER], ['gold', GOLD]]) {
  P(`ce-engrave-${mk}`, { bg: { base: '#050B22', hi: '#18306A' }, fill: .78, elev: 0, rim: .8, build: () => { const g = new THREE.Group(), m = M.metal(mc, .2);
    const disc = mesh(new THREE.CylinderGeometry(1, 1, .09, 160), m, 0, 1.05, 0); disc.rotation.x = Math.PI / 2; g.add(disc);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(.9, .01, 12, 160), M.metal(mc, .45)); ring2.position.set(0, 1.05, .05); g.add(ring2);
    g.add(mesh(new THREE.SphereGeometry(.1, 48, 24), M.gem(SAPPH), 0, 1.72, .06));
    const bail = mesh(new THREE.TorusGeometry(.1, .03, 16, 48), m, 0, 2.12, 0); g.add(bail);
    return g; } });
}

/* ===== scenes from the photography kit, one per site ===== */
const SCENES = {
  mv: { type: 'dramatic', wall: '#1c0f1f', ped: '#120a12', halo: '#ff8fbf', haloOp: .42, rim: '#ffd1e4', rim2: '#f3c98d', key: 1.6, rimI: 3.4, pedH: .2, fill: .7, elev: .1 },
  fn: { type: 'stone', wall: '#08050a', ped: '#2a2627', halo: '#c4183c', haloOp: .3, rim: '#ffe3e8', key: 1.2, rimI: 3.6, fill: .72, elev: .12, seed: 5 },
  pp: { type: 'arch', wall: '#E9CDD0', ped: '#DDB3B9', arch: '#E2C0C5', petals: '#D98AA4', sunX: -5, fill: .72, elev: .12 },
  hc: { type: 'pool', skyTop: '#F4FBFA', skyBot: '#CFE7E3', water: '#9FD3CB', waterOp: .62, deep: '#5aa79c', arch: '#F4FAF9', key: 2.0, fill: .52, elev: .2 },
  ms: { type: 'stone', wall: '#13221A', ped: '#3a4a3c', halo: '#B7D3A0', haloOp: .45, rim: '#e9f5dc', key: 1.4, rimI: 3.2, fill: .72, elev: .12, seed: 9 },
  sb: { type: 'arch', wall: '#E8E2D8', ped: '#F1ECE4', arch: '#C9DCD3', sunX: 5, pedKind: 'step', pedH: .5, fill: .72, elev: .12 },
  mo: { type: 'dramatic', wall: '#100c07', ped: '#0b0906', halo: '#d4af37', haloOp: .32, rim: '#ffe2a8', rim2: '#ffffff', key: 1.7, rimI: 3.0, pedH: .18, fill: .6, elev: .2 },
  av: { type: 'arch', wall: '#E9DFD1', ped: '#DCC8AE', arch: '#E4D5C1', sunX: 5, pedH: .45, fill: .64, elev: .14 },
  ce: { type: 'pool', skyTop: '#081440', skyBot: '#030818', water: '#020a24', waterOp: .9, deep: '#010410', clearcoat: .35, spec: .35, halo: '#4f7dff', haloOp: .5, light: 'rim', key: 1.5, env: .5, fill: .6, elev: .16 },
};
for (const [id, spec] of Object.entries(products)) {
  if (id.startsWith('ce-engrave')) continue; // keeps its framing: the live engraving text is aligned to it
  const pre = id.split('-')[0]; if (SCENES[pre] && !spec.scene) spec.scene = SCENES[pre];
}

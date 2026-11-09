// Studio sets inspired by the product-photography prompt kit:
// #6 dramatic rim-lit hero with halo, #7 reflective pool with arch, #8/#10 sculptural pedestal + arch in sunlight,
// #2 floating product among glossy glass ribbons, #9 minimal packshot. Product is passed in, standing on y = 0.
import * as THREE from 'three';

const std = (color, rough = .85, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });
const phys = (o) => new THREE.MeshPhysicalMaterial(o);

function gradTex(stops, w = 64, h = 512, radial = false) {
  const c = document.createElement('canvas'); c.width = radial ? 512 : w; c.height = radial ? 512 : h; const g = c.getContext('2d');
  const gr = radial ? g.createRadialGradient(256, 256, 0, 256, 256, 256) : g.createLinearGradient(0, 0, 0, h);
  stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* seamless cyclorama: floor that curves up into a back wall */
function sweep(color, { R = 2.6, wallZ = -3.6, rough = .9, y = 0 } = {}) {
  const front = 40, a = front - wallZ - R, S = a + R * Math.PI / 2 + 16;
  const geo = new THREE.PlaneGeometry(90, S, 1, 240), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const s = p.getY(i) + S / 2; let z, yy;
    if (s < a) { z = front - s; yy = 0; }
    else if (s < a + R * Math.PI / 2) { const t = (s - a) / R; z = front - a - R * Math.sin(t); yy = R * (1 - Math.cos(t)); }
    else { z = front - a - R; yy = R + (s - a - R * Math.PI / 2); }
    p.setXYZ(i, p.getX(i), yy + y, z);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, std(color, rough, { side: THREE.DoubleSide })); m.receiveShadow = true; return m;
}
function pedestal(kind, r, h, mat) {
  let g;
  if (kind === 'box') g = new THREE.BoxGeometry(r * 2, h, r * 1.6);
  else if (kind === 'step') { const grp = new THREE.Group(); const a = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.25, r * 1.25, h * .45, 128), mat); a.position.y = h * .225;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h * .55, 128), mat); b.position.y = h * .45 + h * .275; grp.add(a, b); grp.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } }); grp.userData.top = h; return grp; }
  else g = new THREE.CylinderGeometry(r, r, h, 128);
  const m = new THREE.Mesh(g, mat); m.position.y = h / 2; m.castShadow = m.receiveShadow = true; m.userData.top = h; return m;
}
function rock(r, color, seed = 3) {
  const geo = new THREE.IcosahedronGeometry(1, 4), p = geo.attributes.position, v = new THREE.Vector3();
  const n = (x, y, z) => Math.sin(x * 3.1 + seed) * Math.cos(y * 2.7 + seed * 2) * Math.sin(z * 3.7 + seed * .5) + .5 * Math.sin(x * 7.3 + z * 5.1 + seed);
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + .14 * n(v.x, v.y, v.z); v.multiplyScalar(k); if (v.y > .42) v.y = .42 + (v.y - .42) * .04; p.setXYZ(i, v.x, v.y, v.z); }
  geo.computeVertexNormals(); geo.scale(r, r * .62, r * .86);
  const m = new THREE.Mesh(geo, std(color, .95, { flatShading: true })); const top = .42 * r * .62 + .004 * r;
  m.position.y = r * .62 * .9; m.castShadow = m.receiveShadow = true; m.userData.top = m.position.y + top; return m;
}
function arch(color, { w = 2.9, h = 3.6, inner = 1.75, depth = .32 } = {}) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.lineTo(-w / 2, 0);
  const hole = new THREE.Path(), ir = inner / 2, ih = h - .45 - ir;
  hole.moveTo(-ir, 0); hole.lineTo(-ir, ih); hole.absarc(0, ih, ir, Math.PI, 0, true); hole.lineTo(ir, 0); hole.lineTo(-ir, 0); s.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 2, curveSegments: 64 });
  const m = new THREE.Mesh(geo, std(color, .8)); m.castShadow = m.receiveShadow = true; return m;
}
function halo(color, size, opacity = .85) {
  const t = gradTex([[0, color], [.35, color + 'aa'], [1, color + '00']], 0, 0, true);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }));
  return m;
}
function ribbons(tint, center, R) {
  const g = new THREE.Group();
  const mat = phys({ color: '#ffffff', roughness: .02, transmission: 1, thickness: .5, ior: 1.45, attenuationColor: new THREE.Color(tint), attenuationDistance: 2.5, clearcoat: 1 });
  [[0, 1.45, .03], [2.3, 1.75, .022]].forEach(([ph, rr, th], k) => {
    const pts = []; for (let i = 0; i <= 80; i++) { const t = i / 80, a = ph + t * Math.PI * 2.4;
      pts.push(new THREE.Vector3(Math.cos(a) * R * rr, center.y + (t - .5) * R * 1.5 + Math.sin(a * 2 + k) * .1, Math.sin(a) * R * rr * .5 - .35)); }
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, th * R * 1.4, 24, false);
    const m = new THREE.Mesh(geo, mat); m.castShadow = true; g.add(m);
  });
  return g;
}
function petals(color, n, spread, seed = 1) {
  const g = new THREE.Group(), mat = std(color, .6, { side: THREE.DoubleSide });
  for (let i = 0; i < n; i++) { const r = Math.sin(i * 12.9898 + seed) * 43758.5453; const fr = r - Math.floor(r);
    const ang = fr * Math.PI * 2, d = spread * (.55 + .45 * ((i * .618) % 1));
    const geo = new THREE.SphereGeometry(.09, 16, 8); geo.scale(1, .12, .62);
    const m = new THREE.Mesh(geo, mat); m.position.set(Math.cos(ang) * d, .012, Math.sin(ang) * d * .7 + .3); m.rotation.y = ang * 3; m.rotation.z = (fr - .5) * .4;
    m.castShadow = m.receiveShadow = true; g.add(m); }
  return g;
}

/* lighting presets */
function lights(scene, kind, opts = {}) {
  const add = (l) => { scene.add(l); return l; };
  const shadowCfg = (l, r, soft) => { l.castShadow = true; l.shadow.mapSize.set(2048, 2048); Object.assign(l.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .5, far: 30 }); l.shadow.radius = r; l.shadow.blurSamples = soft ? 24 : 12; l.shadow.bias = -.0004; };
  if (kind === 'sun') {
    const sun = add(new THREE.DirectionalLight(opts.sunColor || '#fff1de', opts.sun ?? 2.2)); sun.position.set(opts.sunX ?? -5, 4.2, 3); shadowCfg(sun, 3, false);
    add(new THREE.HemisphereLight('#ffffff', opts.ground || '#e8d6c8', .3));
    add(new THREE.DirectionalLight('#ffffff', .45)).position.set(3, 2, 4);
  } else if (kind === 'rim') {
    const key = add(new THREE.DirectionalLight('#ffffff', opts.key ?? 1.4)); key.position.set(-1.5, 5, 4); shadowCfg(key, 12, true);
    const r1 = add(new THREE.DirectionalLight(opts.rimColor || '#ffffff', opts.rim ?? 3.2)); r1.position.set(-3.5, 2.5, -3);
    const r2 = add(new THREE.DirectionalLight(opts.rimColor2 || opts.rimColor || '#ffffff', opts.rim ?? 3.2)); r2.position.set(3.5, 2.5, -3);
  } else {
    const key = add(new THREE.DirectionalLight('#ffffff', opts.key ?? 2.2)); key.position.set(-1.6, 7, 3.2); shadowCfg(key, 14, true);
    add(new THREE.DirectionalLight('#ffffff', 1.1)).position.set(3, 2, -3);
  }
}

/* the sets */
export function buildSet(scene, obj, S, hang = false) {
  const box0 = new THREE.Box3().setFromObject(obj), sz = box0.getSize(new THREE.Vector3());
  const span = Math.max(sz.x, sz.z * 1.2), frame = [obj];
  const r = Math.max(.5, span * .5 + .12);
  let lift = 0, envI = S.env ?? .9;
  const sky = (top, bot) => { scene.background = gradTex([[0, top], [1, bot]]); };

  if (S.type === 'dramatic' || S.type === 'stone') {
    scene.background = new THREE.Color(S.wall);
    scene.add(sweep(S.wall, { rough: .95 }));
    if (!hang) { const ped = S.type === 'stone' ? rock(r * 1.05, S.ped, S.seed || 3) : pedestal(S.pedKind || 'cyl', r, S.pedH ?? .22, phys({ color: S.ped, roughness: .22, clearcoat: 1, clearcoatRoughness: .1 }));
    scene.add(ped); frame.push(ped); lift = ped.userData.top; }
    const h = halo(S.halo, Math.max(sz.y, span) * 3.1, S.haloOp ?? .9); h.position.set(0, lift + sz.y * .55, -2.2); scene.add(h);
    lights(scene, 'rim', { rimColor: S.rim, rimColor2: S.rim2, key: S.key, rim: S.rimI }); envI = S.env ?? .55;
  } else if (S.type === 'arch' || S.type === 'curve') {
    scene.background = new THREE.Color(S.wall);
    scene.add(sweep(S.wall, { rough: .92 }));
    if (!hang) { const ped = pedestal(S.pedKind || 'cyl', r, S.pedH ?? .55, std(S.ped, .7)); scene.add(ped); frame.push(ped); lift = ped.userData.top; }
    if (S.type === 'arch') { const a = arch(S.arch, { w: r * 4.2, h: Math.max(3.4, lift + sz.y * 2.1), inner: r * 2.6 }); a.position.set(0, 0, -2.3); scene.add(a); }
    else { const wall = new THREE.Mesh(new THREE.CylinderGeometry(r * 2.4, r * 2.4, 4.5, 96, 1, true, Math.PI * .55, Math.PI * .9), std(S.arch, .9, { side: THREE.DoubleSide })); wall.position.set(r * .9, 2.25, -1.4); wall.castShadow = wall.receiveShadow = true; scene.add(wall); }
    if (S.petals) { const p = petals(S.petals, 14, r * 2.2); scene.add(p); }
    lights(scene, 'sun', { sunX: S.sunX, sun: S.sun, ground: S.wall }); envI = S.env ?? .42;
  } else if (S.type === 'pool') {
    sky(S.skyTop, S.skyBot);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), phys({ color: S.water, roughness: .04, transparent: true, opacity: S.waterOp ?? .72, clearcoat: S.clearcoat ?? 1, clearcoatRoughness: .04, specularIntensity: S.spec ?? 1, depthWrite: false }));
    water.rotation.x = -Math.PI / 2; water.position.y = .001; water.receiveShadow = true; scene.add(water);
    const deep = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), std(S.deep, .9)); deep.rotation.x = -Math.PI / 2; deep.position.y = -6; scene.add(deep);
    const mirror = obj.clone(true); mirror.scale.y = -1; mirror.position.y = -(lift) ; mirror.userData.isMirror = true; scene.add(mirror);
    for (const [k, rr] of [[0, 1.05], [1, 1.55], [2, 2.15]]) { const ring = new THREE.Mesh(new THREE.RingGeometry(r * rr, r * rr + .012, 128), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .32 - k * .08, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = .004; ring.scale.y = 1; scene.add(ring); }
    if (S.arch) { const a = arch(S.arch, { w: r * 5.2, h: Math.max(2.6, sz.y * 1.9), inner: r * 3.4 }); a.position.set(0, -.3, -4.2); scene.add(a); }
    if (S.halo) { const h = halo(S.halo, Math.max(sz.y, span) * 3, S.haloOp ?? .7); h.position.set(0, lift + sz.y * .55, -2.6); scene.add(h); }
    lights(scene, S.light || 'soft', { key: S.key }); envI = S.env ?? .9;
  } else if (S.type === 'ribbons') {
    scene.background = new THREE.Color(S.wall);
    scene.add(sweep(S.wall, { rough: .95 }));
    lift = S.float ?? .55;
    const c = new THREE.Vector3(0, lift + sz.y / 2, 0); const rb = ribbons(S.tint, c, Math.max(span, sz.y) * .75); scene.add(rb);
    const h = halo(S.halo, Math.max(sz.y, span) * 3, S.haloOp ?? .6); h.position.set(0, c.y, -2.4); scene.add(h);
    lights(scene, 'rim', { rimColor: S.rim, key: S.key ?? 1.8, rim: S.rimI ?? 2.6 }); envI = S.env ?? .9;
    frame.push(rb);
  } else { // packshot
    scene.background = new THREE.Color(S.wall); scene.add(sweep(S.wall)); lights(scene, 'soft');
  }
  obj.position.y += lift;
  scene.environmentIntensity = envI;
  return { frame, lift };
}

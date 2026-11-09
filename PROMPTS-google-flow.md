# Model and hand shots: prompts for Google Flow

The 3D studio now covers the kit's product-only scenes (#2, #6, #7, #8, #9, #10). Scenes with people and hands (#1, #3, #4, #5, #6 with hands) need an image tool. These prompts are adapted from the VDM Social kit for each of your nine brands.

**How to use (from the kit's workflow):**
1. Upload the render named under each prompt as **image A, the product reference**. Renders live in each site's `products/` folder.
2. Optionally upload an inspiration image as **image B**, and tell the tool: "Use image A for the exact product; use image B for composition and atmosphere only."
3. Paste the prompt, then append the **product lock** and **negative prompt** at the bottom of this file.
4. Check the label, cap and proportions afterwards. If small label text comes out wrong, composite the original render over the product.

The kit's prompts all add an "@vdmsocial" watermark. It's the kit author's handle, so it's removed here; don't add it to your own products. Size: 1013 × 1350 px (3:4). The site cards crop to 4:5 automatically.

---

## Perfume

### Maison Vey (`perfume-shopify/products/terre-fleurie.webp`)
**Hand-held hero (kit #6).** Create a dramatic luxury fragrance advertisement with the uploaded perfume bottle held delicately between elegant hands with long, deep-plum polished nails. Center the bottle above the hands as the hero. Use a deep aubergine-to-black gradient background with a soft halo of warm pink-gold light behind the bottle, strong rim lighting, rich shadows and reflective highlights on the gold cap. The hands must look anatomically correct and must not cover the black-and-gold label. Preserve the bottle's exact rectangular shape, amber liquid, gold cap and label. Vertical 3:4, 1013 × 1350 px.

**Beauty close-up (kit #1).** Recreate a premium beauty campaign using the uploaded perfume as the exact product reference. Close crop of a model from nose to shoulders, glossy berry lips, luminous skin, subtle gold jewelry, a manicured hand resting beside the bottle. Place the bottle in the foreground on a plum satin cushion. Soft directional studio light, aubergine and champagne monochrome palette, realistic skin texture. Preserve the bottle's silhouette, cap, colors and label exactly. Vertical 3:4.

### Flore Noire (`perfume-webflow/products/pavot.webp`)
**Editorial portrait with a prop (kit #4).** Create a moody beauty campaign with a confident model in a black satin shirt against a near-black studio background. Sleek hair, polished makeup, deep crimson lips. One hand holds the uploaded perfume near the cheek; the other raises a single red poppy. Keep the poppy secondary and never let it cover the cream label. Hard, directional light with a faint crimson rim. Match the bottle exactly: black cap, crimson liquid, cream "Flore Noire" label. Vertical 3:4.

**Hand-held hero (kit #6).** Same as Maison Vey's, but with a black-to-oxblood gradient background, a faint crimson halo and black lacquered nails.

### Petal & Pyre (`perfume-wordpress/products/rose.webp`)
**Blossom garden (kit #8).** Create a romantic spring fragrance campaign. Place the uploaded perfume centered on a matte blush-pink pedestal under a softly lit architectural arch, with a pastel sky, cherry blossoms reaching in from the upper corners, and real pink roses framing the lower edges. A few petals float through the scene. Soft sunlight, elegant shadows. Keep the flowers at the edges so the label stays clear. Use the bottle exactly as provided: round black cap, rose-pink liquid, "Petal & Pyre" label. Vertical 3:4.

**Playful portrait (kit #4).** A model in a dusty-rose satin shirt against a blush background, with voluminous natural curls and glossy lips. One hand holds the uploaded perfume near the shoulder; the other raises a garden rose. Soft directional light. Product exactly as the reference. Vertical 3:4.

---

## Skincare

### Halcyon (`skincare-shopify/products/serum.webp`)
**Open palm (kit #3).** This prompt is almost made for Halcyon. Create a refined skincare campaign in clean editorial style. A model in side profile on the right, hair pulled back, natural luminous skin, a simple pale-aqua knit top. She holds one open palm horizontally with the uploaded serum bottle standing upright on it, looking toward the product. Very light cool-gray studio background, soft diffused light, realistic hand anatomy. Preserve the dropper, collar color, frosted glass and "halcyon" label exactly. Vertical 3:4.

**Reflective water (kit #7, already matched in the studio renders).** To push it further: a pale-aqua arch, soft white sculptural mounds, and a clear sky with faint peach clouds at sunrise.

### Mosse (`skincare-webflow/products/water.webp`)
**Open palm, forest version (kit #3).** A model in side profile with a moss-green knit top against a deep forest-green studio background. Her open palm holds the uploaded amber bottle upright. Soft, low key light with a cool rim on the glass so the amber glows. Preserve the amber glass, the white dropper and the cream "Mosse" label. Vertical 3:4.

### Sable (`skincare-wordpress/products/cleanse.webp`)
**Denim pocket (kit #5).** Create a fashionable close-up product campaign. Frame a model's light-wash denim at the waist, with the pocket holding one uploaded Sable tube; a manicured hand with delicate gold rings reaches toward it. Detailed denim weave and stitching, natural hand anatomy, realistic contact shadows. Warm linen-neutral background, polished commercial light. Keep the tube faithful: white body, black cap, "Sable" label. Vertical 3:4.

---

## Jewelry
For jewelry, the model **wears** the piece, so the prompts change "holds the bottle" to "wears the piece".

### Molten (`jewelry-shopify/products/pour-ring-gold.webp`)
**Hand hero (kit #6).** Create a dramatic fine-jewelry advertisement. An elegant hand with short, nude-polished nails wears the uploaded gold ring on the ring finger, posed against a deep onyx-black background with a soft halo of warm gold light behind it. Strong rim light picks out the ring's polished edges. The ring must match the reference exactly: a smooth, molten-edged 18k gold band. No extra rings. Vertical 3:4.

### Aveline (`jewelry-webflow/products/knot-pendant.webp`)
**Beauty close-up (kit #1).** A close crop of a model from chin to collarbone, luminous natural skin, hair swept back, wearing the uploaded knot pendant on a fine gold chain at the collarbone. Ivory silk top, soft directional daylight, champagne and ivory palette. The pendant is the focal point and must match the reference: a small hand-knotted solid-gold knot on a cable chain. Vertical 3:4.

### Celeste (`jewelry-wordpress/products/disc.webp`)
**Hand hero, night (kit #6).** Elegant hands hold the uploaded silver disc pendant by its chain against a midnight-navy gradient, with a soft sapphire-blue halo behind it. Rim light catches the polished silver, and the small sapphire glows. Keep the disc, bail and stone exactly as in the reference, and leave the face of the disc clear for engraving. Vertical 3:4.

---

## Product lock (append to every prompt)
PRODUCT FIDELITY IS THE HIGHEST PRIORITY. Use the uploaded product image as the ground-truth reference for the product itself. Keep its exact silhouette, dimensions, proportions, cap or pump, materials, colors, label layout, logo and visible wording. Do not replace it with a similar product, simplify the packaging, invent claims or alter brand identity. Change only the scene, model, props, background, lighting, camera angle and composition. If exact small label text cannot be reproduced, keep the label design visually faithful and do not invent new text.

## Negative prompt
Wrong bottle shape; changed cap or pump; altered label; misspelled brand; invented logos; duplicate product; distorted packaging; floating parts; extra fingers; fused fingers; unnatural hands; plastic-looking skin; blurry product; obscured label; clutter; low resolution; watermark; UI overlays; borders; cropped product.

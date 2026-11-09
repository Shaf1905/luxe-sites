# Moving these previews onto each platform

Each `index.html` is a single file: inline CSS, inline JS, Google Fonts, and media hotlinked from the MotionSites shelf. The top of every file has a comment block that maps its sections to that platform's building blocks.

## Shopify (Maison Vey, Halcyon, Molten)
- Each `[data-section="…"]` becomes one file in `sections/` (Online Store 2.0). Copy and links become section settings and blocks.
- The `PRODUCTS` array mirrors Shopify's product JSON (prices in cents, variants with ids). Replace it with `{% for product in collection.products %}`.
- Swap the demo bag (localStorage) for the Ajax Cart API: `POST /cart/add.js`, `GET /cart.js`.
- Upload the hero video to **Content → Files** and point the section's video setting at it. Don't rely on the hotlinked URL.

## Webflow (Flore Noire, Mosse, Aveline)
- Classes follow **Client-First** (`section_*`, `padding-global`, `container-large`). Paste a section into an Embed to start, then rebuild it natively in the Designer.
- `.w-dyn-list / .w-dyn-items / .w-dyn-item` mark the parts that should become **CMS Collection Lists**.
- The small scripts (cursor bottle, word reveal, tabs, horizontal scroll) can go in **Page settings → before `</body>`**, or be rebuilt as Webflow Interactions.
- Use a Background Video element for hero videos (upload the MP4 to Webflow).
- Webflow needs a paid site plan for Ecommerce, or you can use a Shopify Buy Button instead.

## WordPress (Petal & Pyre, Sable, Celeste)
- Markup uses core block classes (`wp-block-cover`, `wp-block-group`, `wp-block-buttons`, `wp-block-details`, `wp-block-post-template`) and WooCommerce block classes (`wc-block-grid__products`, `add_to_cart_button`).
- Colors and fonts are CSS variables named like `theme.json` presets (`--wp--preset--color--*`). Copy them into your block theme's `theme.json`.
- Each `<section>` can be registered as a block pattern (`patterns/*.php`). Interactive pieces (scent finder, skin filter, engraving preview) go in a Custom HTML block, with the script enqueued from `functions.php`.

## Before going live, replace
- Brand names, prices, addresses and stats. They're all made up.
- The 3D product renders, with your own product photography, if you have it.
- The hotlinked shelf videos and images, with files you host yourself.
- Demo forms and carts: they only show a message and aren't connected to anything.

## Product images (3D renders)
Every product image lives in each site's `products/` folder as a `.webp` render (1000×1250). They come from the 3D studio in `_studio/`:
- `_studio/products.js` holds one small 3D model per product (shapes, materials, label text, backdrop color).
- To re-render, serve the folder (`python -m http.server 8765` from `luxe-sites`), then run `python _studio/render.py` for everything, or `python _studio/render.py mv hc-serum` for just a few.
- On a platform, upload the renders as product images (Shopify product media, Webflow CMS image field, WooCommerce product gallery). Replace them with real photography whenever you have it: the sites just use `<img>` tags.

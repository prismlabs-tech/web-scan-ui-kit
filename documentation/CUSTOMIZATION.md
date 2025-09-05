# Customization

You can customize Prism at runtime without rebuilding:

1. Theming (colors, fonts, corner radii via CSS variables)
2. Localization (override or add strings, inline or remote JSON)
3. Custom assets (override built-in SVGs with your URLs)

## Theming (CSS variables)

All theme properties are standard CSS variables scoped under the `.prism-css` class (see `src/ui/theme/theme.css`). Apply overrides on a container that wraps the widget, or on `:root`.

Minimal example (host page):

```html
<style>
  .prism-css {
    --primary-color: #6c9cf8;
    --success-color: #28c76f;
    --error-color: #ff4d4f;
    --background-color: #0f0f12;
    --title-text-color: #ffffff;
    --font-family:
      Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    --primary-button-corner-radius: 16px;
    --outline-gradient: linear-gradient(90deg, #6c9cf8, #35d0ba, #f8d36c);
  }
</style>

<!-- Somewhere in body: ensure the widget is inside an element with .prism-css -->
<div class="prism-css">
  <div class="prism-button"></div>
  <!-- Prism injects UI inside here -->
  <div id="root"></div>
  <!-- ... -->
  <script src="./default/prism.js" async></script>
  <!-- onPrismLoaded listener as shown below -->
</div>
```

Common variables you may want to override quickly:

- Colors: `--primary-color`, `--success-color`, `--error-color`, `--border-color`, `--background-color`, `--title-text-color`
- Fonts: `--font-family`, `--title-font-size`, `--body-font-size`
- Radii: `--primary-button-corner-radius`, `--card-corner-radius`
- Pose overlay: `--pose-acceptable-color`, `--pose-unacceptable-color`, `--pose-landmark-color`

_Refer to the `theme.css` for all available properties._

## Localization

Provide overrides when calling `render`. You can pass inline resources or load remote JSON files. Keys merge deeply with existing defaults when `merge: true`.

Inline example:

```html
<script>
  window.addEventListener('onPrismLoaded', async function (event) => {
    await event.detail.prism.render({
      localization: {
        language: 'en',
        fallbackLanguage: 'en',
        resources: {
          en: {
            translation: {
              leveling: { title: 'Custom Leveling Title' },
              recording: { title: 'Get ready to spin' },
            },
          },
        },
        merge: true,
      },
    })
  })
</script>
```

Remote JSON example (use absolute URLs; JSON may be flat or namespaced):

```html
<script>
  window.addEventListener('onPrismLoaded', async function (event) => {
    await event.detail.prism.render({
      localization: {
        language: 'en',
        fallbackLanguage: 'en',
        resourceUrls: {
          // Single file per language
          en: 'https://cdn.example.com/prism/translations/en.json',
          // Or multiple files; they will be merged in order
          es: [
            'https://cdn.example.com/prism/translations/es.json',
            'https://cdn.example.com/prism/translations/es-common.json',
          ],
        },
        merge: true,
      },
    })
  })

  /* Notes:
    - If a JSON file is namespaced like { "translation": { ... }, "errors": { ... } },
      each namespace is added. If it's flat (just keys), it's added under the default
      "translation" namespace.
    - Ensure your CDN returns CORS headers if fetching from another origin.
  */
</script>
```

Note: Refer to the example `ens.json` for all available translation files.

## Custom Assets (SVG overrides)

You can replace built-in SVGs (under `public/images/svg`) with your own URLs.

```html
<script>
  window.addEventListener('onPrismLoaded', async function (event) => {
    await event.detail.prism.render({
      assets: {
        svg: {
          // Keys are normalized; any of these are valid:
          // 'phone_position', 'phone_position.svg', or 'images/svg/phone_position.svg'
          phone_position: 'https://cdn.example.com/prism/phone_position.brand.svg',
          rotate: 'https://cdn.example.com/prism/rotate.brand.svg',
        },
      },
    })
  })
</script>
```

How it works:

- Internally, components resolve icons through a helper that first checks your overrides and otherwise falls back to `/images/svg/{name}.svg`.
- Use absolute HTTPS URLs. If an asset is ever drawn onto a canvas, ensure the server provides permissive CORS headers.
- Cache-busting: append a version query (e.g., `?v=2025-08-20`).

## Putting it all together

```html
<script>
  window.addEventListener('onPrismLoaded', async function (event) => {
    await event.detail.prism.render({
      localization: {
        language: 'en',
        fallbackLanguage: 'en',
        // Inline + remote JSON can be combined; last write wins
        resources: {
          en: { translation: { positioning: { title: 'Position Yourself' } } },
        },
        resourceUrls: {
          en: 'https://cdn.example.com/prism/translations/en.json',
        },
        merge: true,
      },
      assets: {
        svg: {
          phone_position: 'https://cdn.example.com/prism/phone_position.brand.svg',
        },
      },
    })
  })

  // Also add your CSS variable overrides (see theming section above)
</script>
```

### Troubleshooting

- If an override key doesn’t appear, double‑check the exact translation path used in code (e.g., `t('leveling.title')`).
- If other strings disappear, ensure `merge: true` is set; `false` replaces the whole namespace.
- For remote JSON/SVG from another origin, verify CORS headers and try a hard refresh to avoid caching.

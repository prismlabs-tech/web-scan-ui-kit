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
    --primary-color: #6c9cf8 !important;
    --success-color: #28c76f !important;
    --error-color: #ff4d4f !important;
    --background-color: #0f0f12 !important;
    --title-text-color: #ffffff !important;
    --font-family:
      Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
      sans-serif !important;
    --primary-button-corner-radius: 16px !important;
    --outline-gradient: linear-gradient(
      90deg,
      #6c9cf8,
      #35d0ba,
      #f8d36c
    ) !important;
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

- Colors (actions/feedback/surfaces): `--primary-color`, `--success-color`, `--error-color`, `--background-color`, `--secondary-background-color`, `--shadow-color`, `--border-color`
- Text colors: `--title-text-color` (large titles), `--text-color` (body), `--disabled-text-color`, `--button-text-color`
- Icons: `--primary-icon-color` (applies to masked SVG icons like YellowIcon), `--icon-background-color`
- Asset size (illustrations/spinner): `--illustration-size` (default `150px`)
- Modal close button: `--close-button-background-color`, `--close-button-icon-color`
- Radii: `--primary-button-corner-radius`, `--small-button-corner-radius`, `--card-corner-radius`, `--sheet-corner-radius`
- Typography: `--font-family`, `--large-title-font-size`, `--large-title-font-weight`, `--large-title-line-height`, `--secondary-title-*`, `--body-*`
- Pose overlay (camera overlays): `--pose-acceptable-color`, `--pose-unacceptable-color`, `--pose-landmark-color`
- Gradients/accents: `--outline-gradient` (card/border ring gradient)

_Refer to the `theme.css` for all available properties._

**NOTE:** The `!important` flag may be required in some cases depending on how the modal is presented. This ensures that we force our custom theme on top of the default theme regardless of when the SDK is initialized.

### Variable reference (from `theme.css`)

Below is a quick reference of the most relevant variables and what they affect in the UI:

- Action and feedback colors
  - `--primary-color`: Primary actions (buttons, emphasis)
  - `--success-color`: Success states and confirmations
  - `--error-color`: Error banners/messages
  - `--shadow-color`: Card/banners drop shadows
  - `--border-color`: Generic borders (currently limited use)

- Surfaces and backgrounds
  - `--background-color`: Banners/cards background
  - `--secondary-background-color`: Secondary surfaces
  - `--overlay-color`: Camera overlay tint

- Icons
  - `--primary-icon-color`: Foreground color for masked SVG icons (e.g., YellowIcon)
  - `--icon-background-color`: Round icon badge background

- Illustrations and spinners
  - `--illustration-size`: Controls the rendered size of banner/illustration assets and the spinner (e.g., Positioning, Posing, Recording, Level screens). Default is `150px`.

- Modal close button
  - `--close-button-background-color`: Background color of the modal close button
  - `--close-button-icon-color`: Color of the "X" icon on the close button

- Text
  - `--title-text-color`: Color for large titles (e.g., banner/alert titles)
  - `--text-color`: Default body text
  - `--disabled-text-color`: Disabled text
  - `--button-text-color`: Text on buttons

- Radii
  - `--primary-button-corner-radius`: Primary button rounding
  - `--small-button-corner-radius`, `--sheet-corner-radius`: Reserved/secondary
  - `--card-corner-radius`: Cards/banners rounding

- Typography
  - `--font-family`: Global font stack
  - `--large-title-font-size`/`-weight`/`-line-height`: Banner/Alert large title style
  - `--secondary-title-font-size`/`-weight`/`-line-height`: Subtitle under icons
  - `--body-font-size`/`-weight`/`-line-height`: Body copy

- Accents
  - `--outline-gradient`: Gradient ring around banners/cards

Tip: All length values accept rem/px; prefer rem for scalable typography. For example, to set large titles to 100px at the default root size, use `6.25rem`.

Example (Typography overrides):

```css
.prism-css {
  /* 100px at 16px base */
  --large-title-font-size: 6.25rem !important;
  --large-title-font-weight: 800 !important;
  --large-title-line-height: 1.05 !important;

  --secondary-title-font-size: 1.5rem !important;
  --body-font-size: 1rem !important;
}
```

Example (Icon colors and badge):

```css
.prism-css {
  --primary-icon-color: #121111 !important; /* masked SVG foreground */
  --icon-background-color: #fbda6b !important; /* circular badge behind icon */
}
```

Example (Adjust illustration/spinner size):

```css
.prism-css {
  /* Increase the size of banner illustrations and spinner */
  --illustration-size: 200px !important; /* default is 150px */
}
```

Example (Modal close button):

```css
.prism-css {
  --close-button-background-color: #000000 !important; /* button background */
  --close-button-icon-color: #ffffff !important; /* "X" icon color */
}
```

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

Note: Refer to the example `en.json` for all available translation files.

Local JSON example (same-origin files, e.g., when using npm):

```html
<script>
  // Place your JSON files in your app's public folder, e.g.:
  //   public/languages/en.json
  //   public/languages/es.json
  // Easiest option: use relative or root-relative URLs. The SDK will resolve:
  //  - Absolute (https://) → fetched as-is (remote)
  //  - Root-relative (/languages/en.json) → window.location.origin + path
  //  - Relative (languages/en.json) → against <base href> if present, else against origin root
  window.addEventListener("onPrismLoaded", async function (event) {
    await event.detail.prism.render({
      localization: {
        language: "en",
        fallbackLanguage: "en",
        resourceUrls: {
          en: "languages/en.json",
          es: "languages/es.json",
        },
        // Optional: provide an absolute base URL to override resolution (e.g., behind a reverse proxy)
        // resourceBasePath: window.location.origin + '/languages/',
        merge: true,
      },
    });
  });
  /* Notes:
  - Without resourceBasePath: absolute URLs fetch remotely; '/path' resolves from origin; 'path' resolves against <base href> or origin.
  - If you set resourceBasePath, it acts as the base for relative paths.
    - Files can be flat { key: value } or namespaced { translation: {...}, errors: {...} }.
    - Use cache-busting (e.g., 'en.json?v=1') if you update files and see stale content.
  */
</script>
```

Using npm/TypeScript with the programmatic API, pass the same config to `PrismScanner`:

```ts
import { PrismScanner } from "@prismlabs/web-scan-ui-kit";

const scanner = new PrismScanner({
  localization: {
    language: "en",
    fallbackLanguage: "en",
    resourceUrls: { en: "languages/en.json" },
    // Optional: force base for relatives if needed:
    // resourceBasePath: window.location.origin + '/languages/',
    merge: true,
  },
});

scanner.present();
```

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

- If the theme changes are not being applied, make sure you are using `!important` to for an override.
- If other strings disappear, ensure `merge: true` is set; `false` replaces the whole namespace.
- For remote JSON/SVG from another origin, verify CORS headers and try a hard refresh to avoid caching.
- If illustrations look too large or too small, adjust `--illustration-size` on the container that wraps the widget (e.g., `.prism-css { --illustration-size: 180px !important; }`).

# Callbacks (Browser Events)

The Prism Web SDK dispatches browser events you can subscribe to from your host page. There are three core events:

1. `onPrismLoaded`
   - Fired when the SDK is ready and exposes a `PrismInstance` you can use to render the widget and provide runtime config (localization, asset overrides, etc.).
2. `onPrismScanComplete`
   - Fired when the recording finishes. Provides a `Blob` containing the captured video you can upload/store.
3. `onPrismStateChange`
   - Fired whenever the session state changes (e.g., LEVELING → POSITIONING → POSING → RECORDING → PROCESSING → FINISHED). Useful for analytics or UI orchestration.

All events are dispatched on `window` using `CustomEvent` and can be listened to with `window.addEventListener`.

---

## onPrismLoaded

Dispatched by the SDK once the `PrismInstance` is constructed.

Payload shape

- type: `CustomEvent<{ prism: PrismInstance }>`
- source: `dispatchPrismLoaded(prism)`

What you can do

- Call `event.detail.prism.render(config)` to initialize the widget.
- Provide runtime localization and/or asset overrides via the config.

Example

```html
<script>
  window.addEventListener('onPrismLoaded', function (event) {
    event.detail.prism.render({})
  })
</script>
```

---

## onPrismScanComplete

Dispatched by the SDK when a scan finishes and a video blob is available.

Payload shape

- type: `CustomEvent<{ blob: Blob }>`
- source: `dispatchScanComplete(blob)`

Notes

- The event won't fire if no blob is produced. Ensure recording was started and completed.
- Use `URL.createObjectURL` for quick previews/downloads, or upload the `Blob` to your API.

Examples

```html
<script>
  window.addEventListener('onPrismScanComplete', function (event) {
    const blob = event.detail.blob

    // Preview in a video element
    const url = URL.createObjectURL(blob)
    const video = document.createElement('video')
    video.controls = true
    video.src = url
    document.body.appendChild(video)

    // Or upload to your server
    // fetch('/upload', { method: 'POST', body: blob })
  })
</script>
```

---

## onPrismStateChange

Dispatched whenever the internal `PrismSessionState` changes.

Payload shape

- type: `CustomEvent<{ state: PrismSessionState }>`
- source: `dispatchStateChange(state)`

Common states you might observe

- LEVELING, POSITIONING, POSING, RECORDING, PROCESSING, FINISHED (exact enum values are defined in `src/capture/session/prism-session-state.ts`).

Examples

```html
<script>
  window.addEventListener('onPrismStateChange', function (event) {
    const state = event.detail.state
    console.log('Prism state changed:', state)

    // analytics.track('Prism State Change', { state })
  })
</script>
```

---

## Tips & Troubleshooting

- Ensure your host page includes the SDK script and your event listeners are defined before the events fire (placing the listeners in the `<head>` or before the script tag is ideal).
- For localization overrides to take effect, they must be provided to `render` via `localization` and will be applied before the widget mounts.
- Asset overrides require callers to resolve images through the SDK (e.g., using `resolveSvg('name')` in the UI). If you still see the default asset, ensure the component was updated to use the resolver.
- For large blobs, consider streaming uploads or showing a progress indicator while uploading.

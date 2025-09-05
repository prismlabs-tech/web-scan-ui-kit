import { prismEventBus } from "./EventBus";
import { PRISM_SCAN_COMPLETE_EVENT } from "./EventNames";
/**
 * Dispatches the `onPrismScanComplete` CustomEvent to the window.
 *
 * Emits the recorded scan as a Blob so host apps can upload or preview the media.
 *
 * Listener example:
 * ```ts
 * window.addEventListener('onPrismScanComplete', (e) => {
 *   const { blob } = (e as CustomEvent<{ blob: Blob }>).detail
 *   // Handle blob
 * })
 * ```
 */
export function dispatchScanComplete(blob?: Blob) {
  if (!blob) {
    console.warn("No blob provided for scan completion.");
    return;
  }

  window.dispatchEvent(
    new CustomEvent(PRISM_SCAN_COMPLETE_EVENT, {
      detail: {
        blob,
      },
    })
  );
  prismEventBus.emit(PRISM_SCAN_COMPLETE_EVENT, { blob });
}

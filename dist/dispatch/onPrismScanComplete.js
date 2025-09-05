import { prismEventBus } from './EventBus.js';
import { PRISM_SCAN_COMPLETE_EVENT } from './EventNames.js';
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
export function dispatchScanComplete(blob) {
    if (!blob) {
        console.warn("No blob provided for scan completion.");
        return;
    }
    window.dispatchEvent(new CustomEvent(PRISM_SCAN_COMPLETE_EVENT, {
        detail: {
            blob: blob,
        },
    }));
    prismEventBus.emit(PRISM_SCAN_COMPLETE_EVENT, { blob: blob });
}

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
export declare function dispatchScanComplete(blob?: Blob): void;

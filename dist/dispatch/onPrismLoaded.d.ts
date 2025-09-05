import { PrismInstance } from "../widgetConfig";
/**
 * Dispatches the `onPrismLoaded` CustomEvent to the window.
 *
 * Exposes the initialized Prism instance to the host app.
 *
 * Listener example:
 * ```ts
 * window.addEventListener('onPrismLoaded', (e) => {
 *   const { prism } = (e as CustomEvent<{ prism: PrismInstance }>).detail
 *   // Use prism instance
 * })
 * ```
 */
export declare const dispatchPrismLoaded: (prismInstance: PrismInstance) => void;

import { prismEventBus } from './EventBus.js';
import { PRISM_LOADED_EVENT } from './EventNames.js';
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
export var dispatchPrismLoaded = function (prismInstance) {
    var event = new CustomEvent(PRISM_LOADED_EVENT, {
        bubbles: true,
        cancelable: true,
        detail: { prism: prismInstance },
    });
    window.dispatchEvent(event);
    prismEventBus.emit(PRISM_LOADED_EVENT, { prism: prismInstance });
};

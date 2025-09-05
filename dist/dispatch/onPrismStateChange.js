import { prismEventBus } from './EventBus.js';
import { PRISM_STATE_CHANGE_EVENT } from './EventNames.js';
/**
 * Dispatches the `onPrismStateChange` CustomEvent to the window.
 *
 * Notifies host apps whenever the SDK transitions to a new session state
 * (e.g., Leveling → Positioning → Recording → Processing → Finished).
 *
 * Listener example:
 * ```ts
 * window.addEventListener('onPrismStateChange', (e) => {
 *   const { state } = (e as CustomEvent<{ state: PrismSessionState }>).detail
 *   // Respond to state change
 * })
 * ```
 */
export function dispatchStateChange(state) {
    window.dispatchEvent(new CustomEvent(PRISM_STATE_CHANGE_EVENT, {
        detail: {
            state: state,
        },
    }));
    prismEventBus.emit(PRISM_STATE_CHANGE_EVENT, { state: state });
}

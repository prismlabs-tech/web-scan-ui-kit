import { PrismSessionState } from "@prismlabs/web-scan-core";
import { prismEventBus } from "./EventBus";
import { PRISM_STATE_CHANGE_EVENT } from "./EventNames";

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
export function dispatchStateChange(state: PrismSessionState) {
  window.dispatchEvent(
    new CustomEvent(PRISM_STATE_CHANGE_EVENT, {
      detail: {
        state: state,
      },
    })
  );
  prismEventBus.emit(PRISM_STATE_CHANGE_EVENT, { state });
}

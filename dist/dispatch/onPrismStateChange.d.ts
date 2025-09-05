import { PrismSessionState } from "@prismlabs/web-scan-core";
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
export declare function dispatchStateChange(state: PrismSessionState): void;

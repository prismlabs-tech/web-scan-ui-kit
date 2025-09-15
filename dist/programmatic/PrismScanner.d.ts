import { type PrismEventMap } from "../dispatch/EventBus";
import { PRISM_LOADED_EVENT, PRISM_SCAN_COMPLETE_EVENT, PRISM_STATE_CHANGE_EVENT } from "../dispatch/EventNames";
import type { PrismConfig, PrismInstance } from "../widgetConfig";
type Unsubscribe = () => void;
/**
 * Programmatic scanner with constructor config, no window events.
 * Listeners can be registered immediately after construction.
 *
 * Refer to `PrismConfig` for available configuration options.
 */
export declare class PrismScanner implements PrismInstance {
    version: string;
    constructor(config: PrismConfig);
    render(config: PrismConfig): Promise<void>;
    unmount(): void;
    onPrismLoaded(handler: (payload: PrismEventMap[typeof PRISM_LOADED_EVENT]) => void): Unsubscribe;
    onPrismStateChange(handler: (payload: PrismEventMap[typeof PRISM_STATE_CHANGE_EVENT]) => void): Unsubscribe;
    onPrismScanComplete(handler: (payload: PrismEventMap[typeof PRISM_SCAN_COMPLETE_EVENT]) => void): Unsubscribe;
    /** Programmatically present the Prism modal. */
    present(): void;
}
export default PrismScanner;

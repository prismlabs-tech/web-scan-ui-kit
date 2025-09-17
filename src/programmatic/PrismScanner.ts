import { applyCustomAssets } from "../assets/assetRegistry";
import { prismEventBus, type PrismEventMap } from "../dispatch/EventBus";
import {
  PRISM_LOADED_EVENT,
  PRISM_SCAN_COMPLETE_EVENT,
  PRISM_STATE_CHANGE_EVENT,
} from "../dispatch/EventNames";
import { applyCustomI18n } from "../i18n/applyCustomI18n";
import { setRuntimeLanguage } from "../shared/runtimeConfig";
import { presentPrismModal } from "../ui/prism-button/prism-button";
import type { PrismConfig, PrismInstance } from "../widgetConfig";

type Unsubscribe = () => void;

/**
 * Programmatic scanner with constructor config, no window events.
 * Listeners can be registered immediately after construction.
 *
 * Refer to `PrismConfig` for available configuration options.
 */
export class PrismScanner implements PrismInstance {
  version = process.env.PRISM_VERSION as string;

  constructor(config: PrismConfig) {
    void this.render(config);
  }

  async render(config: PrismConfig) {
    if (config?.localization) {
      await applyCustomI18n(config.localization);
      setRuntimeLanguage(config.localization.language);
    }
    if (config?.assets) {
      applyCustomAssets(config.assets);
    }
    // Emit programmatic loaded event for package consumers
    prismEventBus.emit(PRISM_LOADED_EVENT, { prism: this });
  }

  unmount(): void {
    // Is this needed? Part of the implementation we are using so it has to be here.
  }

  onPrismLoaded(
    handler: (payload: PrismEventMap[typeof PRISM_LOADED_EVENT]) => void
  ): Unsubscribe {
    return prismEventBus.on(PRISM_LOADED_EVENT, handler);
  }

  onPrismStateChange(
    handler: (payload: PrismEventMap[typeof PRISM_STATE_CHANGE_EVENT]) => void
  ): Unsubscribe {
    return prismEventBus.on(PRISM_STATE_CHANGE_EVENT, handler);
  }

  onPrismScanComplete(
    handler: (payload: PrismEventMap[typeof PRISM_SCAN_COMPLETE_EVENT]) => void
  ): Unsubscribe {
    return prismEventBus.on(PRISM_SCAN_COMPLETE_EVENT, handler);
  }

  /** Programmatically present the Prism modal. */
  present() {
    presentPrismModal();
  }
}

export default PrismScanner;

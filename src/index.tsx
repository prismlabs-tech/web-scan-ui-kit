import { applyCustomAssets } from "./assets/assetRegistry";
import { dispatchPrismLoaded } from "./dispatch";
import { applyCustomI18n } from "./i18n/applyCustomI18n";
import "./i18n/i18n";
import { findAndRenderPrismButton } from "./ui/prism-button/prism-button";
import "./ui/theme/theme.css";
import { PrismConfig, PrismInstance } from "./widgetConfig";

const Prism: PrismInstance = {
  render: async (config: PrismConfig) => {
    if (config?.localization) {
      await applyCustomI18n(config.localization);
    }
    if (config?.assets) {
      applyCustomAssets(config.assets);
    }
    initializeWidget(config);
  },
  unmount() {
    // leaving this empty function for legacy support
  },
  version: process.env.PRISM_VERSION as string,
};

async function initializeWidget(config: PrismConfig) {
  console.log("Initializing Prism SDK");
  console.log(
    `Prism SDK version ${process.env.PRISM_VERSION} with config: ${JSON.stringify(config)}`
  );

  findAndRenderPrismButton();
}

dispatchPrismLoaded(Prism);

export {};

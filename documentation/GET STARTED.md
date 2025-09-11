# Get Started

To get started with Web SDK, you have to inject the SDK from the CDN into your document, similarly to this snippet below

## Setup

There are two ways to use the Prism Web Scan UI Kit:

### 1. Using the CDN (Script Tag)

```typescript
useEffect(() => {
  const scriptUrl = "";
  const script = document.createElement("script");
  script.src = scriptUrl;
  script.async = true;
  script.onload = () => {
    console.log("Remote script loaded!");
  };
  script.onerror = () => {
    console.error("Failed to load remote script");
  };

  document.body.appendChild(script);

  window.addEventListener("onPrismLoaded", function (event) {
    event.detail.prism.render({});
  });

  // Clean up the script tag when the component unmounts
  return () => {
    document.body.removeChild(script);
  };
}, []);
```

This code block will inject the script into your document and the `onPrismLoaded` callback will inform you when things are ready. This alows allows you to customize part of the SDK as well. You can find out more [here]()

Note: The SDK is a React app, but since its a pure HTML element and JS script, you can load this directly in a pure HTML page. This is just an example.

#### Creating a Scan

In order to present the SDK modal to begin a scan, you must add an element to your page with the class `prism-button`, which will be used to trigger the scan. It will automatically have a click handler added to it.

---

```html
<button class="prism-button">Start scan</button>
```

### 2. Using npm (Recommended for React/JS Apps)

First, install the package:

```sh
npm install @prismlabs/web-scan-ui-kit
```

Then, in your code:

```typescript
import { PrismScanner } from "@prismlabs/web-scan-ui-kit";

// Create an instance
const scanner = new PrismScanner({
  // ...options
});

// Listen to events
scanner.onPrismLoaded((payload) => {
  console.log("Prism loaded:", payload);
});
scanner.onPrismStateChange((state) => {
  console.log("State: ", state);
});
scanner.onPrismScanComplete((blob) => {
  // Handle the data blob of the video
});

// Present the scan modal (customize options as needed)
scanner.present();
```

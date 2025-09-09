# Prism Web Scan UI Kit

## Documentation

Full documentation for this package can be viewed here: [documentation/](./documentation/)

# Prism Web Scan UI Kit

This package provides all the UI components and logic needed for capturing a scan using the Prism Web Scanning SDK. It is intended to be consumed as a library in your own web application, not run directly.

## Installation

Install the package using npm:

```sh
npm install @prismlabs/web-scan-ui-kit
```

or with yarn:

```sh
yarn add @prismlabs/web-scan-ui-kit
```

> **Note:** This package's primary function is to provide all the UI for capturing a scan. It is not intended to be run directly by end users.

## Translation Override Example

We support overriding custom strings for a specific language. Here is an example of how this can be achived.

```html
window.addEventListener('onPrismLoaded', async function (event) { await
event.detail.prism.render({ localization: { language: 'en', fallbackLanguage:
'en', resources: { en: { translation: { leveling: { title: 'New title
(override)' } } } }, merge: true } }) });
```

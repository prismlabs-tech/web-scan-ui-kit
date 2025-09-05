# Getting Started with Prism Web SDK

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build:dev` or `npm run build:cdn:dev`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Translation Override Example

We support overriding custom strings for a specific language. Here is an example of how this can be achived.

```html
window.addEventListener('onPrismLoaded', async function (event) { await
event.detail.prism.render({ localization: { language: 'en', fallbackLanguage:
'en', resources: { en: { translation: { leveling: { title: 'New title
(override)' } } } }, merge: true } }) });
```

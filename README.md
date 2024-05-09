# ByteSense - Chrome Extension

## Usage

Head over to [ByteSense](https://chromewebstore.google.com/detail/bytesense/fodecdicocihkpcepeegojnmmijnobef) on the chrome web store on any Chromium based browser. Add to chrome.

Provide your preferences in the options page for an optimized experience.

## Development

Go to chrome extensions page at [chrome://extensions/](chrome://extensions/)

Turn on developer mode.

Click 'Load Unpacked' and select the built 'dist' directory of the project.

Enable the extension and head over to Youtube.

### Dependencies

- `nodejs` >= 20.0
- `prettier` >= 3.1
- `tailwindcss` >= 3.4

### Building and Running

```sh
git clone git@github.com:SDGP-CS-81/Chrome-Extension.git
cd Chrome-Extension
npm install
npm run build
```

#### NPM commands

*For hot reload during development, run both `npm run dev` and `npm run tailwind`*
- Live preview of changes -> `npm run dev`
- Live preview styling changes -> `npm run tailwind`
- Run the linter -> `npm run lint`

### Tooling

- Install the ['Extension Reloader'](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) Chrome extension to be able to leverage 'Hot Module Reload' capabilities.
- Install the Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for TailwindCSS autocompletion.


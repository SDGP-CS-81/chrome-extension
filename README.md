# ByteSense - Chrome Extension

## Usage

Go to chrome extensions page at [chrome://extensions/](chrome://extensions/)

Turn on developer mode.

Click 'Load Unpacked' and select the 'src' directory of the project.

Enable the extension and head over to Youtube.

## Development

Please read this [article](https://cbea.ms/git-commit/) to learn how to write good commit messages.

### Dependencies

- `nodejs` >= 20.0
- `prettier` >= 3.1
- `tailwindcss` >= 3.4

### Building and Running

```sh
git clone git@github.com:SDGP-CS-81/Chrome-Extension.git
cd Chrome-Extension
npm install
npm run tailwind
```

#### NPM Commands

- Live preview styling changes -> `npm run tailwind`
- Run the linter -> `npm run lint`

### Tooling

- Install the ['Extension Reloader'](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) Chrome extension to be able to leverage 'Hot Module Reload' capabilities.
- Install the Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for TailwindCSS autocompletion.


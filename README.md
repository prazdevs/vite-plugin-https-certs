<p align="center">
  <img alt="" width="150" src="https://i.imgur.com/nEyndPI.png">
</p>
<p align="center">
  <i>Artwork by <a href="https://playvalorant.com/en-us/agents/killjoy/">Riot Games</a></i>
</p>

<h1 align="center">vite-plugin-https-certs</h1>
<p align="center">Vite plugin to find certficiate/key files and override server.https config before resolution.</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/prazdevs/vite-plugin-https-certs?style=flat&color=orange" />
  <img src="https://img.shields.io/npm/dependency-version/vite-plugin-https-certs/peer/vite?logo=vite" />
  <img src="https://img.shields.io/codeclimate/maintainability/prazdevs/vite-plugin-https-certs?logo=code-climate&style=flat" />
  <img src="https://codecov.io/gh/prazdevs/vite-plugin-https-certs/branch/main/graph/badge.svg?token=AEAOW30X6H&style=flat"/>
  <img src="https://img.shields.io/github/license/prazdevs/vite-plugin-https-certs?style=flat" />
</p>

## ❓ Why would I need this?

This plugin comes in handy when you need your dev server to serve over HTTPS without being annoyed by insecure browser warnings but avoid sharing certificates:
1. Generate a self signed certificate and a matching key for localhost ([example](https://letsencrypt.org/docs/certificates-for-localhost/)).
2. Trust the certificate (`keychain`, `certmgr`...).
3. Drop the certificate in configured project folder (`.certs` by default).
4. Add the plugin to your Vite config.
5. **_Add the folder to your `.gitignore`, the idea is that everyone uses their own certificate._**

> By default, if the plugin is in your Vite config, your server will still be served over HTTPS but without certificates.

## ✨ Features

- Automatically find certificate and key from folder.
- Overrides `server.https` config before resolution.
- Default 'no-config' values.
- Fallback to `true` or `false` (configurable).
- Custom extensions.

## 🚀 Usage

### Default

When no config is passed, the plugin will look in `.certs` folder for:
- a key with `.key` extension.
- a certificate with `.cer` or `.cert` extension.

If one is missing, `server.https` will be set to `true`.

```ts
import { defineConfig } from 'vite'
import HttpsCerts from 'vite-plugin-https-certs'

export default defineConfig({
  plugins: [
    // ....
    HttpsCert(),
    //...
  ]
})
```

### Available options

You can provide options to configure the plugin:
- `path` : overrides the path to the certificate containing folder.
- `certExts` : overrides the accepted certificate file extensions.
- `keyExts` : overrides the accepted key file extensions.
- `defaultIfNoCerts` : overrides the value `server.https` should be set to when no certificate is found.

```ts
import { defineConfig } from 'vite'
import HttpsCerts from 'vite-plugin-https-certs'

export default defineConfig({
  plugins: [
    // ....
    HttpsCert({
      path: '.certs',
      certExts: ['.cert', '.cer'],
      keyExts: ['.key'],
      defaultIfNoCerts; false,
    }),
    //...
  ]
})
```

## 🚧 Caveats

This plugin only overrides the config before its resolution by Vite. Certificate and key validations are still done during the dev server creation. The certificate and key fetching is done by checking the file extensions.

If the given certificate and keys are invalid, the dev server will not start.

>_Certificate validation at config step might come in a future update._

## 🤝 Contributing

Any contribution to the project is welome.  
Run into a problem? Open an [issue](https://github.com/prazdevs/vite-plugin-https-certs/issues/new/choose).  
Want to add some feature? PRs are welcome!

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/prazdevs/vite-plugin-https-certs)

## 👤 About the author

Feel free to contact me:

- <a href="https://twitter.com/prazdevs"><img src="https://img.shields.io/twitter/follow/prazdevs?style=social" /></a>
- <img src="https://img.shields.io/badge/Discord-PraZ%234184-darkgrey?labelColor=7289DA&logo=discord&logoColor=white&style=flat" />

## 📝 Licence

Copyright © 2021 [Sacha Bouillez](https://github.com/prazdevs).<br />
This project is under [MIT](https://github.com/prazdevs/vite-plugin-https-certs/blob/main/LICENCE) license.

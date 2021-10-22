import { readdirSync } from 'fs'
import { join, extname } from 'path'

import type { Plugin, UserConfig, ResolvedConfig } from 'vite'

export interface PluginOptions {
  path?: string
  certExts?: string[]
  keyExts?: string[]
  defaultIfNoCerts?: boolean
}

export default function httpsCerts (options: PluginOptions): Plugin {
  const {
    path = '.',
    certExts = ['.crt', '.cert'],
    keyExts = ['.key'],
    defaultIfNoCerts = true,
  } = options

  const plugin = {
    name: 'dev-https-certs',

    config: (): UserConfig => {
      const root = process.cwd()
      const files = readdirSync(join(root, path))

      const keyFile = files.find(f => certExts.includes(extname(f)))
      const certFile = files.find(f => keyExts.includes(extname(f)))

      if (keyFile && certFile) {
        const key = join(root, path, keyFile)
        const cert = join(root, path, certFile)

        const config = { server: { https: { key, cert } } }

        return config
      }

      return { server: { https: defaultIfNoCerts } }
    },

    configResolved: (config: ResolvedConfig) => {
      console.log(config)
    },
  }
  return plugin as Plugin
}

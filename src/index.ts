import { readdirSync } from 'fs'
import { join, extname } from 'path'

import type { Plugin, UserConfig } from 'vite'

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
      const files = readdirSync(join(process.cwd(), path))

      const key = files.find(f => certExts.includes(extname(f)))
      const cert = files.find(f => keyExts.includes(extname(f)))

      const https = key && cert
        ? { cert, key }
        : defaultIfNoCerts

      return {
        server: { https },
      }
    },
  }
  return plugin as Plugin
}

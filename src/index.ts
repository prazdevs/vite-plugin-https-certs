import { readdirSync, existsSync } from 'fs'
import { join, extname } from 'path'

import type { Plugin, UserConfig } from 'vite'

export interface PluginOptions {
  path?: string
  certExts?: string[]
  keyExts?: string[]
  defaultIfNoCerts?: boolean
}

function httpsCerts (options?: PluginOptions): Plugin {
  const {
    path = '.certs',
    certExts = ['.crt', '.cert'],
    keyExts = ['.key'],
    defaultIfNoCerts = true,
  } = options ?? {}

  const plugin = {
    name: 'dev-https-certs',

    config: (): UserConfig => {
      const certs = join(process.cwd(), path)
      const files = existsSync(certs) ? readdirSync(certs) : []

      const keyFile = files.find(f => keyExts.includes(extname(f)))
      const certFile = files.find(f => certExts.includes(extname(f)))

      if (keyFile && certFile) {
        const key = join(path, keyFile)
        const cert = join(path, certFile)

        return { server: { https: { key, cert } } }
      }

      return { server: { https: defaultIfNoCerts } }
    },
  }
  return plugin as Plugin
}

export default httpsCerts

import { readdirSync, readFileSync } from 'fs'
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
      const root = process.cwd()
      console.log(`Reading folder ${join(root, path)}`)
      const files = readdirSync(join(root, path))
      console.log(`Found files ${files}`)

      const keyFile = files.find(f => certExts.includes(extname(f)))
      const certFile = files.find(f => keyExts.includes(extname(f)))
      console.log(`Found key '${keyFile}' and cert '${certFile}'`)

      if (keyFile && certFile) {
        // eslint-disable-next-line max-len
        console.log(`Will load '${join(root, path, keyFile)}' and '${join(root, path, keyFile)}'`)
        const key = readFileSync(join(root, path, keyFile))
        const cert = readFileSync(join(root, path, certFile))

        return { server: { https: { key, cert } } }
      }

      return { server: { https: defaultIfNoCerts } }
    },
  }
  return plugin as Plugin
}

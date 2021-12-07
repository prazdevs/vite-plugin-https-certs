import { readdirSync, existsSync } from 'fs'
import { join, extname } from 'path'

import type { Plugin, UserConfig } from 'vite'

export interface HttpCertsOptions {
  /**
   * Certificates folder path.
   * @default .certs
   */
  path?: string

  /**
   * Certificate file extensions (overrides default values when provided).
   * @default ['.crt','.cert']
   */
  certExts?: string[]

  /**
   * Key file extensions (overrides default values when provided).
   * @default ['.key']
   */
  keyExts?: string[]

  /**
   * Whether or not https should be enabled when certificates are not resolved.
   * @default true
   */
  defaultIfNoCerts?: boolean

  /**
   * Whether or not https should be enabled for Vite preview
   * @default false
   */
  preview?: boolean
}

/**
 * Vite plugin to set up https on dev server with certificates from a folder.
 * @param options
 * @returns {Plugin}
 */
export default function (options?: HttpCertsOptions): Plugin {
  const {
    path = '.certs',
    certExts = ['.crt', '.cert'],
    keyExts = ['.key'],
    defaultIfNoCerts = true,
    preview = false,
  } = options ?? {}

  const plugin = {
    name: 'dev-https-certs',

    config: (): UserConfig => {
      const certs = join(process.cwd(), path)
      const files = existsSync(certs) ? readdirSync(certs) : []

      const keyFile = files.find(f => keyExts.includes(extname(f)))
      const certFile = files.find(f => certExts.includes(extname(f)))

      const server = (keyFile && certFile)
        ? {
          https: {
            key: join(path, keyFile),
            cert: join(path, certFile),
          },
        }
        : { https: defaultIfNoCerts }

      return preview
        ? { server, preview: server }
        : { server }
    },
  }
  return plugin as Plugin
}

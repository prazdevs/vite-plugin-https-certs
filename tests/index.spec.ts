import fs from 'fs'
import { join } from 'path'
import { UserConfig } from 'vite'

import HttpsCerts from '../src/index'

jest.mock('fs')

describe('HttpsCertsPlugin', () => {
  const root = process.cwd()

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  describe('no config provided', () => {
    it('should default when no .certs folder', () => {
      //* arrange
      fs.existsSync = jest.fn(() => false)
      fs.readdirSync = jest.fn()

      //* act
      const httpsCertPlugin = HttpsCerts()
      const resolvedConfig = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolvedConfig.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).not.toHaveBeenCalled()
      expect(resolvedHttps).toEqual(true)
    })

    it('should default when no files in .certs folder', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts()
      const resolvedConfig = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolvedConfig.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual(true)
    })

    it('should set cert and key when files in .certs', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn().mockReturnValue(['lorem.cert', 'ipsum.key'])

      //* act
      const httpsCertPlugin = HttpsCerts()
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual({
        cert: join('.certs', 'lorem.cert'),
        key: join('.certs', 'ipsum.key'),
      })
    })
  })

  describe('path option provided', () => {
    it('should default when no {path} folder', () => {
      //* arrange
      fs.existsSync = jest.fn(() => false)
      fs.readdirSync = jest.fn()

      //* act
      const httpsCertPlugin = HttpsCerts({ path: 'mock' })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(fs.readdirSync).not.toHaveBeenCalled()
      expect(resolvedHttps).toEqual(true)
    })

    it('should default when no files in {path} folder', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts({ path: 'mock' })
      const resolvedConfig = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolvedConfig.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(resolvedHttps).toEqual(true)
    })

    it('should set cert and key when files in {path}', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn().mockReturnValue(['lorem.cert', 'ipsum.key'])

      //* act
      const httpsCertPlugin = HttpsCerts({ path: 'mock' })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(resolvedHttps).toEqual({
        cert: join('mock', 'lorem.cert'),
        key: join('mock', 'ipsum.key'),
      })
    })
  })

  describe('keyExts option provided', () => {
    it('should default when no files with {keyExts} in .certs', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn().mockReturnValue(['lorem.cert', 'ipsum.key'])

      //* act
      const httpsCertPlugin = HttpsCerts({ keyExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual(true)
    })

    it('should set cert and key when files with {keyExts} in .certs', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn().mockReturnValue(['lorem.cert', 'ipsum.mock'])

      //* act
      const httpsCertPlugin = HttpsCerts({ keyExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual({
        cert: join('.certs', 'lorem.cert'),
        key: join('.certs', 'ipsum.mock'),
      })
    })
  })

  describe('certExts option provided', () => {
    it('should default when no files with {certExts} in .certs', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn().mockReturnValue(['lorem.cert', 'ipsum.key'])

      //* act
      const httpsCertPlugin = HttpsCerts({ certExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual(true)
    })

    it('should set cert and key when files with {certExts} in .certs', () => {
      //* arrange
      fs.existsSync = jest.fn(() => true)
      fs.readdirSync = jest.fn().mockReturnValue(['lorem.mock', 'ipsum.key'])

      //* act
      const httpsCertPlugin = HttpsCerts({ certExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual({
        cert: join('.certs', 'lorem.mock'),
        key: join('.certs', 'ipsum.key'),
      })
    })
  })

  describe('defaultIfNoCerts option provided', () => {
    it('should default to false when set and no certs', () => {
      //* arrange
      fs.existsSync = jest.fn(() => false)
      fs.readdirSync = jest.fn()

      //* act
      const httpsCertPlugin = HttpsCerts({ defaultIfNoCerts: false })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(fs.existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(fs.readdirSync).not.toHaveBeenCalled()
      expect(resolvedHttps).toEqual(false)
    })
  })
})

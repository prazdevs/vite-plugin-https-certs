import { Dirent, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { UserConfig } from 'vite'
import { vi, describe, it, beforeEach, expect } from 'vitest'

import HttpsCerts from '../src/index'

vi.mock('fs')

describe('HttpsCertsPlugin', () => {
  const root = process.cwd()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('no config provided', () => {
    it('defaults when no .certs folder', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => false)
      vi.mocked(readdirSync).mockImplementation(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts()
      const resolvedConfig = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolvedConfig.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).not.toHaveBeenCalled()
      expect(resolvedHttps).toEqual(true)
    })

    it('defaults when no files in .certs folder', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts()
      const resolvedConfig = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolvedConfig.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual(true)
    })

    it('sets cert and key when files in .certs', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [
        'lorem.cert' as unknown as Dirent,
        'ipsum.key' as unknown as Dirent,
      ])

      //* act
      const httpsCertPlugin = HttpsCerts()
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual({
        cert: join('.certs', 'lorem.cert'),
        key: join('.certs', 'ipsum.key'),
      })
    })
  })

  describe('path option provided', () => {
    it('defaults when no {path} folder', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => false)
      vi.mocked(readdirSync).mockImplementation(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts({ path: 'mock' })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(readdirSync).not.toHaveBeenCalled()
      expect(resolvedHttps).toEqual(true)
    })

    it('defaults when no files in {path} folder', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts({ path: 'mock' })
      const resolvedConfig = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolvedConfig.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(resolvedHttps).toEqual(true)
    })

    it('sets cert and key when files in {path}', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [
        'lorem.cert' as unknown as Dirent,
        'ipsum.key' as unknown as Dirent,
      ])

      //* act
      const httpsCertPlugin = HttpsCerts({ path: 'mock' })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, 'mock'))
      expect(resolvedHttps).toEqual({
        cert: join('mock', 'lorem.cert'),
        key: join('mock', 'ipsum.key'),
      })
    })
  })

  describe('keyExts option provided', () => {
    it('defaults when no files with {keyExts} in .certs', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [
        'lorem.cert' as unknown as Dirent,
        'ipsum.key' as unknown as Dirent,
      ])

      //* act
      const httpsCertPlugin = HttpsCerts({ keyExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual(true)
    })

    it('sets cert and key when files with {keyExts} in .certs', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [
        'lorem.cert' as unknown as Dirent,
        'ipsum.mock' as unknown as Dirent,
      ])

      //* act
      const httpsCertPlugin = HttpsCerts({ keyExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual({
        cert: join('.certs', 'lorem.cert'),
        key: join('.certs', 'ipsum.mock'),
      })
    })
  })

  describe('certExts option provided', () => {
    it('defaults when no files with {certExts} in .certs', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [
        'lorem.cert' as unknown as Dirent,
        'ipsum.key' as unknown as Dirent,
      ])

      //* act
      const httpsCertPlugin = HttpsCerts({ certExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual(true)
    })

    it('sets cert and key when files with {certExts} in .certs', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => true)
      vi.mocked(readdirSync).mockImplementation(() => [
        'lorem.mock' as unknown as Dirent,
        'ipsum.key' as unknown as Dirent,
      ])

      //* act
      const httpsCertPlugin = HttpsCerts({ certExts: ['.mock'] })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(resolvedHttps).toEqual({
        cert: join('.certs', 'lorem.mock'),
        key: join('.certs', 'ipsum.key'),
      })
    })
  })

  describe('defaultIfNoCerts option provided', () => {
    it('defaults to false when set and no certs', () => {
      //* arrange
      vi.mocked(existsSync).mockImplementation(() => false)
      vi.mocked(readdirSync).mockImplementation(() => [])

      //* act
      const httpsCertPlugin = HttpsCerts({ defaultIfNoCerts: false })
      const resolved = (httpsCertPlugin.config as () => UserConfig)()
      const resolvedHttps = resolved.server?.https

      //* assert
      expect(existsSync).toHaveBeenNthCalledWith(1, join(root, '.certs'))
      expect(readdirSync).not.toHaveBeenCalled()
      expect(resolvedHttps).toEqual(false)
    })
  })
})

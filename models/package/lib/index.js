'use strict'
const path = require('path')
const pathExists = require('path-exists')
const npminstall = require('npminstall')
const fse = require('fs-extra')
const pkgDir = require('pkg-dir').sync
const formatPath = require('@jeff9511-cli/format-path')
const log = require('@jeff9511-cli/log')
const {
  getNpmLatestVersion,
  getDefaultRegistry
} = require('@jeff9511-cli/get-npm-info')

const { isObject } = require('@jeff9511-cli/utils')

class Package {
  constructor(options) {
    if (!options) throw new Error('Package 类初始化参数不能为空')

    if (!isObject(options)) throw new Error('Package 类初始化参数必须是对象')

    const { targetPath, storeDir, packageName, packageVersion } = options
    // package 目标路径
    this.targetPath = targetPath
    // 缓存 package 路径
    this.storeDir = storeDir
    // package name
    this.packageName = packageName
    // package version
    this.packageVersion = packageVersion
    // package 缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_')
  }

  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    )
  }

  getSpecificCacheFilePath(version) {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${version}@${this.packageName}`
    )
  }

  async prepare() {
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirSync(this.storeDir)
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName)
    }
  }

  // 判断当前 Package 是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare()
      return pathExists(this.cacheFilePath)
    } else {
      return pathExists(this.targetPath)
    }
  }
  // 安装 Package
  async install() {
    await this.prepare()
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{ name: this.packageName, version: this.packageVersion }]
    })
  }
  // 更新 Package
  async update() {
    await this.prepare()
    // 获取最新 npm 模块版本号
    const latestVersion = await getNpmLatestVersion(this.packageName)
    // 查询最新版本号对应的文件路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestVersion)
    // 如果不存在则直接安装最新版本
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [{ name: this.packageName, version: latestVersion }]
      })

      this.packageVersion = latestVersion
    } else {
      log.info(`${this.packageName} 已经是最新版本: ${latestVersion}`)
    }
  }
  // 获取入口文件的路径
  getRootFilePath() {
    let targetPath = ''
    if(this.targetPath) {
      targetPath = this.targetPath
    } else {
      targetPath = this.cacheFilePath
    }
    // 1. 获取 package.json 所在目录 - pkg-dir
    const dir = pkgDir(targetPath)
    if (dir) {
      // 2. 读取 package.json
      const pkgFile = require(path.resolve(dir, 'package.json'))
      // 3. main/bin - path
      if (pkgFile && pkgFile.main) {
        // 4. 路径的兼容（macOS/windows）
        return formatPath(path.resolve(dir, pkgFile.main))
      }
    }
    return null
  }
}

module.exports = Package

'use strict'
const path = require('path')
const npminstall = require('npminstall')
const pkgDir = require('pkg-dir').sync
const formatPath = require('@jeff9511-cli/format-path')
const { getDefaultRegistry } = require('@jeff9511-cli/get-npm-info')

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
  }
  // 判断当前 Package 是否存在
  exists() {}
  // 安装 Package
  install() {
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{ name: this.packageName, version: this.packageVersion }]
    })
  }
  // 更新 Package
  update() {}
  // 获取入口文件的路径
  getRootFilePath() {
    // 1. 获取 package.json 所在目录 - pkg-dir
    const dir = pkgDir(this.targetPath)
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

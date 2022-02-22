'use strict'

const { isObject } = require('@jeff9511-cli/utils')

class Package {
  constructor(options) {
    if (!options) throw new Error('Package 类初始化参数不能为空')

    if (!isObject(options)) throw new Error('Package 类初始化参数必须是对象')

    const { targetPath, storePath, packageName, packageVersion } = options
    // package 路径
    this.targetPath = targetPath
    // package 存储路径
    this.storePath = storePath
    // package name
    this.packageName = packageName
    // package version
    this.packageVersion = packageVersion
  }
  // 判断当前 Package 是否存在
  exists() {}
  // 安装 Package
  install() {}
  // 更新 Package
  update() {}
  // 获取入口文件的路径
  getRootFilePath() {}
}

module.exports = Package

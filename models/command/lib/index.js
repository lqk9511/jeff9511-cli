'use strict'

const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')

class Command {
  constructor(args) {
    this._args = args
    this.runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain.then(() => {
        this.checkNodeVersion()
      })
    })
  }
  
  checkNodeVersion() {
    // 获取当前 node 版本号
    const currentVersion = process.version

    // 比对最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION

    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(
        colors.red(`jeff-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
      )
    }
  }
  init() {
    throw new Error('init 必须实现')
  }
  exec() {
    throw new Error('exec 必须实现')
  }
}

module.exports = Command

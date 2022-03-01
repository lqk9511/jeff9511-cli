'use strict'

const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const log = require('@jeff9511-cli/log')

class Command {
  constructor(args) {
    if (!args) {
      throw new Error('参数不能为空！')
    }
    if (!Array.isArray(args)) {
      throw new Error('参数必须是数组！')
    }
    if (!args.length) {
      throw new Error('参数列表为空！')
    }
    this._args = args
    this.runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => this.checkNodeVersion())
      chain = chain.then(() => this.initArgs())
      chain = chain.then(() => this.init())
      chain = chain.then(() => this.exec())

      chain = chain.catch((err) => log.error(err))
    })
  }

  initArgs() {
    this._cmd = this._args[this._args.length - 1]
    this._args = this._args.slice(0, this._args.length - 1)
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

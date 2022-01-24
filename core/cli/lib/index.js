'use strict'

module.exports = core

const log = require('@jeff9511-cli/log')
const pkg = require('../package.json')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
  } catch (error) {
    log.error(error.message)
  }
}

function checkUserHome() {
    if(!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}

function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck();
}

function checkNodeVersion() {
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

function checkPkgVersion() {
  log.notice('cli', pkg.version)
}

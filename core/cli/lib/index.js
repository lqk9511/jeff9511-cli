'use strict'

module.exports = core

const log = require('@jeff9511-cli/log')
const pkg = require('../package.json')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
  } catch (error) {
    log.error(error.message)
  }
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
  console.log(pkg.version)
  log.notice('cli', pkg.version)
}

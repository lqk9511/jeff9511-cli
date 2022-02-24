'use strict'
const Package = require('@jeff9511-cli/package')
const path = require('path')

const SETTINGS = {
  init: '@jeff9511-cli/init'
}

const CACHE_DIR = 'dependencies/'

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH,
    storeDir = '',
    pkg
  const homePath = process.env.CLI_HOME_PATH
  const command = arguments[arguments.length - 1]
  const cmdName = command.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = 'latest'

  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR) // 生成缓存路径
    storeDir = path.resolve(targetPath, 'node_modules')
    pkg = new Package({ targetPath, storeDir, packageName, packageVersion })
    if (pkg.exists()) {
      // 更新 package
    } else {
      // 安装 package
      await pkg.install()
    }
  } else {
    pkg = new Package({ targetPath, packageName, packageVersion })
  }

  const rootFile = pkg.getRootFilePath()
  if (rootFile) {
    require(rootFile).apply(null, arguments)
  }

  // 1. targetPath -> modulePath
  // 2. modulePath -> Package(npm 模块)
  // 3. Package.getRootFile(获取入口文件)
  // 封装 -> 复用
  // 4. Package.update / Package.install
}

module.exports = exec

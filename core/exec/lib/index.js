'use strict'
const Package = require('@jeff9511-cli/package')

const SETTINGS = {
  init: '@jeff9511-cli/init'
}

function exec() {
  const targetPath = process.env.CLI_TARGET_PATH

  const command = arguments[arguments.length - 1]
  const cmdName = command.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = 'latest'
  // 生成缓存路径
  if (!targetPath) {
    targetPath = ''
  }
  const pkg = new Package({ targetPath, packageName, packageVersion })
  console.log("🚀 ~ file: index.js ~ line 21 ~ exec ~ pkg.getRootFilePath()", pkg.getRootFilePath())
  // 1. targetPath -> modulePath
  // 2. modulePath -> Package(npm 模块)
  // 3. Package.getRootFile(获取入口文件)
  // 封装 -> 复用
  // 4. Package.update / Package.install
}

module.exports = exec

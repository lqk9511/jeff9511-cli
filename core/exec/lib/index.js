'use strict'
const Package = require('@jeff9511-cli/package')
const path = require('path')
const log = require('@jeff9511-cli/log')
const cp = require('child_process')

const SETTINGS = {
  init: '@jeff9511-cli/utils'
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
    if (await pkg.exists()) {
      // 更新 package
      pkg.update()
    } else {
      // 安装 package
      await pkg.install()
    }
  } else {
    pkg = new Package({ targetPath, packageName, packageVersion })
  }

  const rootFile = pkg.getRootFilePath()
  if (rootFile) {
    try {
      // 在当前进程中调用
      // require(rootFile).call(null, Array.from(arguments))
      // 在 node 子进程中调用
      const args = Array.from(arguments)
      const cmd = args[args.length - 1]
      const o = Object.create(null)
      Object.keys(cmd).forEach((key) => {
        if (
          cmd.hasOwnProperty(key) &&
          key !== 'parent' &&
          !key.startsWith('_')
        ) {
          o[key] = cmd[key]
        }
      })
      o.opts = cmd.opts()
      args[args.length - 1] = o
      const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit'
      })
      child.on('error', (error) => {
        log.error(error)
        process.exit(1)
      })

      child.on('exit', (e) => {
        log.verbose(`程序执行成功：${e}`)
        process.exit(0)
      })
    } catch (error) {
      log.error(error)
    }
  }

  // 1. targetPath -> modulePath
  // 2. modulePath -> Package(npm 模块)
  // 3. Package.getRootFile(获取入口文件)
  // 封装 -> 复用
  // 4. Package.update / Package.install
}

function spawn(command, args, options) {
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args
  return cp.spawn(cmd, cmdArgs, options || {})
}

module.exports = exec

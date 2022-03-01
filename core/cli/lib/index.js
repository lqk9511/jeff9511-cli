'use strict'

module.exports = core

const path = require('path')
const log = require('@jeff9511-cli/log')
const pkg = require('../package.json')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const commander = require('commander')
const init = require('@jeff9511-cli/init')
const exec = require('@jeff9511-cli/exec')

// 实例化一个脚手架对象
const program = new commander.Command()

async function core() {
  try {
    await prepare()
    registerCommand()
    log.verbose(JSON.stringify(process.env, null, 2))
  } catch (error) {
    log.error(error.message)
  }
}

function registerCommand() {
  // 注册
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d --debug', '是否开启调试模式', false)
    .option('-tp --targetPath <targetPath>', '是否制定本地调试文件路径', '')

  // 注册命令
  program
    .command('init [projectName]')
    .option('-f --force', '是否强制初始化项目')
    .action(exec)

  // debug 模式
  program.on('option:debug', function () {
    const { debug } = program.opts()
    if (debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }

    log.level = process.env.LOG_LEVEL
  })

  // 指定 targetPath
  program.on('option:targetPath', function () {
    const { targetPath } = program.opts()
    process.env.CLI_TARGET_PATH = targetPath
  })

  // 未知命令监听
  program.on('command:*', function (input) {
    const availableCommands = program.commands.map((cmd) => cmd.name())
    log.error(`未知的命令：${input}`)
    if (availableCommands.length) {
      log.success(`可用的命令：${availableCommands}`)
    }
  })

  // 解析参数
  program.parse(process.argv)

  // 空命令参数提示
  if (program.args && program.args.length < 1) {
    program.outputHelp()
  }
}

async function prepare() {
  checkPkgVersion()
  checkRoot()
  checkUserHome()
  checkEnv()
  await checkGlobalUpdate()
}

async function checkGlobalUpdate() {
  // 1. 获取当前版本号和模块名
  const currentVersion = pkg.version
  const npmName = pkg.name

  // 2. 利用 npm 提供的api 获取所有线上的版本
  const { getNpmLatestVersions } = require('@jeff9511-cli/get-npm-info')

  // 3. 提取所有版本号，比对哪些版本号是大于当前版本号
  const latestVersion = await getNpmLatestVersions(currentVersion, npmName)

  // 4. 获取最新版本号，提示用户更新到最新版
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    log.warn(
      colors.yellow(`请手动更新${npmName}
              当前版本：${currentVersion}
              最新版本：${latestVersion}
              更新命令：npm install -g ${npmName}`)
    )
  }
}

function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    })
  }
  createDefaultConfig()
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig.cliHome = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在'))
  }
}

function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck()
}

function checkPkgVersion() {
  log.notice('cli', pkg.version)
}

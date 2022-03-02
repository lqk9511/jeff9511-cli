'use strict'

const Command = require('@jeff9511-cli/command')
const log = require('@jeff9511-cli/log')

class InitCommand extends Command {
  init() {
    this.projectName = this._args[0] || ''
    log.verbose("🚀 ~ file: index.js ~ line 8 ~ InitCommand ~ init ~ this.projectName", this.projectName)
    if(typeof this._cmd.opts === 'function') {
      this.force = this._cmd.opts().force
    }else {
      this.force = this._cmd.opts.force
    }
    log.verbose("🚀 ~ file: index.js ~ line 10 ~ InitCommand ~ init ~ this.force", this.force)
  }

  exec() {
    log.info('exec coding')
  }
}

function init(args) {
  return new InitCommand(args)
}


module.exports = init
module.exports.InitCommand = InitCommand


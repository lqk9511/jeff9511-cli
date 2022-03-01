'use strict'

const Command = require('@jeff9511-cli/command')

class InitCommand extends Command {

}

function init(args) {
  return new InitCommand(args)
}


module.exports = init
module.exports.InitCommand = InitCommand


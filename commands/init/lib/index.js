'use strict'

module.exports = init

function init(projectName, options, command) {
  console.log('🚀 ~ file: index.js ~ line 6 ~ init ~ projectName', projectName)
  console.log('🚀 ~ file: index.js ~ line 6 ~ init ~ options', options)
  console.log('🚀 ~ file: index.js ~ line 6 ~ init ~ command', command.optsWithGlobals())
}

'use strict'

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null
  }

  const _registry = registry || getDefaultRegistry(true)
  const npmInfoUrl = urlJoin(_registry, npmName)
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data
      }
      return null
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? 'https://registry.npmjs.org'
    : 'https://registry.npm.taobao.org'
}

module.exports = {
  getNpmInfo
}

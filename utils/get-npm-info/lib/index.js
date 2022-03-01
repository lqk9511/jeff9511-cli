'use strict'

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null
  }

  const _registry = registry || getDefaultRegistry()
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

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry)
  if (data) {
    return Object.keys(data.versions)
  }
  return []
}

function getSemverVersion(baseVersion, versions = []) {
  return versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(a, b))
}

async function getNpmLatestVersions(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry)
  const latestVersions = getSemverVersion(baseVersion, versions)
  if (latestVersions.length) {
    return latestVersions[0]
  }
  return latestVersions
}

async function getNpmLatestVersion(npmName, registry) {
  let versions = await getNpmVersions(npmName, registry)
  if (versions.length) {
    return versions.sort((a, b) => semver.gt(a, b))[0]
  }
  return null
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getSemverVersion,
  getDefaultRegistry,
  getNpmLatestVersion,
  getNpmLatestVersions
}

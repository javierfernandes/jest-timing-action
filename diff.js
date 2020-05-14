const makeDiff = (octokit, pullRequest) => {
  return JSON.stringify(pullRequest, null, 2)
}

module.exports = makeDiff
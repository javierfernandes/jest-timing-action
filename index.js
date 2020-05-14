const core = require('@actions/core')
const github = require('@actions/github')
const makeDiff = require('./diff')

const withErrorHandler = fn => async () => {
  try {
    return await fn()
  } catch (error) {
    core.setFailed(error.message)
  }
}

const run = withErrorHandler(async () => {
  const githubToken = core.getInput('GITHUB_TOKEN')

  const { context } = github
  if (context.payload.pull_request == null) {
    core.setFailed('No pull request found.')
  }

  const pullRequestNumber = context.payload.pull_request.number
  const octokit = new github.GitHub(githubToken)

  const message = await makeDiff(octokit, context, context.payload.pull_request)

  octokit.issues.createComment({
    ...context.repo,
    issue_number: pullRequestNumber,
    body: message,
  })
})


run()

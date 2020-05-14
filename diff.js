const { propEq, pick } = require('ramda')

const makeDiff = async (octokit, context, pullRequest) => {
  const base = pullRequest.base.ref

  const files = await octokit.pulls.listFiles({
    ...context.repo,
    pull_number: pullRequest.number,
  })

  const modified = files.data
    .filter(propEq('status', 'modified'))
    .map(pick(['filename', 'sha']))
  
  return `
    want to merge to: ${base}

    changed files:
    ${jsonSnippet(modified)}
  `

  // return JSON.stringify(pullRequest, null, 2)
}

const jsonSnippet = obj => `
\`\`\`json
${JSON.stringify(obj, null, 2)}
\`\`\`
`

module.exports = makeDiff
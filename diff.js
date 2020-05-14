
const makeDiff = async (octokit, context, pullRequest) => {
  const base = pullRequest.base.ref

  const files = await octokit.pulls.listFiles({
    ...context.repo,
    pull_number: pullRequest.number,
  })
  
  return `
    want to merge to: ${base}

    changed files:
    ${jsonSnippet(files)}
  `

  // return JSON.stringify(pullRequest, null, 2)
}

const jsonSnippet = obj => `
\`\`\`json
${JSON.stringify(obj, null, 2)}
\`\`\`
`

module.exports = makeDiff
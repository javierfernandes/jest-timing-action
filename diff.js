const makeDiff = async (octokit, context, pullRequest) => {
  const base = pullRequest.base.ref

  const files = await octokit.pullls.listFiles({
    ...context.repo,
    pull_number: pullRequest.number,
  })
  
  return `
    want to merge to: ${base}

    changed files:
    \`\`\`
      ${files}
    \`\`\`
  `

  // return JSON.stringify(pullRequest, null, 2)
}

module.exports = makeDiff
const { propEq, pick, allPass, propSatisfies, test } = require('ramda')

const makeDiff = async (octokit, context, pullRequest) => {
  const base = pullRequest.base.ref

  const files = await octokit.pulls.listFiles({
    ...context.repo,
    pull_number: pullRequest.number,
  })

  const modifiedSnapshots = await Promise.all(files.data
    .filter(isModifiedSnapshot)
    .map(pick(['filename', 'sha']))
    .map(fetchFile(octokit, context))
  )
  
  return `
    want to merge to: ${base}

    modified snapshots:
    ${modifiedSnapshots.map(({ path, content }) => `
      path: ${path}
      content
      ${jsonSnippet(content)}
    `)}

  `

  // return JSON.stringify(pullRequest, null, 2)
}

const isModifiedSnapshot = allPass([
  propEq('status', 'modified'),
  propSatisfies(test(/__tsnapshots__\/.*\.tsnapshot/), 'filename')
])

const fetchFile = (octokit, context) => async  ({ filename }) => {
  const result = await octokit.repos.getContents({
    ...context.repo,
    path: filename,
  })

  return {
    path: filename,
    content: Buffer.from(result.data.content, 'base64').toString()
  }
}

const jsonSnippet = obj => `
\`\`\`json
${JSON.stringify(obj, null, 2)}
\`\`\`
`

module.exports = makeDiff
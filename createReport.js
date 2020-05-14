const { concat, assoc, groupBy, prop, mapObjIndexed, pipe, reduce, map } = require('ramda')

const createReport = files => 
`
# Test execution times differences:

  ${files.map(fileReport)}
`

const fileReport = ({ base, branch }) =>
`
File: \`${pathFromOne(base, branch)}\`

| test | previous time | current time |
| ---- |          ---: |         ---: |
${
  makeDiff(base.tests, branch.tests)
  .map(({ test, base, branch }) => `| ${test} | ${base} | ${branch} |`)
}
`

const pathFromOne = (base, branch) => (base || branch).path

const mergeTestValues = reduce((acc, { from, duration }) => ({ ...acc, [from]: duration }), {})

const makeDiff = (baseTests, branchTests) => pipe(
  concat(
    baseTests.map(assoc('from', 'base')),
  ),
  groupBy(prop('fullName')),
  mapObjIndexed(mergeTestValues),
  Object.entries,
  map(([test, value]) => ({ test, ...value }))
)(branchTests.map(assoc('from', 'branch')))

// const jsonSnippet = obj => `
// \`\`\`json
// ${JSON.stringify(obj, null, 2)}
// \`\`\`
// `

module.exports = createReport

module.exports.fileReport = fileReport
module.exports.makeDiff = makeDiff
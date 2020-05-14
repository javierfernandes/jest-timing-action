const { concat, assoc, groupBy, prop, mapObjIndexed, pipe, reduce, map, subtract } = require('ramda')

const createReport = files => 
`
# Test execution times differences:

  ${files.map(fileReport)}
`

const fileReport = ({ base, branch }) =>
`
File: \`${pathFromOne(base, branch)}\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
${
  makeDiff(base.tests, branch.tests)
  .map(({ test, base, branch }) => `| ${test} | ${base || '-'} | ${branch || '-'} | ${calc(branch, base, subtract)} | ${calc(branch, base, deltaPercentage)} |`)
  .join('\n')
}
`

const calc = (a, b, fn) => (a && b) ? fn(a, b) : '-'
const deltaPercentage = (branch, base) => (((branch - base) / base) * 100).toFixed(2) + `%`

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



module.exports = createReport
module.exports.fileReport = fileReport
module.exports.makeDiff = makeDiff
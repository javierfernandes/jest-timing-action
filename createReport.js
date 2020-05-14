const { concat, assoc, groupBy, prop, mapObjIndexed, pipe, reduce, map, subtract } = require('ramda')

const createReport = files => 
`
# Test execution times differences

  ${files.map(fileReport)}
`

const fileReport = ({ base, branch }) =>
`
File: \`${pathFromOne(base, branch)}\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
${
  makeDiff(base.tests, branch.tests)
  .map(({ test, base, branch, delta, deltaPercentage }) => `| ${test} | ${value(base)} | ${value(branch)} | ${value(delta)} | ${deltaPercentage !== undefined ? deltaPercentage.toFixed(2) + '%' : '-'} |`)
  .join('\n')
}
`

const value = a => a !== undefined ? a : '-'
const pathFromOne = (base, branch) => (base || branch).path

const mergeTestValues = reduce((acc, { from, duration }) => ({ ...acc, [from]: duration }), {})

const calc = (a, b, fn) => (a && b) ? fn(a, b) : undefined
const deltaPercentage = (branch, base) => parseFloat((((branch - base) / base) * 100).toFixed(2))
const calculateDeltas = item => ({
  ...item,
  delta: calc(item.branch, item.base, subtract),
  deltaPercentage: calc(item.branch, item.base, deltaPercentage)
})

const makeDiff = (baseTests, branchTests) => pipe(
  concat(
    baseTests.map(assoc('from', 'base')),
  ),
  groupBy(prop('fullName')),
  mapObjIndexed(mergeTestValues),
  Object.entries,
  map(([test, value]) => ({ test, ...value })),
  map(calculateDeltas)
)(branchTests.map(assoc('from', 'branch')))



module.exports = createReport
module.exports.fileReport = fileReport
module.exports.makeDiff = makeDiff
const { tap, isEmpty, reject, concat, assoc, groupBy, prop, mapObjIndexed, pipe, reduce, map, subtract, gte, identity, flip, filter, propSatisfies } = require('ramda')

const fileDiff = threshold => ({ base, branch }) => ({
  path: pathFromOne(base, branch),
  tests: filterByThreshold(threshold)(
    makeDiff(base.tests, branch.tests)
  )
})


const pathFromOne = (base, branch) => (base || branch).path

const makeDiff = (baseTests, branchTests) => pipe(
  concat(baseTests.map(assoc('from', 'base'))),
  groupBy(prop('fullName')),
  mapObjIndexed(mergeTestValues),
  Object.entries,
  map(([test, value]) => ({ test, ...value })),
  map(calculateDeltas),
)(branchTests.map(assoc('from', 'branch')))


const mergeTestValues = reduce((acc, { from, duration }) => ({ ...acc, [from]: duration }), {})

const calculateDeltas = item => ({
  ...item,
  delta: calc(item.branch, item.base, subtract),
  deltaPercentage: calc(item.branch, item.base, deltaPercentage)
})

const calc = (a, b, fn) => (a !== undefined && b !== undefined) ? fn(a, b) : undefined
const deltaPercentage = (branch, base) => parseFloat((((branch - base) / base) * 100).toFixed(2))

const passesThreshold = threshold => ({ deltaPercentage }) => (
  deltaPercentage !== undefined && Math.abs(deltaPercentage) >= parseFloat(threshold)
)

const filterByThreshold = threshold => threshold ? filter(passesThreshold(threshold)) : identity

const computeDifferences = threshold => pipe(
  map(fileDiff(threshold)),
  reject(propSatisfies(isEmpty, 'tests'))
)

module.exports = computeDifferences
module.exports.makeDiff = makeDiff
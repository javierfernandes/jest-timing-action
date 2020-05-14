const computeDifferences = require('./computeDifferences')
const { makeDiff } = computeDifferences

const baseTests = [
  {
    fullName: 'testA',
    duration: 1244
  },
  {
    fullName: 'testB',
    duration: 10
  },
  {
    fullName: 'testC', // only here
    duration: 20
  }
]
const branchTests = [
  {
    fullName: 'testA', // stood the same
    duration: 1244
  },
  {
    fullName: 'testB', // incremented
    duration: 20
  },
  // C is no longer here
  {
    fullName: 'testD', // new one
    duration: 40
  }
]

test('makeDiff', () => {
  expect(makeDiff(baseTests, branchTests)).toEqual([
    { test: 'testA', base: 1244, branch: 1244, delta: 0, deltaPercentage: 0.00 },
    { test: 'testB', base: 10, branch: 20, delta: 10, deltaPercentage: 100.00 },
    { test: 'testC', base: 20 },
    { test: 'testD', branch: 40 },
  ])
})

const base = {
  path: 'blah.spec.js',
  tests: baseTests,
}
const branch = {
  path: 'blah.spec.js',
  tests: branchTests,
}

test('fileDiff with threshold >= 25', () => {
  expect(computeDifferences('25')([
    { base, branch }
  ])).toEqual([
    {
      path: 'blah.spec.js',
      tests: [
        { test: 'testB', base: 10, branch: 20, delta: 10, deltaPercentage: 100.00 },
      ]
    }
  ])
})

test('fileDiff without threshold', () => {
  expect(computeDifferences()([
    { base, branch }
  ])).toEqual([
    {
      path: 'blah.spec.js',
      tests: [
        { test: 'testA', base: 1244, branch: 1244, delta: 0, deltaPercentage: 0.00 },
        { test: 'testB', base: 10, branch: 20, delta: 10, deltaPercentage: 100.00 },
        { test: 'testC', base: 20 },
        { test: 'testD', branch: 40 },
      ]
    }
  ])
})
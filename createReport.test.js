const { fileReport, makeDiff } = require('./createReport')

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

test('fileReport', () => {

  const file = {
    base: {
      path: 'index.test.js',
      stats: {
        end: 1589458694389,
        start: 1589458692741
      },
      tests: baseTests,
    },
    branch: {
      path: 'index.test.js',
      stats: {
        end: 1589473749777,
        start: 1589473748049
      },
      tests: branchTests
    }
  }
  expect(fileReport(file)).toEqual(
`
File: \`index.test.js\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
| testA | 1244 | 1244 | 0 | 0.00% |
| testB | 10 | 20 | 10 | 100.00% |
| testC | 20 | - | - | - |
| testD | - | 40 | - | - |
`)

})

test('makeDiff', () => {
  expect(makeDiff(baseTests, branchTests)).toEqual([
    { test: 'testA', base: 1244, branch: 1244 },
    { test: 'testB', base: 10, branch: 20 },
    { test: 'testC', base: 20 },
    { test: 'testD', branch: 40 },
  ])
})
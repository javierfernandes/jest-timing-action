const { assoc } = require('ramda')
const createReport = require('./createReport')
const { fileReport } = createReport

const file = {
  path: 'index.test.js',
  tests: [
    { test: 'testA', base: 1244, branch: 1244, delta: 0, deltaPercentage: 0.00 },
    { test: 'testB', base: 10, branch: 20, delta: 10, deltaPercentage: 100.00 },
    { test: 'testC', base: 20 },
    { test: 'testD', branch: 40 },
  ]
}

test('fileReport', () => {
  expect(fileReport(file)).toEqual(
`File: \`index.test.js\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
| testA | 1,244 | 1,244 | 0 | 0.00% |
| testB | 10 | 20 | 10 | 100.00% |
| testC | 20 | - | - | - |
| testD | - | 40 | - | - |
`)
})

test('createReport', () => {
  expect(createReport(undefined, [
    file,
    assoc('path', 'anotherFile.test.js')(file)
  ])).toEqual(
`
# Test execution times differences 

File: \`index.test.js\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
| testA | 1,244 | 1,244 | 0 | 0.00% |
| testB | 10 | 20 | 10 | 100.00% |
| testC | 20 | - | - | - |
| testD | - | 40 | - | - |

File: \`anotherFile.test.js\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
| testA | 1,244 | 1,244 | 0 | 0.00% |
| testB | 10 | 20 | 10 | 100.00% |
| testC | 20 | - | - | - |
| testD | - | 40 | - | - |

`
  )
})

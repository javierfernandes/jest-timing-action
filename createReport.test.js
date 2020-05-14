const { fileReport } = require('./createReport')

test('fileReport', () => {

  const file = {
    path: 'index.test.js',
    tests: [
      { test: 'testA', base: 1244, branch: 1244, delta: 0, deltaPercentage: 0.00 },
      { test: 'testB', base: 10, branch: 20, delta: 10, deltaPercentage: 100.00 },
      { test: 'testC', base: 20 },
      { test: 'testD', branch: 40 },
    ]
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

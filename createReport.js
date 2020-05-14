
const createReport = diffs => 
`
# Test execution times differences

  ${diffs.map(fileReport)}
`

const fileReport = ({ path, tests }) =>
`
File: \`${path}\`

| test | previous time (ms) | current time (ms) | delta (ms) | delta (%) |
| ---- |          ---: |         ---: |        ---: |      ---: |
${
  tests.map(({ test, base, branch, delta, deltaPercentage }) => `| ${test} | ${value(base)} | ${value(branch)} | ${value(delta)} | ${deltaPercentage !== undefined ? deltaPercentage.toFixed(2) + '%' : '-'} |`)
  .join('\n')
}
`

const value = a => a !== undefined ? a : '-'

module.exports = createReport
module.exports.fileReport = fileReport
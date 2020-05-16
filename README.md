# jest-timing-action

Compares test execution time collected by (jest-timing-reporter)[https://github.com/javierfernandes/jest-timing-reporter] and produces a comment in the PR.

Sample
![image](https://user-images.githubusercontent.com/4428120/82120099-14cc3700-975a-11ea-9161-240af213bc05.png)


# Usage

Install (jest-timing-reporter)[https://github.com/javierfernandes/jest-timing-reporter] in your project/repo.

Then add the following GitHub Action to your repository

```yml
name: jest-timing-action

# pull request on the master branch
on:
  pull_request:
    branches: [ master ]
jobs:
  pr_check:
    runs-on: ubuntu-latest
    name: Post Test Timing deltas on PR
    steps:
    - uses: actions/checkout@v2
    - name: PR Action
      uses: javierfernandes/jest-timing-action@master
      with:
        threshold: 25
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

And that's it. Now just make sure that you have your snapshots in the main branch. Create a PR that somehow impacts test execution times and create a PR, this action will post a comment with the times delta.
On any further commit it will create a new updated comment.

# Parameters

You can tweak some parameters

| Parameter | Type | Description |
| ---- | --- | --- |
| threslhold | Number [0-100] | The minimum execution time delta to consider when showing list of test times. This avoids showing all the tests always since tests are not deterministics and every run has different elapsed time although insignificant   |



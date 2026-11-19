module.exports = {
  branches: ['main'],
  tagFormat: 'engine-v${version}',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { scope: 'engine', type: 'feat', release: 'minor' },
          { scope: 'engine', type: 'fix', release: 'patch' },
          { scope: 'engine', type: 'perf', release: 'patch' },
          { scope: 'engine', type: 'refactor', release: 'patch' },
          { scope: 'engine', release: 'patch' },
          { release: false }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          transform: (commit) => {
            if (commit.scope !== 'engine') {
              return null;
            }
            return commit;
          }
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'packages/school-timetabling-engine/CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'packages/school-timetabling-engine',
        npmPublish: false
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'packages/school-timetabling-engine/CHANGELOG.md',
          'packages/school-timetabling-engine/package.json'
        ],
        message: 'chore(release): engine v${nextRelease.version} [skip ci]'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: []
      }
    ]
  ]
};

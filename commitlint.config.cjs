/**
 * Conventional Commits enforcement.
 *
 * Format: <type>(<scope>): <subject>
 *
 * Scopes reflect the architecture: api, web, db, auth, fees, ocr, comms, infra,
 * docs, ci — keep them close to the proposal's eight shared services.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'web',
        'worker',
        'db',
        'auth',
        'academics',
        'fees',
        'ocr',
        'comms',
        'analytics',
        'admin',
        'ui',
        'shared',
        'infra',
        'docs',
        'ci',
        'deps',
      ],
    ],
    'subject-case': [2, 'always', 'sentence-case'],
    'header-max-length': [2, 'always', 100],
  },
};

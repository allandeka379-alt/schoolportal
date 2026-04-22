/** ESLint config for Node.js services (API, worker). */
module.exports = {
  extends: [require.resolve('./base.cjs')],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    'no-process-exit': 'error',
    'unicorn/no-process-exit': 'off', // We use process.exit deliberately for CLIs.
  },
};

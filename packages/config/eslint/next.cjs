/** ESLint config for the Next.js web app. */
module.exports = {
  extends: [require.resolve('./react.cjs'), 'next/core-web-vitals'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
};

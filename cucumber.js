module.exports = {
  paths: ['tests/features/**/*.feature'],
  require: [
    'tests/support/**/*.js',
    'tests/features/step-definitions/**/*.js',
  ],
  requireModule: ['ts-node/register'], // Remova se não estiver usando TypeScript
  format: ['json:reports/cucumber.json'],
  worldParameters: {
    browser: 'chromium',
  },
  dryRun: false,
};

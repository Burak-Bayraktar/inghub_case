import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    threshold: {
      statements: 81,
      branches: 75,
      functions: 75,
      lines: 81,
    },
    include: [
      'src/**/*.js'
    ],
    exclude: [
      'src/i18n/**',
      'src/main.js',
      'src/assets/**',
    ]
  },
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
  testRunnerHtml: testFramework => `
    <html>
      <head>
        <style>
          /* Reset styles for testing */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        </style>
        <script>
          window.process = { env: { NODE_ENV: 'test' } };
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
};

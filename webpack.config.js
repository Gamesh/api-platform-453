const Encore = require('@symfony/webpack-encore')
const webpack = require('webpack')
const path = require('path')

if (! Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'development')
}

Encore
  // directory where compiled assets will be stored
  .setOutputPath('public/js/')
  // public path used by the web server to access the output path
  .setPublicPath('/public/js/')
  .cleanupOutputBeforeBuild()
  // only needed for CDN's or sub-directory deploy
  //.setManifestKeyPrefix('build/')

  /*
   * ENTRY CONFIG
   *
   * Add 1 entry for each "page" of your app
   * (including one that's included on every page - e.g. "app")
   *
   * Each entry will result in one JavaScript file (e.g. app.js)
   * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
   */
  .enableStimulusBridge('./assets/controllers.json')
  .addEntry('sentry', './assets/sentry.ts')
  .addStyleEntry('css/email', [
    './node_modules/foundation-emails/dist/foundation-emails.min.css',
  ])
  .configureFontRule({
    filename: 'images/[name].[hash:8][ext]',
    type: 'asset',
  })

  // will require an extra script tag for runtime.js
  // but, you probably want this, unless you're building a single-page app
  .enableSingleRuntimeChunk()
  .splitEntryChunks()

  .enableSourceMaps(true)
  // enables hashed filenames (e.g. app.abc123.css)
  .enableVersioning(Encore.isProduction())

  // uncomment if you use TypeScript
  .enableTypeScriptLoader()
  .enableForkedTypeScriptTypesChecking()
  .addCacheGroup('corejs', {
    node_modules: ['core-js', 'corejs', 'core-js-compat', 'core-js-pure'],
  })
  .addCacheGroup('babel-runtime', {
    node_modules: ['@babel', 'regenerator-runtime'],
  })
  .configureBabel()
  // uncomment if you use Sass/SCSS files
  .enableSassLoader()
  // uncomment if you're having problems with a jQuery plugin
  .autoProvidejQuery()
  .enableBuildCache({ config: [__filename] }, (cache) => {
    cache.type = 'filesystem'
    cache.cacheDirectory = path.resolve(__dirname, '.webpackcache')
  })
  // Recommended by https://symfony.com/doc/current/frontend/encore/dev-server.html#cors-issues
  .configureDevServerOptions((options) => {
    options.allowedHosts = 'all'
    options.compress = false
    options.static = ['assets']
  })

Encore.addPlugin(
  new webpack.EnvironmentPlugin({
    APP_VERSION: 'dev',
    ANALYZE: false,
  }),
)

if (Encore.isProduction()) {
  const TerserPlugin = require('terser-webpack-plugin')
  Encore.addPlugin(
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      extractComments: 'all',
      terserOptions: {
        comments: false,
        mangle: true,
        compress: {
          ecma: 5,
          drop_console: true,
          passes: 10,
        },
      },
    }),
  )
}

const SentryCliPlugin = require('@sentry/webpack-plugin')
Encore.addPlugin(
  new SentryCliPlugin({
    include: 'public/js/',
    ignoreFile: '.gitignore',
    ignore: ['node_modules', 'webpack.config.js'],
    release: 'test',
    debug: false,
    dryRun: Encore.isDev(),
  }),
)

if (process.env.ANALYZE) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  Encore.addPlugin(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
}

const config = Encore.getWebpackConfig()

//workaround for https://github.com/webpack/webpack/issues/1194
if (! Encore.isProduction()) {
  // config.devtool = 'eval'
  config.output.crossOriginLoading = 'anonymous'
}
config.target = 'web'
config.output.environment = {
  arrowFunction: false,
  const: false,
  destructuring: false,
  forOf: false,
}

module.exports = config

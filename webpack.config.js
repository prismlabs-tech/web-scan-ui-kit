const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const publicPath = path.resolve(__dirname, 'public')
const srcPath = path.resolve(__dirname, 'src')
const buildPath = path.resolve(__dirname, 'build')

const analyze = process.argv.includes('--analyze')
const defaultLibTarget = 'umd'
const libTarget = process.env.LIB_TARGET || defaultLibTarget
const simulateBlocking = process.argv.includes('block')
const webpackMode = process.argv.includes('--mode')
  ? process.argv[process.argv.indexOf('--mode') + 1]
  : 'production'
const isDev = webpackMode === 'development'

const sharedPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      CDN_ENV: JSON.stringify(process.env.CDN_ENV),
      CDN_URL: JSON.stringify(process.env.CDN_URL),
      DEPLOYMENT_TYPE: JSON.stringify(process.env.DEPLOYMENT_TYPE || 'local'),
      PRISM_VERSION: JSON.stringify(process.env.npm_package_version),
      NODE_ENV: JSON.stringify(webpackMode),
      SIMULATE_BLOCKING_SCRIPT: simulateBlocking,
    },
  }),
]

const staticAssetPlugins = [
  // copy manifest and images directory from public to build
  // when running `npm start build` command
  new CopyWebPackPlugin({
    patterns: [
      //   { from: 'public/font', to: 'font' },
      { from: 'public/images', to: 'images' },
      { from: 'public/translations', to: 'translations' },
      isDev && { from: 'public/manifest.json', to: '' },
    ].filter(Boolean),
  }),
]

if (libTarget === defaultLibTarget) {
  sharedPlugins.push(...staticAssetPlugins)
}

// show bundle analyzer gui when using build:stats or start:stats
if (analyze) {
  sharedPlugins.push(new BundleAnalyzerPlugin())
}

const devPlugins = [
  ...sharedPlugins,
  new HtmlWebpackPlugin({
    template: path.resolve(publicPath, 'index.hbs'),
    simulateBlockingScript: simulateBlocking,
    minify: {
      removeComments: false,
      collapseWhitespace: false,
      removeRedundantAttributes: false,
      useShortDoctype: false,
      removeEmptyAttributes: false,
      removeStyleLinkTypeAttributes: false,
      keepClosingSlash: false,
      minifyJS: false,
      minifyCSS: false,
      minifyURLs: false,
    },
    inject: false,
  }),
  new ReactRefreshWebpackPlugin(),
]

const prodPlugins = [
  ...sharedPlugins,
  // clean build folder when running `npm start build`
  new CleanWebpackPlugin(),
]

// show sourcemaps when building with npm build:local for debugging
const prodDevtool = process.env.SOURCEMAPS === 'true' ? 'source-map' : false
const devtool = isDev ? 'eval-cheap-module-source-map' : prodDevtool

const resolve = {
  alias: {
    '@components': path.resolve(__dirname, 'src/ui/components'),
    '~': path.resolve(__dirname, 'src/'),
  },
  extensions: ['*', '.ts', '.tsx', '.js', '.jsx'],
  modules: [srcPath, 'node_modules'],
}

module.exports = {
  entry: {
    prism: './src/index.tsx',
  },
  mode: webpackMode,
  devtool,
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                isDev && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(svg|png)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve,
  output: {
    clean: true,
    filename: isDev ? 'default/[name].js' : '[name].js',
    library: {
      name: 'Prism',
      type: defaultLibTarget,
      umdNamedDefine: true,
    },
    path: buildPath,
    publicPath: 'auto',
    globalObject: 'this',
  },
  devServer: {
    port: 3000,
    hot: true,
    compress: true,
    open: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    server: {
      type: 'https',
    },
  },
  watchOptions: { ignored: ['/src/tailwind.css'] },
  optimization: {
    removeAvailableModules: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          ie8: false,
          mangle: true,
          format: {
            comments: false,
          },
          compress: {
            pure_funcs: ['console.info', 'console.debug', 'console.warn'],
          },
        },
      }),
    ],
  },
  plugins: isDev ? devPlugins : prodPlugins,
}

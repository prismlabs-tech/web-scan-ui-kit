const presets = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
const plugins = [
  '@babel/plugin-transform-runtime',
  [
    'module-resolver',
    {
      root: ['./'],
      alias: {
        lib: './src/lib',
      },
    },
  ],
]

module.exports = { presets, plugins }

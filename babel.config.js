/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');

const { resolvePath } = require('babel-plugin-module-resolver');

// See https://github.com/psycheangel/deprecated-with-module-resolver
const customResolvePath = (sourcePath, currentFile, opts) => {
  const defaultPath = resolvePath(sourcePath, currentFile, opts);
  if (
    sourcePath === 'react-native' &&
    currentFile.includes('node_modules/react-native/') === false &&
    currentFile.includes('resolvers/react-native.js') === false
  ) {
    return path.resolve(__dirname, 'resolvers/react-native.js');
  }

  return defaultPath;
};

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // ignore: [],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          app: './src/app/',
          config: './src/config/',
          components: './src/components/',
          firebase: './src/firebase/',
          img: './src/theme/img/',
          lib: './src/lib/',
          store: './src/store/',
          theme: './src/theme/',
          types: './src/types/',
        },
        resolvePath: customResolvePath,
      },
    ],
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.svg'],
      },
    ],
    'react-native-reanimated/plugin',
    'module:react-native-dotenv',
  ],
};

// import './wdyr';
import 'react-native-gesture-handler';
import './shim.js';

import App from './App';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

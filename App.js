import { StatusBar } from 'expo-status-bar';
import {Text, View } from 'react-native';
import { styles } from './Style.js';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to Roomie!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

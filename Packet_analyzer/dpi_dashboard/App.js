import './global.css';
import { View, StatusBar } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
export default function App() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <DashboardScreen />
    </View>
  );
}
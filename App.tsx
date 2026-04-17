import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator'; 
import { ActivityIndicator, Alert, LogBox, StyleSheet, View } from 'react-native';

LogBox.ignoreLogs([
  'expo-notifications',
  'i18next',            // Ẩn tin nhắn quảng cáo i18next
]);

const RootApp = () => {
  const { isLoaded, theme } = useAppContext();

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') Alert.alert('Thông báo', 'Bật thông báo để hiệu quả hơn nhé!');
    })();
  }, []);

  if (!isLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme?.background || '#f8f9fa' }]}>
        <ActivityIndicator size="large" color="#FF5252" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootApp />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
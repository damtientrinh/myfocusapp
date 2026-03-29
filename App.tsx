import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

import { AppProvider, useAppContext } from './src/context/AppContext';
import { TabNavigator } from './src/navigation/TabNavigator';

// --- CẤU HÌNH THÔNG BÁO ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  } as Notifications.NotificationBehavior),
});

const RootApp = () => {
  const { isLoaded, theme } = useAppContext();

  // Xin quyền thông báo khi App vừa khởi động
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Thông báo', 'Trình hãy bật thông báo để không bỏ lỡ khi hết giờ tập trung nhé!');
        return;
      }

      // Cấu hình riêng cho Android (Kênh thông báo)
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    requestPermissions();
  }, []);

  // 1. Chờ load dữ liệu từ máy và Firebase
  if (!isLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme?.background || '#f8f9fa' }]}>
        <ActivityIndicator size="large" color="#FF5252" />
      </View>
    );
  }

  // 2. Khi đã load xong, hiển thị hệ thống Tab
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RootApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
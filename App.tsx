import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Context & Navigation
import { AppProvider, useAppContext } from './src/context/AppContext';
import { TabNavigator } from './src/navigation/TabNavigator';

// Screens
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import SettingScreen from '@/screens/SettingScreen';
import ProfileScreen from "./src/screens/Profile";
import EditProfileScreen from './src/screens/EditProfileScreen';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import RoomDetailScreen from './src/screens/RoomDetailScreen';
import FocusScreen from './src/screens/FocusScreen';

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['expo-notifications', 'i18next is made possible', 'expo-av']);

// 1. Nhóm màn hình chưa đăng nhập
const AuthStack = ({ setUser }: any) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {(props) => <Login {...props} setUser={setUser} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

// 2. Nhóm màn hình sau khi đăng nhập (Bao gồm Tab và các trang chi tiết)
const MainStack = () => (
  <Stack.Navigator>
    {/* Màn hình chính chứa 5 Tab */}
    <Stack.Screen 
      name="MainTabs" 
      component={TabNavigator} 
      options={{ headerShown: false }} 
        />
        <Stack.Screen
            name="CreateRoom"
            component={CreateRoomScreen}
            options={{ title: "Tạo phòng" }}
        />
        <Stack.Screen
            name="RoomDetail"
            component={RoomDetailScreen}
            options={{ title: "Phòng" }}
        />

        {/* 🔥 FIX LỖI NAVIGATE */}
        <Stack.Screen
            name="Focus"
            component={FocusScreen}
            options={{ title: "Focus" }}
        />

    <Stack.Screen 
      name="Settings" 
      component={SettingScreen} // Đảm bảo đã import SettingsScreen ở trên
      options={{ title: 'Cài đặt' }} 
    />
    
    {/* Màn hình Profile - Nằm ngoài TabNavigator để ẩn thanh Tab Bar */}
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ 
        headerTitle: 'Hồ sơ cá nhân',
        headerBackTitle: 'Quay lại',
        headerTintColor: '#e74c3c', // Màu đỏ thương hiệu của MyFocus
        headerStyle: { backgroundColor: '#fff' },
      }} 
    />

    <Stack.Screen 
      name="EditProfile" 
      component={EditProfileScreen} 
      options={{ title: 'Chỉnh sửa hồ sơ' }} 
    />
  </Stack.Navigator>
);

const RootApp = () => {
  const { isLoaded, theme, user, setUser } = useAppContext();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Thông báo', 'Bật thông báo để không bỏ lỡ khi hết giờ nhé!');
      }
    };
    requestPermissions();
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
      {user ? (
        <MainStack /> 
      ) : (
        <AuthStack setUser={setUser}/>
      )}
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
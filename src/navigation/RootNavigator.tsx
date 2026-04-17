import { useAppContext } from '@/context/AppContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Import Screens & Navigators
import CreateRoomScreen from '@/screens/CreateRoomScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import LeaderboardScreen from '@/screens/LeaderboardScreen';
import Login from "@/screens/Login";
import ProfileScreen from "@/screens/Profile";
import Register from "@/screens/Register";
import RoomDetailScreen from '@/screens/RoomDetailScreen';
import SettingScreen from '@/screens/SettingScreen';
import { TabNavigator } from './TabNavigator';
import FocusScreen from '@/screens/FocusScreen';

// Định nghĩa Type để hết gạch đỏ navigate
export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  Leaderboard: undefined;
  RoomDetail: { room: any };
  CreateRoom: undefined;
  Settings: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Focus: { roomId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, setUser } = useAppContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Focus" component={FocusScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: true, title: 'Bảng xếp hạng' }} />
          <Stack.Screen name="RoomDetail" component={RoomDetailScreen} options={{ headerShown: true, title: 'Chi tiết phòng' }} />
          <Stack.Screen name="CreateRoom" component={CreateRoomScreen} options={{ headerShown: true, title: 'Tạo phòng' }} />
          <Stack.Screen name="Settings" component={SettingScreen} options={{ headerShown: true, title: 'Cài đặt' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};
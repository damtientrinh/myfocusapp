import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Timer, BarChart2, Users } from 'lucide-react-native'; // Icon 

import FocusScreen from './src/screens/FocusScreen';
import StatsScreen from './src/screens/StatsScreen';
import SocialScreen from './src/screens/SocialScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          tabBarActiveTintColor: '#FF9F43', // Màu cam chủ đạo
          headerShown: true, 
        }}
      >
        <Tab.Screen 
          name="Tập trung" 
          component={FocusScreen} 
          options={{ tabBarIcon: ({color}) => <Timer color={color} /> }}
        />
        <Tab.Screen 
          name="Thống kê" 
          component={StatsScreen} 
          options={{ tabBarIcon: ({color}) => <BarChart2 color={color} /> }}
        />
        <Tab.Screen 
          name="Xếp hạng" 
          component={SocialScreen} 
          options={{ tabBarIcon: ({color}) => <Users color={color} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
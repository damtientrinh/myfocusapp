import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppContext } from '@/context/AppContext';

// Icons
import { BarChart2, ListTodo, Settings, Timer, Users } from 'lucide-react-native';

// Screens
import FocusScreen from '@/screens/FocusScreen';
import SettingScreen from '@/screens/SettingScreen';
import SocialScreen from '@/screens/SocialScreen';
import StatsScreen from '@/screens/StatsScreen';
import TaskScreen from '@/screens/TaskScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { theme, fonts, spacing } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        // 1. Màu sắc linh hoạt
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
        
        // 2. Cấu hình Thanh Tab phía dưới
        tabBarStyle: { 
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : spacing.sm, // Dùng spacing chuẩn
          paddingTop: spacing.xs + 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        
        // Style cho nhãn chữ dưới icon
        tabBarLabelStyle: {
          fontFamily: fonts.sans,
          fontSize: 12,
          fontWeight: '500',
        },

        // 3. Cấu hình Header phía trên
        headerStyle: { 
          backgroundColor: theme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: { 
          color: theme.text,
          fontFamily: fonts.rounded, // Dùng font bo tròn cho Header
          fontWeight: '700',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <Tab.Screen 
        name="Focus" 
        component={FocusScreen} 
        options={{ 
          title: 'Tập trung',
          tabBarLabel: 'Tập trung',
          tabBarIcon: ({color, focused}) => (
            <Timer size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      
      <Tab.Screen 
        name="Tasks" 
        component={TaskScreen} 
        options={{ 
          title: 'Nhiệm vụ',
          tabBarLabel: 'Nhiệm vụ',
          tabBarIcon: ({color, focused}) => (
            <ListTodo size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ 
          title: 'Thống kê',
          tabBarLabel: 'Thống kê',
          tabBarIcon: ({color, focused}) => (
            <BarChart2 size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      
      <Tab.Screen 
        name="Social" 
        component={SocialScreen} 
        options={{ 
          title: 'Xếp hạng',
          tabBarLabel: 'Xếp hạng',
          tabBarIcon: ({color, focused}) => (
            <Users size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen} 
        options={{ 
          title: 'Cài đặt',
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({color, focused}) => (
            <Settings size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          )
        }}
      />
    </Tab.Navigator>
  );
};
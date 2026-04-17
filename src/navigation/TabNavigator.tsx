import React, { memo } from 'react'; 
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppContext } from '@/context/AppContext';
import { BarChart2, ListTodo, Settings, Timer, Users } from 'lucide-react-native';

import FocusScreen from '@/screens/FocusScreen';
import SettingScreen from '@/screens/SettingScreen';
import RoomsScreen from '@/screens/RoomsScreen';
import SocialScreen from '@/screens/SocialScreen';
import StatsScreen from '@/screens/StatsScreen';
import TaskScreen from '@/screens/TaskScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ IconComponent, color, focused }: any) => (
  <IconComponent size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
);

export const TabNavigator = memo(() => {
  const { theme, fonts, spacing } = useAppContext();

  return (
    <Tab.Navigator
      initialRouteName='Tasks'
      screenOptions={{
        // 1. QUAN TRỌNG: Ẩn tiêu đề lặp lại ở phía trên
        headerShown: false, 
        
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
        tabBarStyle: { 
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : spacing.sm,
          paddingTop: spacing.xs + 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sans,
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Tasks" 
        component={TaskScreen} 
        options={{ 
          tabBarLabel: 'Nhiệm vụ',
          tabBarIcon: (props) => <TabIcon IconComponent={ListTodo} {...props} />
        }}
      />

      <Tab.Screen 
        name="Focus" 
        component={FocusScreen} 
        options={{ 
          tabBarLabel: 'Tập trung',
          tabBarIcon: (props) => <TabIcon IconComponent={Timer} {...props} />
        }}
      />
      
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ 
          tabBarLabel: 'Thống kê',
          tabBarIcon: (props) => <TabIcon IconComponent={BarChart2} {...props} />
        }}
          />
          {/* Rooms */}
          <Tab.Screen
              name="Rooms"
              component={RoomsScreen}
              options={{
                  tabBarLabel: 'Phòng',
                  tabBarIcon: (props) => <TabIcon IconComponent={Users} {...props} />
              }}
          />
      
      <Tab.Screen 
        name="Social" 
        component={SocialScreen} 
        options={{ 
          tabBarLabel: 'Xếp hạng',
          tabBarIcon: (props) => <TabIcon IconComponent={Users} {...props} />
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen} 
        options={{ 
          tabBarLabel: 'Cài đặt',
          tabBarIcon: (props) => <TabIcon IconComponent={Settings} {...props} />
        }}
      />
    </Tab.Navigator>
  );
});
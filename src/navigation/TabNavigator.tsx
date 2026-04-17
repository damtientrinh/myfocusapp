import { useAppContext } from '@/context/AppContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarChart2, ListTodo, Settings, Timer, Users } from 'lucide-react-native';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import FocusScreen from '@/screens/FocusScreen';
import RoomsScreen from '@/screens/RoomsScreen';
import SettingScreen from '@/screens/SettingScreen';
import StatsScreen from '@/screens/StatsScreen';
import TaskScreen from '@/screens/TaskScreen';

// Định nghĩa Type cho riêng các Tab để hỗ trợ nhắc lệnh (IntelliSense)
export type TabParamList = {
  Tasks: undefined;
  Rooms: undefined;
  Focus: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ IconComponent, color, focused }: any) => (
  <IconComponent size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
);

export const TabNavigator = memo(() => {
  const { theme, fonts, spacing } = useAppContext();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName='Tasks'
      screenOptions={{
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
          tabBarLabel: t('tabs.tasks'), 
          tabBarIcon: (props) => <TabIcon IconComponent={ListTodo} {...props} />
        }}
      />

      <Tab.Screen 
        name="Rooms" 
        component={RoomsScreen} 
        options={{ 
          tabBarLabel: t('tabs.rooms'),
          tabBarIcon: (props) => <TabIcon IconComponent={Users} {...props} />
        }}
      />

      <Tab.Screen 
        name="Focus" 
        component={FocusScreen} 
        options={{ 
          tabBarLabel: t('tabs.focus'),
          tabBarIcon: (props) => <TabIcon IconComponent={Timer} {...props} />
        }}
      />
      
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ 
          tabBarLabel: t('tabs.stats'),
          tabBarIcon: (props) => <TabIcon IconComponent={BarChart2} {...props} />
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen} 
        options={{ 
          tabBarLabel: t('tabs.settings'),
          tabBarIcon: (props) => <TabIcon IconComponent={Settings} {...props} />
        }}
      />
    </Tab.Navigator>
  );
});
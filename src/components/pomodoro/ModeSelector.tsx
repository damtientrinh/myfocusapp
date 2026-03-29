import React from 'react';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppContext } from '@/context/AppContext'; 
import { styles } from '@/styles/PomodoroStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.9; 
const TAB_WIDTH = CONTAINER_WIDTH / 3;

type ModeType = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

// Đưa ra ngoài để tránh lỗi 'undefined' khi component re-render
const MODES_LIST: ModeType[] = ['WORK', 'SHORT_BREAK', 'LONG_BREAK'];

interface ModeProps {
  mode: ModeType; 
  changeMode: (m: ModeType) => void;
  labels?: Record<ModeType, string>;
  accentColors?: [string, string]; // Thêm dấu ? để tránh lỗi nếu quên truyền
}

export const ModeSelector = ({ mode, changeMode, labels, accentColors = ['#FF512F', '#DD2476'] } : ModeProps) => {
  const { t } = useTranslation();
  const { fonts, isDarkMode } = useAppContext(); 

  const indicatorStyle = useAnimatedStyle(() => {
    const positions: Record<ModeType, number> = {
      WORK: 0,
      SHORT_BREAK: 1,
      LONG_BREAK: 2,
    };

    return {
      transform: [
        { 
          translateX: withSpring(positions[mode] * TAB_WIDTH, { 
            damping: 20,
            stiffness: 120,
          }) 
        }
      ],
    };
  });

  return (
    <View style={[styles.modeRow, { width: CONTAINER_WIDTH, overflow: 'hidden' }]}>
      {/* Indicator trượt phía dưới */}
      <Animated.View style={[
        styles.activeIndicator, 
        indicatorStyle,
        { width: TAB_WIDTH - 8, marginHorizontal: 4, position: 'absolute', zIndex: 0 } 
      ]}>
        <LinearGradient
          colors={accentColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 12 }}
        />
      </Animated.View>

      {/* Dùng toán tử Optional Chaining để an toàn tuyệt đối */}
      {MODES_LIST?.map((m) => {
        const isActive = mode === m;
        return (
          <TouchableOpacity 
            key={m} 
            style={[styles.modeButton, { flex: 1, zIndex: 1 }]}
            activeOpacity={0.8}
            onPress={() => {
              if (mode !== m) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                changeMode(m);
              }
            }}
          >
            <Text 
              style={[
                styles.modeText, 
                { 
                  fontFamily: fonts?.rounded || 'System',
                  color: isActive ? '#FFF' : (isDarkMode ? '#666' : '#999'),
                  fontWeight: isActive ? '700' : '500'
                }
              ]}
            >
              {labels?.[m] || t(`pomodoro.modes.${m.toLowerCase()}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
import React, { memo, useEffect } from 'react';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withTiming, 
  interpolateColor,
  interpolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '@/context/AppContext'; 
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_WIDTH = Math.round(SCREEN_WIDTH * 0.9); 
const TAB_WIDTH = CONTAINER_WIDTH / 3;

type ModeType = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';
const MODES_LIST: ModeType[] = ['WORK', 'SHORT_BREAK', 'LONG_BREAK'];
const POSITIONS: Record<ModeType, number> = { WORK: 0, SHORT_BREAK: 1, LONG_BREAK: 2 };

interface ModeProps {
  mode: ModeType;
  changeMode: (newMode: ModeType) => void;
  labels?: Record<ModeType, string>;
  accentColors?: string[];
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export const ModeSelector = memo(({ 
  mode, changeMode, labels, 
  accentColors = ['#FF512F', '#DD2476'] 
} : ModeProps) => {
  const { t } = useTranslation();
  const { fonts, isDarkMode } = useAppContext(); 

  const animIndex = useSharedValue(POSITIONS[mode]);

  useEffect(() => {
    animIndex.value = withSpring(POSITIONS[mode], {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [mode]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animIndex.value * TAB_WIDTH }],
  }));

  return (
    <View style={[styles.modeRow, { width: CONTAINER_WIDTH, overflow: 'hidden' }]}>
      {/* Indicator Layer */}
      <Animated.View style={[
        styles.activeIndicator, 
        indicatorStyle,
        { 
          width: TAB_WIDTH - 8, 
          marginHorizontal: 4, 
          position: 'absolute', 
          zIndex: 0,
          height: '80%',
          top: '10%'
        } 
      ]}>
        <LinearGradient
          colors={accentColors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 12 }}
        />
      </Animated.View>

      {MODES_LIST.map((m) => {
        const index = POSITIONS[m];
        
        const animatedTextStyle = useAnimatedStyle(() => {
          // Màu chữ chuyển đổi mượt mà theo vị trí indicator
          const color = interpolateColor(
            animIndex.value,
            [index - 0.5, index, index + 0.5],
            [isDarkMode ? '#888' : '#AAA', '#FFFFFF', isDarkMode ? '#888' : '#AAA']
          );

          // Scale chữ dựa trên khoảng cách của indicator tới tab đó (Mượt hơn dùng biến mode)
          const scale = interpolate(
            animIndex.value,
            [index - 1, index, index + 1],
            [1, 1.1, 1]
          );

          return {
            color: color,
            transform: [{ scale: scale }]
          };
        });

        return (
          <TouchableOpacity 
            key={m} 
            style={{ flex: 1, zIndex: 1, alignItems: 'center', justifyContent: 'center', height: 45 }}
            activeOpacity={1}
            onPress={() => {
              if (mode !== m) {
                requestAnimationFrame(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                });
                changeMode(m);
              }
            }}
          >
            <AnimatedText 
              style={[
                styles.modeText, 
                animatedTextStyle,
                { 
                  fontFamily: fonts?.rounded || 'System',
                  fontWeight: '600',
                }
              ]
            }>
              {labels?.[m] || t(`pomodoro.modes.${m.toLowerCase()}`)}
            </AnimatedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});
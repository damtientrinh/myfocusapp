import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing, interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue, withRepeat,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import { Shadows } from '../../../constants/theme';
import { styles } from './styles';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  progress: number; 
  isActive: boolean;
  colors: [string, string];
  isDarkMode: boolean;
}

export const GradientLoader = ({ isActive, progress, colors, isDarkMode }: Props) => {
  const waveOffset1 = useSharedValue(0);
  const waveOffset2 = useSharedValue(0);
  const [mainColor, accentColor] = colors;

  const smoothLevel = useDerivedValue(() => {
    const targetLevel = interpolate(progress, [0, 1], [88, 12]);
    return withTiming(targetLevel, { duration: 1000, easing: Easing.linear });
  });

  useEffect(() => {
    waveOffset1.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.linear }),
      -1, false
    );
    waveOffset2.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  const smoothWaveH = useDerivedValue(() => {
    return withTiming(isActive ? 8 : 1, { duration: 1000 });
  }, [isActive]);

  const createWaveProps = (offset: any, isReverse: boolean) => useAnimatedProps(() => {
    const currentLevel = smoothLevel.value;
    const waveH = smoothWaveH.value; 
    
    return {
      d: `
        M-100 ${currentLevel}
        C-70 ${currentLevel - waveH} -30 ${currentLevel + waveH} 0 ${currentLevel}
        C30 ${currentLevel - waveH} 70 ${currentLevel + waveH} 100 ${currentLevel}
        C130 ${currentLevel - waveH} 170 ${currentLevel + waveH} 200 ${currentLevel}
        V105 H-100 Z
      `,
      transform: [
        { translateX: interpolate(offset.value, [0, 1], isReverse ? [-100, 0] : [0, -100]) }
      ]
    };
  });

  const animatedProps1 = createWaveProps(waveOffset1, false);
  const animatedProps2 = createWaveProps(waveOffset2, true);

  const scale = useDerivedValue(() => {
    return withTiming(isActive ? 1 : 0.95, { duration: 500 });
  });

  // Tạo animated style cho box
  const pulse = useSharedValue(1);
  
  useEffect(() => {
    if (isActive) {
      pulse.value = withRepeat(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1);
    }
  }, [isActive]);

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulse.value }],
    opacity: withTiming(isActive ? 1 : 0.8),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, 
        isDarkMode ? Shadows.dark : Shadows.light,
        { shadowColor: colors[0] },
        animatedBoxStyle
      ]}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Defs>
            {/* Gradient nước: Màu sắc đặc và rực rỡ hơn */}
            <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={mainColor} stopOpacity={1} />
              <Stop offset="100%" stopColor={accentColor} stopOpacity={1} />
            </LinearGradient>

            <ClipPath id="clipCircle">
              <Circle cx="50" cy="50" r="46" />
            </ClipPath>
          </Defs>

          {/* 1. Viền hào quang Neon (Glow) */}
          <Circle 
            cx="50" cy="50" r="48" 
            stroke={mainColor} strokeWidth="1.5" strokeOpacity={0.3} 
            fill="none" 
          />

          {/* 2. Nền quả cầu (Sâu hơn) */}
          <Circle cx="50" cy="50" r="46" fill={mainColor} fillOpacity={0.1} />

          <G clipPath="url(#clipCircle)">
            {/* 3. Lớp sóng xa: Màu đặc nhưng đậm hơn chút để tạo khối */}
            <AnimatedPath 
              animatedProps={animatedProps2} 
              fill={mainColor} 
              fillOpacity={0.7} 
            />
            
            {/* 4. Lớp sóng gần: Đặc hoàn toàn (Opacity 1) */}
            <AnimatedPath 
              animatedProps={animatedProps1} 
              fill="url(#waterGrad)" 
            />
          </G>

          {/* 5. Highlight viền kính (Giúp quả cầu rõ nét) */}
          <Circle 
            cx="50" cy="50" r="46" 
            stroke="white" strokeWidth="1.25" strokeOpacity={0.8} 
            fill="none" 
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
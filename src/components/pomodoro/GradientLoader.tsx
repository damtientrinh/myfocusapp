import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing, useAnimatedProps, useAnimatedStyle, useSharedValue,
  withRepeat, withTiming, cancelAnimation, withSequence,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop, RadialGradient, G } from 'react-native-svg';

// Đảm bảo khai báo cái này để không bị báo lỗi "doesn't exist"
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: number;
  isActive: boolean;
  colors: [string, string]; // Nhận mảng màu [Màu chính, Màu phụ] từ FocusScreen
}

export const GradientLoader = ({ isActive, progress, colors }: Props) => {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const radius = 45; 
  const circumference = 2 * Math.PI * radius;

  // Lấy màu từ mảng colors truyền xuống
  const mainColor = colors[0];
  const accentColor = colors[1];

  useEffect(() => {
    if (isActive) {
      rotation.value = withRepeat(
        withTiming(1, { duration: 15000, easing: Easing.linear }), 
        -1, 
        false
      );
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0);
      pulse.value = withTiming(1);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value * 360}deg` },
      { scale: pulse.value }
    ],
    // Bóng đổ lấy theo màu chính của mode
    shadowColor: mainColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: interpolate(pulse.value, [1, 1.05], [0.3, 0.8]),
    shadowRadius: 20,
  }));

  const animatedCircleProps = useAnimatedProps(() => {
    const offset = circumference * (1 - progress);
    return {
      strokeDashoffset: withTiming(offset, { duration: 800 }), 
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, styles.svgWrapper]}>
        <Svg height="320" width="320" viewBox="0 0 100 100">
          <Defs>
            {/* Sử dụng ID duy nhất dựa trên màu để SVG cập nhật ngay lập tức */}
            <LinearGradient id="gradDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={mainColor} stopOpacity={1} />
              <Stop offset="50%" stopColor={accentColor} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={mainColor} stopOpacity={1} />
            </LinearGradient>
            
            <RadialGradient id="glowDynamic" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={mainColor} stopOpacity={0.4} />
              <Stop offset="100%" stopColor={mainColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          
          {/* Lớp hào quang phía sau */}
          <Circle cx="50" cy="50" r={radius + 4} fill="url(#glowDynamic)" opacity={isActive ? 0.6 : 0.2} />

          {/* Vòng nền mờ (Track) */}
          <Circle
            cx="50" cy="50" r={radius}
            stroke={mainColor}
            strokeWidth="2" 
            strokeOpacity={0.15}
            fill="transparent"
          />

          {/* Vòng tiến trình chính xoay theo kim đồng hồ từ đỉnh 12h */}
          <G transform="rotate(-90 50 50)">
            <AnimatedCircle
              cx="50" cy="50" r={radius}
              stroke="url(#gradDynamic)"
              strokeWidth="5"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={animatedCircleProps}
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  svgWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
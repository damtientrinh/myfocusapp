import React from 'react';
import Animated, {
  interpolate,
  useAnimatedProps,
  Extrapolate,
  SharedValue, // Thêm dòng này
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface BubbleProps {
  baseSize: number;
  bubbleY: SharedValue<number>; // Sử dụng trực tiếp SharedValue
  delay: number;
  xPos: number;
  progress: number;
}

export const BubbleItem = ({ baseSize, bubbleY, delay, xPos, progress: waterProgress }: BubbleProps) => {
  const animatedBubbleProps = useAnimatedProps(() => {
    const p = (bubbleY.value + delay) % 1;
    const waterLevel = interpolate(waterProgress, [0, 1], [88, 12], Extrapolate.CLAMP);
    
    return {
      cy: interpolate(p, [0, 1], [95, waterLevel], Extrapolate.CLAMP),
      opacity: interpolate(p, [0, 0.1, 0.8, 1], [0, 0.3, 0.3, 0], Extrapolate.CLAMP),
      r: interpolate(p, [0, 1], [baseSize * 0.6, baseSize], Extrapolate.CLAMP),
    };
  }, [waterProgress]);

  return (
    <AnimatedCircle 
      cx={xPos} 
      fill="white" 
      animatedProps={animatedBubbleProps} 
      pointerEvents="none"
    />
  );
};
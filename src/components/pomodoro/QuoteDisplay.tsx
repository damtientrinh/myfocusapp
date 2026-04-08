import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text } from 'react-native';
import Animated, {
  interpolate, useAnimatedStyle, useSharedValue,
  withTiming, runOnJS,
} from 'react-native-reanimated';

import { getRandomQuote } from '../../constants/Quotes';
import { styles } from '../../styles/PomodoroStyles';
import { useAppContext } from '@/context/AppContext'; // Để lấy fonts

interface Props {
  mode: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'; // Fix type cụ thể
  pomodoroCount: number;
}

export const QuoteDisplay = ({ mode, pomodoroCount }: Props) => {
  const { fonts } = useAppContext();
  const opacity = useSharedValue(1);
  const [displayQuote, setDisplayQuote] = useState(getRandomQuote(mode)); // Khởi tạo trực tiếp để tránh null
  const isFirstRender = useRef(true);

  // 1. Hàm đổi chữ chạy trên JS Thread
  const changeQuoteText = useCallback(() => {
    const newQuote = getRandomQuote(mode);
    setDisplayQuote(newQuote);
    opacity.value = withTiming(1, { duration: 800 }); 
  }, [mode, opacity]);

  // 2. Logic đổi Quote khi MODE thay đổi
  useEffect(() => {
    // Bỏ qua lần render đầu tiên vì đã khởi tạo ở useState
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    opacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        runOnJS(changeQuoteText)();
      }
    });
  }, [mode, pomodoroCount]); 

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { 
        translateY: interpolate(opacity.value, [0, 1], [10, 0]) 
      }
    ]
  }));

  if (!displayQuote) return null;

  return (
    <Animated.View style={[
      styles.quoteContainer, animatedStyle,
      { height: 80, justifyContent: 'center' }
      ]}>
      <Text style={[styles.quoteText, { fontFamily: fonts.sans }]}>
        “{displayQuote}”
      </Text>
    </Animated.View>
  );
};
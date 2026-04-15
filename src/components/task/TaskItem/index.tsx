import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation, interpolate,
  runOnJS, useAnimatedReaction,
  useAnimatedStyle, useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../../context/AppContext';
import { styles } from './styles';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

export const TaskItem = ({ task, onToggle, onDelete }: any) => {
  const { selectedTaskId, setSelectedTaskId, language, theme, fonts, spacing } = useAppContext();
  const { t } = useTranslation();

  const router = useRouter();
  const navigation = useNavigation<any>();

  const translateX = useSharedValue(0);
  const context = useSharedValue(0);

  const isFocusing = selectedTaskId === task.id;

  // 1. Xử lý ngày tháng
  const reminderDate = task.reminderDate ? new Date(task.reminderDate) : null;
  const formattedTime = reminderDate && !isNaN(reminderDate.getTime()) 
    ? reminderDate.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // 2. Rung phản hồi (Haptics)
  useAnimatedReaction(
    () => translateX.value,
    (currentValue, previousValue) => {
      if (currentValue < TRANSLATE_X_THRESHOLD && (previousValue ?? 0) >= TRANSLATE_X_THRESHOLD) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  );

  // 3. Gesture Logic
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) 
    .onStart(() => {
      context.value = translateX.value;
    })
    .onUpdate((event) => {
      const newTranslateX = event.translationX + context.value;
      translateX.value = Math.min(0, newTranslateX);
    })
    .onEnd(() => {
      const shouldBeDeleted = translateX.value < TRANSLATE_X_THRESHOLD;
      if (shouldBeDeleted) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(onDelete)(task.id);
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(
      translateX.value,
      [0, -SCREEN_WIDTH],
      [1, 0.5],
      Extrapolation.CLAMP
    ),
  }));

  const rIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(
      translateX.value,
      [0, TRANSLATE_X_THRESHOLD],
      [0.5, 1.2],
      Extrapolation.CLAMP
    )}],
  }));

  const handleFocus = () => {
    if (task.completed) return;
    
    // Rung phản hồi
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Bước 1: Cập nhật State cho Context
    setSelectedTaskId(task.id);
    
    // Bước 2: Điều hướng bằng Navigation chính của App
    setTimeout(() => {
      try {
        navigation.navigate('Focus'); 
      } catch (e) {
        console.error("Lỗi điều hướng:", e);
      }
    }, 50); 
  };


  return (
    <View style={[styles.itemWrapper, { marginBottom: spacing.sm }]}> 
      <View style={[styles.deleteBackground, { backgroundColor: theme.primary }]}>
        <Animated.View style={rIconStyle}>
          <Ionicons name="trash-outline" size={26} color="white" />
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[
          styles.taskItem, 
          rStyle, 
          { 
            backgroundColor: theme.card, 
            borderRadius: spacing.borderRadius.medium,
            borderColor: isFocusing ? theme.primary : theme.border,
            borderWidth: isFocusing ? 2 : 1 
          }
        ]}>
          
          {/* Checkbox */}
          <TouchableOpacity 
            onPress={onToggle} 
            style={[
              styles.checkbox, 
              task.completed 
                ? { backgroundColor: theme.secondary, borderColor: theme.secondary } 
                : { borderColor: theme.border }
            ]}
          >
            {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
          </TouchableOpacity>
          
          {/* Nội dung Task */}
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text 
              numberOfLines={1}
              style={[
                styles.text, 
                { color: theme.text, fontFamily: fonts.rounded },
                task.completed && { textDecorationLine: 'line-through', opacity: 0.5 }
              ]}
            >
              {task.text}
            </Text>
            <Text style={[styles.timeLabel, { color: theme.subText, fontFamily: fonts.sans }]}>
              ⏰ {formattedTime} • {task.pomodoroCount || 0} 🍅
            </Text>
          </View>

          {/* Nút Focus */}
          <TouchableOpacity 
            onPress={handleFocus} 
            disabled={task.completed}
            style={[
              styles.focusButton, 
              { borderColor: theme.primary, borderWidth: 1 },
              task.completed && { opacity: 0.2 },
              isFocusing && { backgroundColor: theme.primary }
            ]}
          >
            <Text style={[
              styles.focusButtonText, 
              { 
                color: isFocusing ? '#FFF' : theme.primary,
                fontFamily: fonts.rounded,
                fontWeight: '700'
              }
            ]}>
              {task.completed ? '✅' : (isFocusing ? '🎯' : t('tasks.focus'))}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
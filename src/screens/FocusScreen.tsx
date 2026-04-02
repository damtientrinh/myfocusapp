import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Firebase
import { db } from '@/config/firebaseConfig';
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";

// Context & Hooks
import { useAppContext } from '@/context/AppContext';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTaskLogic } from '../hooks/useTaskLogic';

// Components
import { SuccessConfetti } from '@/components/common/SuccessConfetti';
import { GradientLoader } from '@/components/pomodoro/GradientLoader';
import { ModeSelector } from '@/components/pomodoro/ModeSelector';
import { QuoteDisplay } from '@/components/pomodoro/QuoteDisplay';
import { styles } from '@/styles/PomodoroStyles';

export default function FocusScreen() {
  const { t } = useTranslation();
  const { selectedTaskId, isDarkMode, user, incrementTaskPomodoro } = useAppContext();
  const { 
    time, isActive, mode, pomodoroCount, setIsActive, changeMode, 
    formatTime, totalSeconds, handleFinishTask,
  } = usePomodoro();

  const { taskList } = useTaskLogic();
  const [showConfetti, setShowConfetti] = useState(false);

  const activeTask = useMemo(() => 
    taskList.find(t => t.id === selectedTaskId), [taskList, selectedTaskId]);

  // 1. Logic màu sắc dạng Mảng [Màu chính, Màu phụ] để làm Gradient
  const modeColors: [string, string] = useMemo(() => {
    if (mode === 'WORK') {
      return isDarkMode ? ['#7F1D1D', '#B91C1C'] : ['#F55656', '#FF8A80'];
    }
    const isShort = mode === 'SHORT_BREAK';
    if (isDarkMode) {
      return isShort ? ['#064E3B', '#059669'] : ['#082063', '#1D4ED8'];
    }
    return isShort ? ['#4CAF50', '#81C784'] : ['#408ece', '#64B5F6']; 
  }, [mode, isDarkMode]);

  // Màu nền Container (Lấy màu đầu tiên trong mảng)
  const animatedContainer = useAnimatedStyle(() => ({
    backgroundColor: withTiming(modeColors[0], { duration: 1000 }) 
  }));

  // 2. Lưu kết quả
  const savePomodoroSession = async () => {
    if (mode !== 'WORK' || !user) return;
    try {
      await addDoc(collection(db, "sessions"), {
        userId: user.id,
        userName: user.name || "User",
        taskText: activeTask?.text || "Tập trung tự do",
        duration: Math.floor(totalSeconds / 60), 
        createdAt: serverTimestamp(),
      });
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { totalMinutes: increment(Math.floor(totalSeconds / 60)) });
      if (selectedTaskId) incrementTaskPomodoro(selectedTaskId);
    } catch (error) { console.error("Lỗi lưu dữ liệu:", error); }
  };
  
  useEffect(() => {
    if (time === 0 && isActive) {
      setIsActive(false);
      setShowConfetti(true);
      savePomodoroSession();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); 
    }
  }, [time, isActive]);

  const progress = time / totalSeconds; // 1 -> 0

  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <QuoteDisplay mode={mode} pomodoroCount={pomodoroCount} />
      
      {/* Cập nhật ModeSelector với màu accent */}
      <ModeSelector 
        mode={mode} 
        changeMode={changeMode} 
        accentColors={modeColors}
        labels={{
          WORK: t('pomodoro.modes.work'),
          SHORT_BREAK: t('pomodoro.modes.short_break'),
          LONG_BREAK: t('pomodoro.modes.long_break')
        }}
      />
      
      <View style={styles.circleContainer}>
        {/* Cập nhật GradientLoader với mảng màu colors */}
        <GradientLoader 
          isActive={isActive} 
          progress={progress} 
          colors={modeColors} 
        />
        <View style={[
          styles.innerCircle, 
          { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)' }
        ]}>
          <Text style={styles.timeText}>{formatTime(time)}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsActive(!isActive);
          }}
        >
          {/* Chữ Start/Pause đổi màu theo Mode chính */}
          <Text style={[styles.buttonText, { color: modeColors[0] }]}>
            {isActive ? t('pomodoro.pause') : t('pomodoro.start')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'rgba(255,255,255,0.2)' }]} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsActive(false); 
            changeMode(mode); 
          }}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>{t('pomodoro.reset')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskInfoArea}>
        {activeTask && (
          <View style={styles.activeTaskBadge}>
            <Text style={styles.activeTaskText}>
              {t('pomodoro.working_on', { task: activeTask.text })}
            </Text>
          </View>
        )}

        {selectedTaskId && (
          <TouchableOpacity 
            style={styles.finishTaskBtn} 
            onPress={() => handleFinishTask(() => setShowConfetti(true))}
          >
            <Ionicons name="checkmark-done" size={20} color='#7ee794' />
            <Text style={styles.activeTaskText}>{t('pomodoro.finish_task')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <SuccessConfetti 
        isActive={showConfetti} 
        onAnimationEnd={() => setShowConfetti(false)} 
      />

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {t('pomodoro.sessions', { count: pomodoroCount })}
        </Text>
      </View>
    </Animated.View>
  );
}
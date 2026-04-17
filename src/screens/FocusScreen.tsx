import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Firebase
import { db } from '@/config/firebaseConfig';
import { addDoc, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from "firebase/firestore";

// Context & Hooks
import { useAppContext } from '@/context/AppContext';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTaskLogic } from '../hooks/useTaskLogic';

// Components
import { SuccessConfetti } from '@/components/common/SuccessConfetti';
import { GradientLoader } from '@/components/pomodoro/GradientLoader';
import { ModeSelector } from '@/components/pomodoro/ModeSelector';
import { QuoteDisplay } from '@/components/pomodoro/Quotes';
import { styles } from '@/styles/PomodoroStyles';

import { Colors } from '../constants/theme';

import { MusicControl } from '../components/common/MusicControl';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Hiện banner thông báo
    shouldPlaySound: true, // Phát âm thanh
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior),
});

export default function FocusScreen() {
  const { t } = useTranslation();
  const { taskId, roomId } = useLocalSearchParams();
  const { 
    selectedTaskId, setSelectedTaskId, 
    isDarkMode, user, incrementTaskPomodoro } = useAppContext();
  const { 
    time, isActive, mode, pomodoroCount, setIsActive, changeMode, 
    formatTime, totalSeconds, handleFinishTask,
  } = usePomodoro();

  const { taskList } = useTaskLogic();
  const [showConfetti, setShowConfetti] = useState(false);

  const [roomData, setRoomData] = useState<any>(null);

  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hết giờ rồi Bạn ơi! 🍅",
        body: "Bạn đã hoàn thành một phiên tập trung xuất sắc.",
        sound: true,
      },
      trigger: null, // Gửi ngay lập tức
    });
  };

  // Đồng bộ Task từ Params ---
  useEffect(() => {
    if (taskId && taskId !== selectedTaskId) {
      setSelectedTaskId(taskId as string);
      
      // setIsActive(true); 
    }
  }, [taskId]);

  const activeTask = useMemo(() => 
    taskList.find(t => t.id === (taskId || selectedTaskId)), 
  [taskList, selectedTaskId]);

  const { isMuted, setIsMuted, nextTrack, currentTrackTitle } = useMusicPlayer(isActive);

  // 1. Logic màu sắc dạng Mảng [Màu chính, Màu phụ] cho Gradient
  const modeColors: [string, string] = useMemo(() => {
    const theme = isDarkMode ? Colors.dark : Colors.light;

    switch (mode) {
      case 'WORK':
        return [theme.primary, theme.accentGradient]; 

      case 'SHORT_BREAK':
        return [theme.secondary, theme.longBreakGradient];

      case 'LONG_BREAK':
        return [theme.longBreak, theme.primaryGradient];

      default:
        return [theme.primary, theme.accent];
    }
  }, [mode, isDarkMode]);

  // Màu nền Container (Lấy màu đầu tiên trong mảng)
  const animatedContainer = useAnimatedStyle(() => ({
    backgroundColor: withTiming(modeColors[0], { duration: 1000 }) 
  }));

  useEffect(() => {
    if (roomId) {
      const fetchRoomInfo = async () => {
        try {
          const roomRef = doc(db, "rooms", roomId as string);
          const snap = await getDoc(roomRef);
          if (snap.exists()) {
            setRoomData(snap.data());
          }
        } catch (e) {
          console.error("Lỗi lấy thông tin phòng:", e);
        }
      };
      fetchRoomInfo();
    }
  }, [roomId]);

  // 2. Lưu kết quả
  const savePomodoroSession = async () => {
    if (mode !== 'WORK' || !user) return;
    try {
      const currentTaskText = activeTask?.text || "Tập trung tự do";
      const currentTaskId = activeTask?.id || selectedTaskId;

      await addDoc(collection(db, "sessions"), {
        userId: user.uid,
        userName: user.name || "User",
        taskText: activeTask?.text || "Tập trung tự do",
        duration: Math.floor(totalSeconds / 60), 
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { 
        totalMinutes: increment(Math.floor(totalSeconds / 60)) 
      });
      
      if (currentTaskId) incrementTaskPomodoro(currentTaskId);
    } catch (error) { console.error("Lỗi lưu dữ liệu:", error); }
  };
  
  useEffect(() => {
    if (time === 0 && isActive) {
      setIsActive(false);
      setShowConfetti(true);
      savePomodoroSession();
      sendLocalNotification();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); 
    }
  }, [time, isActive]);

  const progress = time / totalSeconds; // 1 -> 0

  const handleConfettiEnd = useCallback(() => {
    setShowConfetti(false)
  }, []);


  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      {/* <QuoteDisplay mode={mode} pomodoroCount={pomodoroCount} /> */}

      <View style={{ marginTop: 40, alignItems: 'center' }}>
        {roomData ? (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
              🏫 {roomData.name}
            </Text>
            <Text style={{ color: '#fff', opacity: 0.8, fontSize: 12, textAlign: 'center' }}>
              {t('create_room.topic_label')}: {roomData.topic}
            </Text>
          </View>
        ) : (
          <QuoteDisplay mode={mode} pomodoroCount={pomodoroCount} />
        )}
      </View>
      
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
        <GradientLoader 
          isActive={isActive} 
          progress={progress} 
          colors={modeColors} 
          isDarkMode={isDarkMode}
        />
        <View style={[
          styles.innerCircle, 
          { 
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)'
          }
        ]}>
          <Text style={styles.timeText}>{formatTime(time)}</Text>
          <Text style={{ color: '#fff', opacity: 0.6, fontSize: 12, fontWeight: '600' }}>
            {mode === 'WORK' ? 'FOCUS' : 'REST'}
          </Text>
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
          {/* <Ionicons name={isActive ? "pause" : "play"} size={24} color={modeColors[0]} /> */}
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
        {activeTask ? (
          <View style={styles.activeTaskBadge}>
            <Text style={styles.activeTaskText}>
              {t('pomodoro.working_on', { task: activeTask.text })}
            </Text>
          </View>
        ) : roomData ? (
          <View style={styles.activeTaskBadge}>
            <Text style={styles.activeTaskText}>
              🔥 {t('room_detail.online_members')}: Đang học nhóm
            </Text>
          </View>
        ) : (
          <View style={styles.activeTaskBadge}>
            <Text style={styles.activeTaskText}>⏳ {t('pomodoro.modes.work')}</Text>
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

      <View style={{ marginVertical: 10, alignItems: 'center' }}>
        <MusicControl 
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          nextTrack={nextTrack}
          title={currentTrackTitle}
          isDarkMode={isDarkMode}
          isActive={isActive}
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {t('pomodoro.sessions', { count: pomodoroCount })}
        </Text>
      </View>

      <SuccessConfetti 
        isActive={showConfetti} 
        onAnimationEnd={() => handleConfettiEnd} 
      />
    </Animated.View>
  );
}
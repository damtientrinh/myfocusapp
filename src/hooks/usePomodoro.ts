import { updateUserFocusTime } from '../components/services/userService';
import { useAppContext } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSharedValue } from 'react-native-reanimated';

import { useTaskLogic } from './useTaskLogic';

export const MODES = {
  WORK: 25 * 1,
  SHORT_BREAK: 5 * 1,
  LONG_BREAK: 15 * 1,
};

export const usePomodoro = () => {
  const { 
    selectedTaskId, incrementTaskPomodoro, customWorkTime,
    setSelectedTaskId, user
  } = useAppContext();
  
  const { toggleTask } = useTaskLogic();
  const { t } = useTranslation();

  const [time, setTime] = useState(customWorkTime * 1);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'>('WORK');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const colorProgress = useSharedValue(0);
  const [totalSeconds, setTotalSeconds] = useState(customWorkTime * 1);

  // 1. Hàm đổi chế độ (Dùng cho ModeSelector)
  const changeMode = (newMode: keyof typeof MODES) => {
    setIsActive(false);
    setMode(newMode);
    const newTotal = newMode === 'WORK' ? customWorkTime * 1 : MODES[newMode];
    setTime(newTotal);
    setTotalSeconds(newTotal);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 2. Đồng bộ Setting khi người dùng chỉnh ở Tab Setting
  useEffect(() => {
    if (mode === 'WORK' && !isActive && time === totalSeconds) {
      const newSeconds = customWorkTime * 1;
      setTime(newSeconds);
      setTotalSeconds(newSeconds);
    }
  }, [customWorkTime, mode, isActive]);

  // 3. Bộ đếm giây (Interval)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } 

    return () => clearInterval(interval);
  }, [isActive]); 

  // 4. Xử lý logic khi đồng hồ về 0
  useEffect(() => {
    if (time === 0 && isActive) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const finishPhase = async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: mode === 'WORK' ? t('pomodoro.work_done') : t('pomodoro.break_done'),
            body: mode === 'WORK' ? t('pomodoro.work_body') : t('pomodoro.break_body'),
            sound: true,
          },
          trigger: null,
        });

        if (mode === 'WORK') {
          const minutesEarned = Math.floor((customWorkTime * 1) / 60);
          
          // Gửi lên Firebase
          try {
             await updateUserFocusTime(25);
             console.log("Đã cập nhật bảng xếp hạng thành công!");
          } catch (error) {
             console.error("Lỗi cập nhật xếp hạng:", error);
          }
          
          const nextCount = pomodoroCount + 1;
          setPomodoroCount(nextCount);
          const nextMode = nextCount % 4 === 0 ? 'LONG_BREAK' : 'SHORT_BREAK';
          changeMode(nextMode);
        } else {
          changeMode('WORK');
        }
      };

      finishPhase();
    }
  }, [time, isActive]);

  // 5. Hàm hoàn thành Task thủ công (Nút tích xanh)
  const handleFinishTask = async (onSuccess?: () => void) => {
    if (!selectedTaskId) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    
    const secondsWorked = totalSeconds - time; 
    const minutesToUpdate = Math.max(1, Math.floor(secondsWorked / 60)); 

    const targetId = selectedTaskId;
    setSelectedTaskId(null); 
    setIsActive(false);

    // Reset thời gian
    const resetTime = mode === 'WORK' ? customWorkTime * 1 : MODES[mode];
    setTime(resetTime);
    setTotalSeconds(resetTime);

    setTimeout(async () => {
      try {
        // 1. Cập nhật trạng thái Task
        await toggleTask(targetId, true);

        // 2. Phải gọi cập nhật điểm ở đây thì BXH mới nhảy
        if (mode === 'WORK') {
           await updateUserFocusTime(1); // Hoặc truyền minutesToUpdate vào
           console.log("Đã cập nhật điểm từ nút hoàn thành Task!");
        }

        if (onSuccess) onSuccess();
      } catch (e) {
        console.error("Lỗi hoàn thành task:", e);
      }
    }, 500);
  };

  return {
    time, isActive, mode, pomodoroCount, colorProgress,
    setIsActive, changeMode, formatTime, totalSeconds,
    handleFinishTask,
  };
};
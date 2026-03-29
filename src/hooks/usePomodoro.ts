import { useAppContext } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { InteractionManager } from 'react-native';

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
      // Logic này sẽ được FocusScreen bắt được và gọi savePomodoroSession()
      // Ở đây ta chỉ xử lý chuyển Mode tự động cho người dùng
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

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('pomodoro.finish_title', 'Tuyệt vời!'), 
        body: t('pomodoro.finish_body', 'Bạn đã hoàn thành một nhiệm vụ.'),   
        sound: true,
      },
      trigger: null,
    });

    const targetId = selectedTaskId;
    setSelectedTaskId(null); 
    setIsActive(false);

    // Reset thời gian về ban đầu
    const resetTime = mode === 'WORK' ? customWorkTime * 1 : MODES[mode];
    setTime(resetTime);
    setTotalSeconds(resetTime);

    // Đợi hiệu ứng UI xong rồi mới update DB (Tránh lag)
    setTimeout(async () => {
      try {
        await toggleTask(targetId);

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
import * as Haptics from 'expo-haptics';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';

// Import Firebase
import {
  addDoc, collection, deleteDoc, doc,
  serverTimestamp, updateDoc, increment
} from "firebase/firestore";
import { db } from '../config/firebaseConfig';

export const useTaskLogic = () => {
  const { 
    taskList, incrementTaskPomodoro, 
    selectedTaskId, setSelectedTaskId, user 
  } = useAppContext();
  
  const { t } = useTranslation();
  const [taskText, setTaskText] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 10 * 60 * 1000));
  const [toastMsg, setToastMsg] = useState('');

  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // 1. THÊM TASK MỚI
  const addTask = async () => {
    if (!taskText.trim()) return;
    if (!user?.uid) {
      Alert.alert(t('common.error'), t('tasks.login_required'));
      return;
    }
    
    try {
      const newTask = {
        userId: user.uid, 
        text: taskText.trim(),
        completed: false,
        pomodoroCount: 0,
        reminderDate: date.toISOString(),
        notificationId: null, 
        createdAt: serverTimestamp(), 
      };

      await addDoc(collection(db, "tasks"), newTask);

      setTaskText('');
      setDate(new Date(Date.now() + 10 * 60 * 1000));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showToast(t('tasks.toast_added'));
      
    } catch (error) {
      console.error("Lỗi thêm task:", error);
      Alert.alert("Lỗi", "Không thể kết nối với máy chủ.");
    }
  };

  // 2. CẬP NHẬT TRẠNG THÁI TASK (DONE/UNCHECK)
  const toggleTask = async (id: string, forceStatus?: boolean) => {
    try {
      const taskRef = doc(db, "tasks", id);

      let nextStatus: boolean;
      if (forceStatus !== undefined) {
        nextStatus = forceStatus;
      } else {
        const task = taskList.find(t => t.id === id);
        nextStatus = !task?.completed;
      }

      await updateDoc(taskRef, { completed: nextStatus });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) { 
      console.error(error); 
    }
  };

  // 3. XÓA TASK
  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      if (id === selectedTaskId) setSelectedTaskId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) { 
      console.error(error); 
    }
  };

  // 4. CẬP NHẬT PHIÊN LÊN FIRESTORE KHI HOÀN THÀNH POMODORO
  const completePomodoroSession = async (taskId: string | null) => {
    if (!user?.uid) return;

    try {
      if (taskId) {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
          pomodoroCount: increment(1)
        });
        incrementTaskPomodoro(taskId);
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        totalSessions: increment(1),
        totalMinutes: increment(25) 
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(t('pomodoro.work_done'));
    } catch (error) {
      console.error("Lỗi cập nhật phiên Pomodoro:", error);
    }
  };

  return {
    taskText, setTaskText, date, setDate, toastMsg, setToastMsg,
    addTask, toggleTask, deleteTask, taskList,
    completePomodoroSession, 
  };
};
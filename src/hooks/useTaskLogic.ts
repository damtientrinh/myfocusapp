import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';

// Import Firebase
import {
  addDoc, collection, deleteDoc, doc,
  serverTimestamp, updateDoc
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

  const showToast = (msg: string) => {
    setToastMsg(msg);
    // Nên có logic reset toast sau vài giây
    setTimeout(() => setToastMsg(''), 3000);
  };

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

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      if (id === selectedTaskId) setSelectedTaskId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) { 
      console.error(error); 
    }
  };

  return {
    taskText, setTaskText, date, setDate, toastMsg, setToastMsg,
    addTask, toggleTask, deleteTask, taskList,
    incrementPomodoro: incrementTaskPomodoro, 
  };
};
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

    // Ưu tiên dùng user từ Context đã được xử lý ổn định
    if (!user?.uid) {
      Alert.alert(t('common.error'), t('tasks.login_required'));
      return;
    }

    try {
      // 1. Chỉ chuẩn bị dữ liệu sạch để đẩy lên Firebase
      const newTask = {
        userId: user.uid, 
        text: taskText.trim(),
        completed: false,
        pomodoroCount: 0,
        reminderDate: date.toISOString(),
        notificationId: null, // Tạm thời để null hoặc logic thông báo của bạn
        createdAt: serverTimestamp(), // Để Server tự quyết định thời gian
      };

      // 2. Đẩy lên Firebase - Dừng tại đây, không cần setTaskList thủ công
      // Vì onSnapshot trong AppContext sẽ tự động "ngửi" thấy task mới và cập nhật UI cho bạn
      await addDoc(collection(db, "tasks"), newTask);

      // 3. Dọn dẹp UI local
      setTaskText('');
      setDate(new Date(Date.now() + 10 * 60 * 1000));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showToast(t('tasks.toast_added'));
      
    } catch (error) {
      console.error("Lỗi thêm task:", error);
      Alert.alert("Lỗi", "Không thể kết nối với máy chủ.");
    }
  };

  // Các hàm toggleTask và deleteTask cũng nên bỏ setTaskList thủ công 
  // để tránh xung đột với Real-time snapshot
  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !currentStatus });
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
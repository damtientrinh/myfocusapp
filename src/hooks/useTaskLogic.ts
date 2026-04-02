import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { Task, useAppContext } from '../context/AppContext';

// Import Firebase
import {
  addDoc, collection, deleteDoc, doc,
  serverTimestamp, updateDoc
} from "firebase/firestore";
import { db } from '../config/firebaseConfig';

export const useTaskLogic = () => {
  const { 
    taskList, setTaskList, incrementTaskPomodoro, 
    selectedTaskId, setSelectedTaskId, user 
  } = useAppContext();
  
  const { t } = useTranslation();
  const [taskText, setTaskText] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 10 * 60 * 1000));
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  // --- HÀM LÊN LỊCH THÔNG BÁO ---
  const scheduleNotification = async (taskName: string, scheduledDate: Date) => {
    if (scheduledDate <= new Date()) return null;
    try {
      // Ép kiểu 'as any' ở đây để bỏ qua lỗi priority gạch đỏ
      const content: any = { 
        title: t('tasks.notif_title', 'Nhắc nhở công việc'), 
        body: t('tasks.notif_body', { task: taskName }), 
        sound: true,
        android: {
          importance: Notifications.AndroidImportance.MAX,
          priority: 'max',
        },
        ios: {
          sound: true,
        }
      };

      return await Notifications.scheduleNotificationAsync({
        content,
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.DATE, 
          date: scheduledDate 
        } as any, // Ép kiểu trigger để tránh lỗi DATE type
      });
    } catch (e) {
      console.warn("Lỗi hẹn giờ thông báo:", e);
      return null;
    }
  };

  // --- HÀM THÊM TASK ---
  const addTask = async () => {
    // 1. Kiểm tra user chặt chẽ hơn
    if (!taskText.trim()) return;
    if (!user) {
      Alert.alert(t('common.error'), t('tasks.login_required', 'Bạn cần đăng nhập để thêm task'));
      return;
    }

    try {
      const currentUserId = (user as any).uid || (user as any).id;
      if (!currentUserId) throw new Error("User ID is missing");

      // 2. Lên lịch thông báo trước
      const notificationId = await scheduleNotification(taskText, date);
      
      // 3. Chuẩn bị dữ liệu Task local trước để render ngay lập tức (Optimistic UI)
      const newTaskData = {
        userId: currentUserId, 
        text: taskText.trim(),
        completed: false,
        pomodoroCount: 0,
        reminderDate: date.toISOString(),
        notificationId: notificationId || null,
        createdAt: new Date().toISOString(), // Dùng string ISO để đồng bộ với state hiện tại
      };

      // 4. Đẩy lên Firebase
      const docRef = await addDoc(collection(db, "tasks"), {
        ...newTaskData,
        createdAt: serverTimestamp(), // Ghi đè bằng timestamp của server
      });

      // 5. Cập nhật State cục bộ NGAY LẬP TỨC
      const taskForState = { 
        ...newTaskData,
        id: docRef.id,
      } as Task;

      // Dùng hàm updater để đảm bảo không bị ghi đè state cũ
      setTaskList(prev => [taskForState, ...prev]); 
      
      // 6. Dọn dẹp UI
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showToast(t('tasks.toast_added', '🚀 Đã thêm nhiệm vụ!'));
      
      setTaskText(''); // Chỉ xoá text khi mọi thứ đã xong
      // Keyboard.dismiss(); // Tạm thời comment cái này để Trình test xem phím có bị nhảy không
      setDate(new Date(Date.now() + 10 * 60 * 1000));
      
    } catch (error) {
      console.error("Lỗi thêm task chi tiết:", error);
      Alert.alert("Lỗi", "Không thể thêm task. Vui lòng kiểm tra kết nối mạng.");
    }
  };

  // Các hàm toggleTask và deleteTask giữ nguyên logic nhưng ép kiểu ID nếu cần
  const toggleTask = async (id: string) => {
    const task = (taskList as Task[]).find(t => t.id === id);
    if (!task) return;
    const newStatus = !task.completed;
    try {
      await updateDoc(doc(db, "tasks", id), { completed: newStatus });
      setTaskList(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));
      if (newStatus) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (task.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(task.notificationId);
        }
      }
      showToast(newStatus ? t('tasks.toast_completed') : t('tasks.toast_uncheck'));
    } catch (error) { console.error(error); }
  };

  const deleteTask = async (id: string) => {
    const taskToDelete = (taskList as Task[]).find(t => t.id === id);
    if (!taskToDelete) return;
    const proceedDelete = async () => {
      try {
        await deleteDoc(doc(db, "tasks", id));
        if (taskToDelete.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
        }
        if (id === selectedTaskId) setSelectedTaskId(null);
        setTaskList(prev => prev.filter(t => t.id !== id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
        showToast(t('tasks.toast_deleted'));
      } catch (error) { console.error(error); }
    };

    if (id === selectedTaskId) {
      Alert.alert(t('tasks.delete_focus_title'), t('tasks.delete_focus_msg'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: proceedDelete }
      ]);
    } else {
      proceedDelete();
    }
  };

  return {
    taskText, setTaskText, taskList, date, setDate, toastMsg, setToastMsg,
    addTask, toggleTask, deleteTask,
    incrementPomodoro: incrementTaskPomodoro, 
  };
};
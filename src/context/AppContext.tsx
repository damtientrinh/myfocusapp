import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import i18n from '@/locales/i18n';

// Firebase
import { db } from '@/api/firebaseConfig';
import { 
  collection, doc, getDocs, increment, orderBy, 
  query, updateDoc, where, writeBatch, addDoc, deleteDoc, serverTimestamp 
} from "firebase/firestore";

// Constants & Theme
import { Colors, Fonts, Spacing } from '../constants/theme';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  pomodoroCount: number;
  userId: string;
  createdAt?: any;
  reminderDate?: string;     
  notificationId?: string | null;
}

interface User {
  id: string; 
  name: string;
  email: string;
  token?: string;
}

interface AppContextType {
  // Task Data
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  
  // Task Actions
  addTask: (text: string) => Promise<void>;
  toggleTaskComplete: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  incrementTaskPomodoro: (id: string) => Promise<void>;
  clearAllTasks: () => void;
  refreshTasks: () => Promise<void>;

  // Theme & Settings
  theme: typeof Colors.light;
  fonts: typeof Fonts;
  spacing: typeof Spacing;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  customWorkTime: number;
  setCustomWorkTime: (val: number) => void;
  language: string;
  setLanguage: (lang: string) => void;
  resetSettings: () => void;

  // User & Auth
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  isLoaded: boolean; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [language, setLanguageState] = useState('vi');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customWorkTime, setCustomWorkTime] = useState(25);
  const [isLoaded, setIsLoaded] = useState(false); 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const theme = isDarkMode ? Colors.dark : Colors.light;

  // --- 1. KHỞI TẠO APP ---
  useEffect(() => {
    const initApp = async () => {
      try {
        const [savedUser, savedTime, savedLang, savedTheme] = await Promise.all([
          AsyncStorage.getItem('@user_data'),
          AsyncStorage.getItem('@custom_work_time'),
          AsyncStorage.getItem('@app_language'),
          AsyncStorage.getItem('@is_dark_mode'),
        ]);

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedTime) setCustomWorkTime(JSON.parse(savedTime));
        if (savedTheme) setIsDarkMode(JSON.parse(savedTheme));
        if (savedLang) {
          setLanguageState(savedLang);
          i18n.changeLanguage(savedLang);
        }
      } catch (e) { 
        console.error("Lỗi khởi tạo App:", e); 
      } finally {
        setIsLoaded(true);
      }
    };
    initApp();
  }, []);

  // --- 2. TỰ ĐỘNG LƯU CÀI ĐẶT ---
  useEffect(() => {
    if (isLoaded) {
      const saveData = async () => {
        await AsyncStorage.setItem('@custom_work_time', JSON.stringify(customWorkTime));
        await AsyncStorage.setItem('@is_dark_mode', JSON.stringify(isDarkMode));
        if (user) {
          await AsyncStorage.setItem('@user_data', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('@user_data');
        }
      };
      saveData();
    }
  }, [user, customWorkTime, isDarkMode, isLoaded]);

  // --- 3. QUẢN LÝ TASKS TỪ FIREBASE ---
  const refreshTasks = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "tasks"), 
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Task));
      setTaskList(tasks);
    } catch (e) {
      console.error("Lỗi lấy task:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) refreshTasks();
    else setTaskList([]);
  }, [user]);

  // --- 4. CÁC HÀM LOGIC NGHIỆP VỤ ---

  const addTask = async (text: string) => {
    if (!user) return;
    try {
      const newTaskData = {
        text,
        completed: false,
        pomodoroCount: 0,
        userId: user.id,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "tasks"), newTaskData);
      
      // Update UI local để user thấy nhanh (Optimistic UI)
      const newTask = { id: docRef.id, ...newTaskData, createdAt: new Date() } as Task;
      setTaskList(prev => [newTask, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error("Lỗi thêm task:", e);
    }
  };

  const toggleTaskComplete = async (id: string, currentStatus: boolean) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !currentStatus });
      setTaskList(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái:", e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTaskList(prev => prev.filter(t => t.id !== id));
      if (selectedTaskId === id) setSelectedTaskId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.error("Lỗi xóa task:", e);
    }
  };

  const incrementTaskPomodoro = async (id: string) => {
    if (!user) return;
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { pomodoroCount: increment(1) });
      setTaskList(prev => prev.map(t => 
        t.id === id ? { ...t, pomodoroCount: (t.pomodoroCount || 0) + 1 } : t
      ));
    } catch (e) { 
      console.error("Lỗi tăng Pomodoro:", e); 
    }
  };

  const clearAllTasks = async () => {
    if (!user || taskList.length === 0) return;
    Alert.alert(t('common.confirm'), t('tasks.delete_all_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { 
        text: t('common.delete'), 
        style: 'destructive', 
        onPress: async () => {
          try {
            const batch = writeBatch(db);
            taskList.forEach(task => batch.delete(doc(db, "tasks", task.id)));
            await batch.commit();
            setTaskList([]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } catch (e) { console.error("Lỗi xóa tất cả:", e); }
        }
      }
    ]);
  };

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('@app_language', lang);
  };

  const logout = async () => {
    setUser(null);
    setTaskList([]);
    setSelectedTaskId(null);
    setIsDarkMode(false); // Reset theme về mặc định khi logout
    await AsyncStorage.removeItem('@user_data');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const resetSettings = () => {
    setCustomWorkTime(25);
    setIsDarkMode(false);
    setLanguage('vi');
    Alert.alert(t('settings.reset_success'), t('settings.reset_success_msg'));
  };

  return (
    <AppContext.Provider value={{ 
      taskList, setTaskList, selectedTaskId, setSelectedTaskId,
      addTask, toggleTaskComplete, deleteTask,
      incrementTaskPomodoro, clearAllTasks, refreshTasks,
      theme, fonts: Fonts, spacing: Spacing, isDarkMode, setIsDarkMode,
      customWorkTime, setCustomWorkTime, language, setLanguage, resetSettings,
      user, setUser, logout, loading, isLoaded 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
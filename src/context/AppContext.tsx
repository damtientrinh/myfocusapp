import i18n from '@/locales/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

// Firebase
import { auth, db } from '@/config/firebaseConfig';
import { signOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  query, updateDoc, where, writeBatch
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
  uid: string; 
  name: string;
  email: string;
  displayName?: string | null;
  photoURL?: string;
  totalMinutes?: number;
  totalSessions?: number;
  currentStreak?: number;
  isPro?: boolean;
  birthday?: string;
  gender?: string;
  job?: string;
}

interface AppContextType {
  // Task Data
  taskList: Task[];
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  
  // Task Actions
  // addTask: (text: string) => Promise<void>;
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

  const completePomodoroSession = async (minutes: number) => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        totalMinutes: increment(minutes),
        totalSessions: increment(1),
      });
    } catch (e) {
      console.error("Lỗi cập nhật Firestore:", e);
    }
  };

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
        try {
        await AsyncStorage.setItem('@custom_work_time', JSON.stringify(customWorkTime));
        await AsyncStorage.setItem('@is_dark_mode', JSON.stringify(isDarkMode));
        
        // CHỈ LƯU NẾU CÓ USER, KHÔNG TỰ Ý REMOVE Ở ĐÂY
        if (user) {
          await AsyncStorage.setItem('@user_data', JSON.stringify(user));
        }
      } catch (e) {
        console.error("Lỗi lưu cache:", e);
      }
    };
      saveData();
    }
  }, [user, customWorkTime, isDarkMode, isLoaded]);

  // --- 3. QUẢN LÝ TASKS REAL-TIME TỪ FIREBASE ---
  useEffect(() => {
    // Chỉ chạy khi đã load xong dữ liệu từ AsyncStorage và có user
    if (!isLoaded || !user?.uid) {
      if (isLoaded && !user) setTaskList([]);
      return;
    }

    setLoading(true);
    console.log("Đang lắng nghe task cho UID:", user.uid);

    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", user.uid),
      // orderBy("createdAt", "desc")
    );

    // Thêm option { includeMetadataChanges: true } để bắt được dữ liệu từ Cache
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Task;
      });
      
      console.log(`Đã cập nhật ${tasks.length} tasks từ ${querySnapshot.metadata.fromCache ? 'Cache' : 'Server'}`);
      
      setTaskList(tasks);
      
      // Tắt loading khi đã có dữ liệu (kể cả từ cache)
      setLoading(false);
    }, (error) => {
      console.error("Lỗi Firestore chi tiết:", error);
      setLoading(false);
      // Nếu lỗi do thiếu Index, Firebase sẽ in ra Link ở đây
    });

    return () => unsubscribe();
  }, [user?.uid, isLoaded]); 

  // --- 4. LẮNG NGHE DỮ LIỆU USER CHI TIẾT TỪ FIRESTORE ---
  useEffect(() => {
    let unsubscribe: () => void;

    if (isLoaded && user?.uid) {
      console.log("Đang lắng nghe dữ liệu chi tiết cho User:", user.uid);
      
      const userDocRef = doc(db, "users", user.uid);
      
      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          // Gộp dữ liệu từ Auth (hoặc Cache) với dữ liệu từ Firestore
          setUser(prev => prev ? { ...prev, ...firestoreData } : null);
        } else {
          console.log("User chưa có document trên Firestore, có thể cần khởi tạo.");
        }
      }, (error) => {
        console.error("Lỗi lắng nghe User Firestore:", error);
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [user?.uid, isLoaded]);


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

  const refreshTasks = async () => {
    setLoading(true);
    // Thực tế onSnapshot sẽ tự lo, nhưng việc set loading này giúp UI hiện Feedback 
    // khi người dùng cố tình muốn "kiểm tra" lại dữ liệu.
    setTimeout(() => setLoading(false), 500); 
  };

  const logout = async () => {
    try {
      // 2. PHẢI CÓ DÒNG NÀY để Firebase thực sự đăng xuất
      await signOut(auth);
      // Xóa trắng cả cài đặt nếu muốn sạch sẽ hoàn toàn
      await AsyncStorage.removeItem('@user_data'); 

      // 3. Sau đó mới dọn dẹp local data
      setUser(null);
      setTaskList([]);
      setSelectedTaskId(null);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log("Đã đăng xuất Firebase và xóa session thành công!");
    } catch (e) {
      console.error("Lỗi khi đăng xuất:", e);
      Alert.alert("Lỗi", "Không thể đăng xuất lúc này, vui lòng thử lại.");
    }
  };

  const resetSettings = () => {
    setCustomWorkTime(25);
    setIsDarkMode(false);
    setLanguage('vi');
    Alert.alert(t('settings.reset_success'), t('settings.reset_success_msg'));
  };


  return (
    <AppContext.Provider value={{ 
      taskList, 
      setTaskList, 
      selectedTaskId, 
      setSelectedTaskId,
      toggleTaskComplete, 
      deleteTask,
      incrementTaskPomodoro, 
      clearAllTasks, 
      refreshTasks: async () => { setLoading(true); setTimeout(()=>setLoading(false), 300); }, 
      theme, 
      fonts: Fonts, 
      spacing: Spacing, 
      isDarkMode, 
      setIsDarkMode,
      customWorkTime, 
      setCustomWorkTime, 
      language, 
      setLanguage, 
      resetSettings,
      user, 
      setUser, 
      logout, 
      loading, 
      isLoaded
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
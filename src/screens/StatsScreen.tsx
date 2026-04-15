import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text, TouchableOpacity, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatCards } from '@/components/stat/StatCards';
import { StatsChart } from '@/components/stat/StatChart';
import { TaskDetailList } from '@/components/stat/TaskList';
import { styles } from '@/styles/StatsStyles';

import { useAppContext } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  // Chỉ lấy những gì AppContext thực sự cung cấp
  const { taskList, clearAllTasks, theme, isLoaded, loading, refreshTasks } = useAppContext();
  const { t } = useTranslation();

  // 1. Tối ưu tính toán Stats (Dùng useMemo để không tính lại khi cuộn trang)
  const stats = useMemo(() => {
    const safeList = taskList || [];
    const totalPomodoros = safeList.reduce((acc, t) => acc + (Number(t.pomodoroCount) || 0), 0);
    const completedTasks = safeList.filter(t => t.completed).length;
    const pendingTasks = Math.max(0, safeList.length - completedTasks);

    return { totalPomodoros, completedTasks, pendingTasks };
  }, [taskList]);

  // 2. Lọc 5 hoạt động gần đây (Sắp xếp theo thời gian ISO String từ Context)
  const recentActivities = useMemo(() => {
    if (!taskList) return [];
    return [...taskList]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Mới nhất lên đầu
      })
      .slice(0, 5);
  }, [taskList]);

  // 3. Tự động refresh nhẹ khi focus vào màn hình
  useFocusEffect(
    useCallback(() => {
      if (refreshTasks) refreshTasks();
    }, [])
  );

  // Hiển thị loading khi đang tải dữ liệu từ Firebase lần đầu
  if (!isLoaded || (loading && taskList.length === 0)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF5252" />
        <Text style={{ color: theme.subText, marginTop: 10 }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      contentContainerStyle={{ 
        paddingTop: insets.top + 10, 
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 16
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={loading} 
          onRefresh={refreshTasks} 
          tintColor="#FF5252" 
        />
      }
    >
      {/* Header */}
      <View style={[styles.headerRow, { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={[styles.header, { color: theme.text, fontSize: 24, fontWeight: '800' }]}>
            {t('stats.header')}
          </Text>
          <Text style={{ color: theme.subText, fontSize: 13 }}>
            {t('stats.subtitle', 'Theo dõi tiến độ học tập')}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={clearAllTasks} 
          style={{ backgroundColor: '#FF525215', padding: 10, borderRadius: 12 }}
        >
          <Ionicons name="trash-outline" size={22} color="#FF5252" />
        </TouchableOpacity>
      </View>

      {/* Thẻ thống kê tổng quát */}
      <StatCards 
        totalPomodoros={stats.totalPomodoros} 
        completedTasks={stats.completedTasks} 
        pendingTasks={stats.pendingTasks} 
      />

      {/* Biểu đồ năng suất */}
      <View style={{ marginTop: 24 }}>
        <Text style={[styles.subHeader, { color: theme.text, fontWeight: '700', marginBottom: 12 }]}>
          {t('stats.productivity_chart')}
        </Text>
        <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 10 }}>
          <StatsChart taskList={taskList} />
        </View>
      </View>

      {/* Danh sách nhiệm vụ chi tiết */}
      <View style={{ marginTop: 24 }}>
        <Text style={[styles.subHeader, { color: theme.text, fontWeight: '700', marginBottom: 12 }]}>
          {t('stats.task_details')}
        </Text>
        <TaskDetailList taskList={taskList} totalPomodoros={stats.totalPomodoros} />
      </View>

      {/* Hoạt động gần đây */}
      <View style={{ marginTop: 24 }}>
        <Text style={[styles.subHeader, { color: theme.text, fontWeight: '700', marginBottom: 12 }]}>
          {t('stats.recent_activity', 'Hoạt động gần đây')}
        </Text>
        
        <View style={{ 
          backgroundColor: theme.card, 
          borderRadius: 20,
          padding: 8,
          borderWidth: 1,
          borderColor: theme.border
        }}>
           {recentActivities.length > 0 ? (
             recentActivities.map((task, index) => (
              <View 
                key={task.id} 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  padding: 12,
                  borderBottomWidth: index === recentActivities.length - 1 ? 0 : 0.5,
                  borderBottomColor: theme.border
                }}
              >
                 <View style={{ 
                   width: 38, height: 38, borderRadius: 12, 
                   backgroundColor: task.completed ? '#4CAF5015' : '#FFA00015',
                   justifyContent: 'center', alignItems: 'center'
                 }}>
                   <Ionicons 
                     name={task.completed ? "checkmark-circle" : "sync-circle"} 
                     size={22} 
                     color={task.completed ? "#4CAF50" : "#FFA000"} 
                   />
                 </View>

                 <View style={{ marginLeft: 12, flex: 1 }}>
                   <Text style={{ color: theme.text, fontWeight: '600' }} numberOfLines={1}>
                     {task.text}
                   </Text>
                   <Text style={{ fontSize: 12, color: theme.subText }}>
                     {task.pomodoroCount} 🍅 • {task.completed ? t('stat_cards.completed') : t('stat_cards.pending')}
                   </Text>
                 </View>
              </View>
             ))
           ) : (
             <View style={{ padding: 40, alignItems: 'center' }}>
                <Ionicons name="leaf-outline" size={40} color={theme.subText} style={{ opacity: 0.3 }} />
                <Text style={{ color: theme.subText, marginTop: 8 }}>{t('task_details.task_empty')}</Text>
             </View>
           )}
        </View>
      </View>
    </ScrollView>
  );
}
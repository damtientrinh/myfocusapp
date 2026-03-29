import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';

import { StatCards } from '@/components/stat/StatCards';
import { StatsChart } from '@/components/stat/StatsChart';
import { styles } from '@/styles/StatsStyles';
import { TaskDetailList } from '@/components/stat/TaskDetailList';

import { useAppContext } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

export default function StatsScreen() {
  const { taskList, clearAllTasks, theme, refreshTasks, isLoaded, loading } = useAppContext();
  const { t } = useTranslation();

  // 1. Tối ưu tính toán Stats - Thêm xử lý lỗi dữ liệu null
  const stats = useMemo(() => {
    const safeList = taskList || [];
    const totalPomodoros = safeList.reduce((acc, t) => acc + (t.pomodoroCount || 0), 0);
    const completedTasks = safeList.filter(t => t.completed).length;
    const pendingTasks = safeList.length - completedTasks;

    return { totalPomodoros, completedTasks, pendingTasks };
  }, [taskList]);

  // 2. Lọc 5 hoạt động gần đây nhất (Sắp xếp theo thời gian tạo)
  const recentActivities = useMemo(() => {
    return [...(taskList || [])]
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 5);
  }, [taskList]);

  const handleReset = () => {
    Alert.alert(
      t('stats.alert_title'),
      t('stats.alert_msg'),
      [
        { text: t('common.cancel'), style: "cancel" },
        { 
          text: t('common.confirm'), 
          style: "destructive", 
          onPress: async () => {
            try {
              await clearAllTasks();
            } catch (e) {
              console.error("Lỗi xóa dữ liệu:", e);
            }
          } 
        }
      ]
    );
  };

  // 3. Tự động làm mới khi quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      if (refreshTasks) refreshTasks();
    }, [])
  );

  // Hiển thị loading xoay tròn nếu lần đầu vào app chưa có dữ liệu
  if (!isLoaded && !taskList) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary || "#FF5252"} />
        <Text style={{ color: theme.subText, textAlign: 'center', marginTop: 10 }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      contentContainerStyle={[styles.content, { paddingBottom: 40 }]}
      showsVerticalScrollIndicator={false}
      // Thêm RefreshControl để người dùng tự kéo làm mới thống kê
      refreshControl={
        <RefreshControl 
          refreshing={loading} 
          onRefresh={refreshTasks} 
          tintColor={theme.primary} 
        />
      }
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.text }]}>
          {t('stats.header')}
        </Text>

        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="trash-bin-outline" size={18} color="#FF5252" />
          <Text style={styles.resetText}>{t('stats.reset_button')}</Text>
        </TouchableOpacity>
      </View>

      {/* Thẻ thống kê tổng quát */}
      <StatCards {...stats} />

      {/* Biểu đồ năng suất */}
      <Text style={[styles.subHeader, { color: theme.text, marginTop: 24 }]}>
        {t('stats.productivity_chart')}
      </Text>
      <View style={{ marginTop: 12 }}>
        <StatsChart taskList={taskList} />
      </View>

      {/* Danh sách chi tiết */}
      <Text style={[styles.subHeader, { color: theme.text, marginTop: 24 }]}>
        {t('stats.task_details')}
      </Text>
      <TaskDetailList taskList={taskList} totalPomodoros={stats.totalPomodoros} />

      {/* Hoạt động gần đây */}
      <Text style={[styles.subHeader, { color: theme.text, marginTop: 30 }]}>
        {t('stats.recent_activity', 'Hoạt động gần đây')}
      </Text>
      
      <View style={[styles.activityList, { 
        backgroundColor: theme.card, 
        marginTop: 12, 
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: theme.border
      }]}>
         {recentActivities.length > 0 ? (
           recentActivities.map((task, index) => (
            <View 
              key={task.id} 
              style={[
                styles.activityItem, 
                { borderBottomColor: theme.border },
                index === recentActivities.length - 1 && { borderBottomWidth: 0 } 
              ]}
            >
               <Ionicons 
                 name={task.completed ? "checkmark-circle" : "time-outline"} 
                 size={22} 
                 color={task.completed ? "#4CAF50" : "#FFA000"} 
               />
               <View style={{ marginLeft: 12, flex: 1 }}>
                 <Text style={[styles.activityText, { color: theme.text, fontWeight: '500' }]} numberOfLines={1}>
                   {task.text}
                 </Text>
                 <Text style={{ fontSize: 12, color: theme.subText }}>
                   {task.pomodoroCount} 🍅 • {task.completed ? t('stat_cards.completed') : t('stat_cards.pending')}
                 </Text>
               </View>
            </View>
           ))
         ) : (
           <View style={{ padding: 30, alignItems: 'center' }}>
              <Ionicons name="stats-chart-outline" size={40} color={theme.subText} style={{ opacity: 0.5 }} />
              <Text style={{ marginTop: 8, color: theme.subText }}>
                {t('task_details.task_empty')}
              </Text>
           </View>
         )}
      </View>
    </ScrollView>
  );
}
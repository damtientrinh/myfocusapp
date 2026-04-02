import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/AppContext'; // Lấy theme
import { styles } from '../../styles/StatsStyles';

interface TaskListProps {
  taskList: any[];
  totalPomodoros: number;
}

export const TaskDetailList = ({ taskList, totalPomodoros }: TaskListProps) => {
  const { t } = useTranslation();
  const { theme } = useAppContext();

  if (taskList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="leaf-outline" size={80} color={theme.border} />
        <Text style={[styles.emptyText, { color: theme.subText }]}>
          {t('task_details.task_empty')}
        </Text>
      </View>
    );
  }

  return (
    <>
      {taskList.map((task, index) => {
        // Tính phần trăm đóng góp của task này
        const percentage = totalPomodoros > 0 
          ? ( (task.pomodoroCount || 0) / totalPomodoros ) * 100 : 0;

        return (
          <View key={task.id || `task-${index}`} style={styles.taskRowContainer}>
            <View style={styles.taskRow}>
              <Text style={[styles.taskName, { color: theme.text }]} numberOfLines={1}>
                {task.text}
              </Text>
              <Text style={[styles.taskPomo, { color: theme.primary || '#f55656' }]}>
                {task.pomodoroCount || 0} 🍅
              </Text>
            </View>
            
            {/* Thanh tiến trình */}
            <View style={[styles.progressBarBackground, { backgroundColor: theme.border }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${percentage}%`,
                    backgroundColor: theme.primary || '#f55656' // Màu đỏ cà chua
                  }
                ]} 
              />
            </View>
            
            {/* Hiển thị phần trăm nhỏ bên dưới (tùy chọn) */}
            <Text style={{ fontSize: 10, color: theme.subText, marginTop: 2, textAlign: 'right' }}>
               {percentage.toFixed(0)}%
            </Text>
          </View>
        );
      })}
    </>
  );
};
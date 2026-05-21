import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { styles } from './styles';

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
    <View>
      {taskList.map((task, index) => {
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
                    backgroundColor: theme.primary || '#f55656' 
                  }
                ]} 
              />
            </View>
            
            {/* Hiển thị phần trăm nhỏ bên dưới (tùy chọn) */}
            <Text style={{ fontSize: 10, color: theme.subText, marginTop: 2, textAlign: 'right' }}>
               {`${percentage.toFixed(0)}%`}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
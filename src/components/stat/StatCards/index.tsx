import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { styles } from './styles';

interface StatCardsProps {
  totalPomodoros: number;
  completedTasks: number;
  pendingTasks: number;
}

export const StatCards = ({ totalPomodoros, completedTasks, pendingTasks }: StatCardsProps) => {
  const { t } = useTranslation();
  const { theme } = useAppContext(); 

  return (
    <View style={styles.statsGrid}>
      {/* Thẻ Tổng Cà chua */}
      <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Ionicons name="stopwatch" size={30} color="#f55656" />
        <Text style={[styles.statValue, { color: theme.text }]}>{totalPomodoros}</Text>
        <Text style={[styles.statLabel, { color: theme.subText }]}>{t('stat_cards.total_pomodoros')}</Text>
      </View>

      {/* Thẻ Đã xong */}
      <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Ionicons name="checkmark-done-circle" size={30} color="#4CAF50" />
        <Text style={[styles.statValue, { color: theme.text }]}>{completedTasks}</Text>
        <Text style={[styles.statLabel, { color: theme.subText }]}>{t('stat_cards.completed')}</Text>
      </View>

      {/* Thẻ Đang thực hiện (Dài) */}
      <View style={[styles.longCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Ionicons name="hourglass-outline" size={24} color={theme.subText} />
        <Text style={[styles.statLabel, { color: theme.text }]}>
          {t('stat_cards.pending')}{" "}
          <Text style={[styles.boldText, { color: theme.primary || '#f55656' }]}> 
            {pendingTasks} 
          </Text>
          {t('stat_cards.tasks_unit')}
        </Text>
      </View>
    </View>
  );
};
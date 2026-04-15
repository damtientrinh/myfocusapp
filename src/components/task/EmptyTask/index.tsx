import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';

import { styles } from './styles';

export const EmptyTask = () => {
  const { theme, fonts, spacing, isDarkMode } = useAppContext();
  const { t } = useTranslation();

  return (
    <View style={[styles.empty_container, { paddingVertical: spacing.xl * 2 }]}>
      <View style={[
        styles.iconCircle, 
        { 
          backgroundColor: isDarkMode ? theme.card : '#E9ECEF',
          width: 120,
          height: 120,
          borderRadius: 60,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.lg,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 2,
        }
      ]}>
        <Ionicons 
            name="document-text-outline" 
            size={50} 
            color={theme.primary} 
            style={{ opacity: 0.8 }}
        />
      </View>
      
      {/* Tiêu đề chính */}
      <Text style={[
        styles.title, 
        { 
          color: theme.text, 
          fontFamily: fonts.rounded,
          fontSize: 20,
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: spacing.xs
        }
      ]}>
       {t('tasks.empty_title', 'Chưa có nhiệm vụ nào')}
      </Text>

      {/* Phụ đề hướng dẫn */}
      <Text style={[
        styles.subtitle, 
        { 
          color: theme.subText, 
          fontFamily: fonts.sans,
          fontSize: 15,
          textAlign: 'center',
          paddingHorizontal: spacing.xl,
          lineHeight: 22
        }
      ]}>
        {t('tasks.empty_subtitle', 'Hãy thêm mục tiêu hôm nay để bắt đầu tập trung nhé!')}
      </Text>
    </View>
  );
};
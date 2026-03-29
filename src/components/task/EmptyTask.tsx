import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

import { styles } from '../../styles/TaskStyles'; 

export const EmptyTask = () => {
  // Trình lấy thêm fonts và spacing từ Context ra nhé
  const { theme, fonts, spacing, isDarkMode } = useAppContext();
  const { t } = useTranslation();

  return (
    <View style={[styles.empty_container, { paddingVertical: spacing.xl * 2 }]}>
      {/* Vòng tròn Icon - Dùng theme.card để nó nổi nhẹ lên trên nền background */}
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
          // Đổ bóng nhẹ cho đẹp
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 2,
        }
      ]}>
        <Ionicons 
            name="document-text-outline" // Thay clipboard bằng document nhìn hiện đại hơn
            size={50} 
            color={theme.primary} // Dùng màu đỏ đặc trưng của Trình làm điểm nhấn
            style={{ opacity: 0.8 }}
        />
      </View>
      
      {/* Tiêu đề chính */}
      <Text style={[
        styles.title, 
        { 
          color: theme.text, 
          fontFamily: fonts.rounded, // Font bo tròn cho thân thiện
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
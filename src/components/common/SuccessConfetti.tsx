import React, { memo } from 'react'; // 1. Thêm memo
import { Dimensions, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

interface Props {
  isActive: boolean;
  onAnimationEnd: () => void;
}

// 2. Sử dụng memo để tránh re-render khi Timer ở màn hình chính chạy
export const SuccessConfetti = memo(({ isActive, onAnimationEnd }: Props) => {
  if (!isActive) return null;

  return (
    <View 
      style={styles.overlay} 
      pointerEvents="none"
    > 
      <ConfettiCannon
        count={150}
        origin={{ x: width / 2, y: -30 }}
        fadeOut={true}
        explosionSpeed={350} 
        fallSpeed={2500} 
        autoStart={true}
        onAnimationEnd={onAnimationEnd}
        colors={['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#e67e22']} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, 
  },
});
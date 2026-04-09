import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native'; 
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

interface Props {
  isActive: boolean;
  onAnimationEnd: () => void;
}

export const SuccessConfetti = ({ isActive, onAnimationEnd }: Props) => {
  if (!isActive) return null;

  return (
    // Bọc trong View absolute để không làm lệch Layout của FocusScreen
    <View style={StyleSheet.absoluteFill} pointerEvents="none"> 
      <ConfettiCannon
        count={200}
        origin={{ x: width / 2, y: -20 }} 
        fadeOut={true}
        explosionSpeed={350} 
        fallSpeed={3000}
        autoStart={true}
        onAnimationEnd={onAnimationEnd}
        colors={['#ff7043', '#ffb74d', '#81c784', '#64b5f6']} 
      />
    </View>
  );
};
import React from 'react';
import { Dimensions } from 'react-native'; // Thêm cái này để lấy chiều rộng màn hình
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

interface Props {
  isActive: boolean;
  onAnimationEnd: () => void;
}

export const SuccessConfetti = ({ isActive, onAnimationEnd }: Props) => {
  if (!isActive) return null;

  return (
    <ConfettiCannon
      count={200}
      origin={{ x: width / 2, y: -20 }} // Bắn từ chính giữa phía trên xuống
      fadeOut={true}
      explosionSpeed={350} // Tăng tốc độ nổ cho hoành tráng
      fallSpeed={3000}
      onAnimationEnd={onAnimationEnd}
      colors={['#ff7043', '#ffb74d', '#81c784', '#64b5f6']} // Thêm màu sắc cho rực rỡ
    />
  );
};
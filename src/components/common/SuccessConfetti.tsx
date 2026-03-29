import React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';


interface Props {
  isActive: boolean;
  onAnimationEnd: () => void;
}

export const SuccessConfetti = ({ isActive, onAnimationEnd }: Props) => {
  if (!isActive) return null;

  return (
    <ConfettiCannon
      count={200}           // Số lượng mảnh pháo
      origin={{ x: -10, y: 0 }} // Bắn từ góc trên
      fadeOut={true}        // Mờ dần
      explosionSpeed={200}  // Tốc độ nổ
      fallSpeed={3000}      // Tốc độ rơi
      onAnimationEnd={onAnimationEnd} // Tắt hiệu ứng khi xong
    />
  );
};
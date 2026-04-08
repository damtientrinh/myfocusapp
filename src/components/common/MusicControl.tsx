import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'; // Nhớ import Text nhé
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  nextTrack: () => void;
  title: string;
  isDarkMode: boolean;
  isActive: boolean;
}

export const MusicControl = ({ isMuted, setIsMuted, nextTrack, title, isDarkMode, isActive }: Props) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const getIconName = () => {
    if (isMuted) return "volume-mute";      // Đang tắt tiếng hoàn toàn
    if (!isActive) return "volume-low";     // Đang chờ (Timer dừng nên nhạc dừng)
    return "volume-high";                   // Nhạc đang thực sự phát
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Nút bật/tắt âm thanh */}
      <TouchableOpacity 
        onPress={() => setIsMuted(!isMuted)} 
        style={styles.iconBtn}
        activeOpacity={0.6}
      >
        <Ionicons 
          name={getIconName()} 
          size={20} 
          color={isMuted || !isActive ? theme.subText : theme.primary} 
        />
      </TouchableOpacity>

      {/* Tên bài hát: Dùng numberOfLines để không bị tràn màn hình */}
      <View style={styles.titleWrapper}>
        <Text 
          numberOfLines={1} 
          style={[styles.titleText, { color: theme.text }]}
        >
          {title}
        </Text>
      </View>

      {/* Nút chuyển bài */}
      <TouchableOpacity 
        onPress={nextTrack} 
        style={styles.iconBtn}
        activeOpacity={0.6}
      >
        <Ionicons name="play-forward" size={20} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25, // Bo tròn kiểu viên thuốc (Pill shape)
    borderWidth: 1,
    // Đổ bóng cho giống một chiếc "Mini Player"
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBtn: {
    padding: 4,
  },
  titleWrapper: {
    width: 120, // Giới hạn chiều ngang để tên bài hát không đẩy nút ra xa
    marginHorizontal: 10,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
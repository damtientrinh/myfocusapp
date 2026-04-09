import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Colors } from '../../../constants/theme';

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

  const formatTitle = (rawTitle: string) => {
    if (!rawTitle) return "No Track";
    return rawTitle
      .replace(/-/g, ' ')           // Thay gạch ngang bằng khoảng trắng
      .replace(/\.mp3/g, '')        // Xóa đuôi .mp3
      .replace(/\d+/g, '')          // Xóa các con số linh tinh
      .trim();
  };

  const getIconName = () => {
    if (isMuted) return "volume-mute";
    return isActive ? "volume-high" : "volume-low";
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)', 
      borderColor: theme.border 
    }]}>
      
      {/* Nút Mute */}
      <TouchableOpacity 
        onPress={() => setIsMuted(!isMuted)} 
        style={[styles.iconBtn, isMuted && { backgroundColor: 'rgba(0,0,0,0.05)' }]}
      >
        <Ionicons 
          name={getIconName()} 
          size={20} 
          color={isMuted || !isActive ? theme.subText : theme.primary} 
        />
        {isActive && !isMuted && (
          <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
        )}
      </TouchableOpacity>

      {/* Tên bài hát */}
      <View style={styles.titleWrapper}>
        <Text numberOfLines={1} style={[styles.titleText, { color: theme.text }]}>
          {formatTitle(title)}
        </Text>
      </View>

      {/* Nút Next */}
      <TouchableOpacity 
        onPress={nextTrack} 
        style={styles.iconBtn}
        activeOpacity={0.5}
      >
        <Ionicons name="play-skip-forward" size={20} color={theme.primary} />
      </TouchableOpacity>
      
    </View>
  );
};
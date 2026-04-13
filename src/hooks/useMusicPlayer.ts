import { 
  useAudioPlayer, 
  useAudioPlayerStatus, 
  setAudioModeAsync, 
  AudioSource
} from 'expo-audio';
import { useEffect, useState } from 'react';
import { STUDY_PLAYLIST } from '../constants/assets';

export const useMusicPlayer = (isActive: boolean) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // 1. Khởi tạo Player
  const player = useAudioPlayer(STUDY_PLAYLIST[currentIndex].file as AudioSource);
  const status = useAudioPlayerStatus(player);

  // 2. Cấu hình Audio Mode (Sửa tên thuộc tính)
  useEffect(() => {
    (setAudioModeAsync as any)({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionMode: 'do-not-mix', 
    });
  }, []);

  // 3. Xử lý Play/Pause
  useEffect(() => {
    if (isActive && !isMuted) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isMuted, player]);

  // 4. Tự động chuyển bài
  useEffect(() => {
    if (status.didJustFinish) {
      nextTrack();
    }
  }, [status.didJustFinish]);

  const nextTrack = () => {
    const nextIndex = (currentIndex + 1) % STUDY_PLAYLIST.length;
    setCurrentIndex(nextIndex);
    player.replace(STUDY_PLAYLIST[nextIndex].file as AudioSource);
  };

  // 5. Điều chỉnh âm lượng
  useEffect(() => {
    player.volume = isMuted ? 0 : 0.5; 
  }, [isMuted, player]);

  return { 
    isMuted, 
    setIsMuted, 
    nextTrack, 
    currentTrackTitle: STUDY_PLAYLIST[currentIndex].title 
  };
};
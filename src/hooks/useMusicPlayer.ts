import {
  AudioSource, setAudioModeAsync,
  useAudioPlayer, useAudioPlayerStatus,
} from 'expo-audio';
import { useEffect, useState, useRef } from 'react';
import { STUDY_PLAYLIST } from '../constants/music';

export const useMusicPlayer = (isActive: boolean) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // 1. Khởi tạo Player
  const player = useAudioPlayer(STUDY_PLAYLIST[currentIndex].file as AudioSource);
  const status = useAudioPlayerStatus(player);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // 2. Cấu hình Audio Mode 
  useEffect(() => {
    const configAudioMode = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          interruptionMode: 'doNotMix',
        });
      } catch (err) {
        console.log("Lỗi cấu hình Audio Mode:", err);
      }
    };
    configAudioMode();
  }, []);

  // 3. Xử lý Play/Pause
  useEffect(() => {
    if (isActive && !isMuted) {
      if (!status.playing) {
        player.play();
      }
    } else {
      if (status.playing) {
        player.pause();
      }
    }
  }, [isActive, isMuted, player, status.playing]);

  // 4. Tự động chuyển bài
  useEffect(() => {
    if (status.didJustFinish) {
      handleNextTrack();
    }
  }, [status.didJustFinish]);

  const handleNextTrack = () => {
    const nextIndex = (currentIndexRef.current + 1) % STUDY_PLAYLIST.length;
    setCurrentIndex(nextIndex);

    player.replace(STUDY_PLAYLIST[nextIndex].file as AudioSource);

    if (isActive && !isMuted) {
      player.play();
    }
  };

  // 5. Điều chỉnh âm lượng
  useEffect(() => {
    player.volume = isMuted ? 0 : 0.5;
  }, [isMuted, player]);

  return { 
    isMuted, setIsMuted, 
    nextTrack: handleNextTrack, 
    currentTrackTitle: STUDY_PLAYLIST[currentIndex].title 
  };
};
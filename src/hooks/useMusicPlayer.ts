import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useEffect, useState } from 'react';
import { STUDY_PLAYLIST } from '../constants/assets';

export const useMusicPlayer = (isActive: boolean) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Cấu hình âm thanh hệ thống 
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  async function loadAndPlay(index: number) {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      STUDY_PLAYLIST[index].file,
      { shouldPlay: isActive && !isMuted, volume: 0.5 },
      onPlaybackStatusUpdate // Theo dõi trạng thái để tự đổi bài
    );
    setSound(newSound);
  }

  // Tự động chuyển bài khi hết nhạc
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      nextTrack();
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentIndex + 1) % STUDY_PLAYLIST.length;
    setCurrentIndex(nextIndex);
    loadAndPlay(nextIndex);
  };

  useEffect(() => {
    if (!sound) {
      loadAndPlay(currentIndex);
    } else {
      isActive && !isMuted ? sound.playAsync() : sound.pauseAsync();
    }
  }, [isActive, isMuted]);

  return { 
    isMuted, 
    setIsMuted, 
    nextTrack, 
    currentTrackTitle: STUDY_PLAYLIST[currentIndex].title 
  };
};
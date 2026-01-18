import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  color: string;
  file: string;
}

export const tracks: Track[] = [
  { id: 1, title: 'Eyes Without a Face', artist: 'Billy Idol', duration: '3:24', color: 'from-pink-400 to-rose-600', file: '/music/cherry-blossom.mp3' },
  { id: 2, title: 'Where d all the time go', artist: 'Dr. Dog', duration: '4:12', color: 'from-rose-500 to-red-700', file: '/music/strawberry-dream.mp3' },
  { id: 3, title: 'Playground Love', artist: 'Air', duration: '3:45', color: 'from-red-500 to-rose-700', file: '/music/cotton-candy.mp3' },
  { id: 4, title: 'Wait so long', artist: 'SHM', duration: '5:01', color: 'from-rose-600 to-red-800', file: '/music/peach-paradise.mp3' },
  { id: 5, title: 'Bubblegum Pop', artist: 'Pixel Dreams', duration: '3:33', color: 'from-pink-500 to-rose-700', file: '/music/bubblegum-pop.mp3' },
];

interface MusicContextType {
  currentTrack: number;
  isPlaying: boolean;
  progress: number;
  shuffle: boolean;
  repeat: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  setCurrentTrack: (track: number) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  getCurrentTrack: () => Track;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolumeState] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Load saved state
    const saved = localStorage.getItem('musicPlayer');
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentTrack(data.currentTrack || 0);
      setShuffle(data.shuffle || false);
      setRepeat(data.repeat || false);
      setVolumeState(data.volume || 75);
    }

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('ended', () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Load track when currentTrack changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = tracks[currentTrack].file;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Save state
  useEffect(() => {
    const data = {
      currentTrack,
      shuffle,
      repeat,
      isPlaying,
      volume,
    };
    localStorage.setItem('musicPlayer', JSON.stringify(data));
  }, [currentTrack, shuffle, repeat, isPlaying, volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const wasPlaying = isPlaying;
    if (shuffle) {
      let next = Math.floor(Math.random() * tracks.length);
      while (next === currentTrack && tracks.length > 1) {
        next = Math.floor(Math.random() * tracks.length);
      }
      setCurrentTrack(next);
    } else {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    }
    setProgress(0);
    if (wasPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play().catch(console.error), 100);
    }
  };

  const nextTrack = handleNext;

  const previousTrack = () => {
    const wasPlaying = isPlaying;
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
    if (wasPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play().catch(console.error), 100);
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const setVolume = (vol: number) => {
    setVolumeState(Math.max(0, Math.min(100, vol)));
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const getCurrentTrack = () => tracks[currentTrack];

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        shuffle,
        repeat,
        volume,
        currentTime,
        duration,
        setCurrentTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        toggleShuffle,
        toggleRepeat,
        setVolume,
        seek,
        getCurrentTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

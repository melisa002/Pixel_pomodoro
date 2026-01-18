import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  PixelPlay,
  PixelPause,
  PixelSkipForward,
  PixelSkipBack,
  PixelShuffle,
  PixelRepeat,
  PixelVolume,
  PixelHeart,
} from '@/app/components/PixelIcons';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  color: string;
}

const mockTracks: Track[] = [
  { id: 1, title: 'Cherry Blossom', artist: 'Kawaii Beats', duration: '3:24', color: 'from-pink-300 to-rose-400' },
  { id: 2, title: 'Strawberry Dream', artist: 'Cute Lofi', duration: '4:12', color: 'from-red-300 to-pink-400' },
  { id: 3, title: 'Cotton Candy', artist: 'Sweet Sounds', duration: '3:45', color: 'from-pink-200 to-purple-300' },
  { id: 4, title: 'Peach Paradise', artist: 'Soft Vibes', duration: '5:01', color: 'from-orange-200 to-pink-300' },
  { id: 5, title: 'Bubblegum Pop', artist: 'Pixel Dreams', duration: '3:33', color: 'from-fuchsia-300 to-pink-400' },
];

interface MusicPlayerProps {
  onSave: (data: any) => void;
}

export function MusicPlayer({ onSave }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    // Load saved state
    const saved = localStorage.getItem('musicPlayer');
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentTrack(data.currentTrack || 0);
      setShuffle(data.shuffle || false);
      setRepeat(data.repeat || false);
    }
  }, []);

  useEffect(() => {
    // Save state
    const data = {
      currentTrack,
      shuffle,
      repeat,
      isPlaying,
    };
    localStorage.setItem('musicPlayer', JSON.stringify(data));
    onSave(data);
  }, [currentTrack, shuffle, repeat, isPlaying, onSave]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (shuffle) {
      setCurrentTrack(Math.floor(Math.random() * mockTracks.length));
    } else {
      setCurrentTrack((prev) => (prev + 1) % mockTracks.length);
    }
    setProgress(0);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + mockTracks.length) % mockTracks.length);
    setProgress(0);
  };

  const track = mockTracks[currentTrack];

  return (
    <div className="space-y-4 font-['Pixelify_Sans']">
      {/* Album Art */}
      <motion.div
        key={currentTrack}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative h-48 rounded-lg bg-gradient-to-br ${track.color} overflow-hidden border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[length:4px_4px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-lg bg-white/40 border-4 border-white flex items-center justify-center"
          >
            <PixelHeart className="w-12 h-12 text-rose-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Track Info */}
      <div className="text-center space-y-1">
        <motion.h3
          key={`title-${currentTrack}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-bold text-lg text-rose-600"
        >
          {track.title}
        </motion.h3>
        <motion.p
          key={`artist-${currentTrack}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-pink-500"
        >
          {track.artist}
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-4 bg-pink-100 rounded border-2 border-pink-300 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${track.color} border-r-2 border-pink-400`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-pink-600 font-bold">
          <span>{Math.floor(progress / 100 * 180)}s</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShuffle(!shuffle)}
          className={`p-3 rounded border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
            shuffle ? 'bg-rose-400 border-rose-500 text-white' : 'bg-pink-200 border-pink-300 text-pink-600'
          }`}
        >
          <PixelShuffle className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="p-3 rounded border-4 bg-pink-300 border-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-white"
        >
          <PixelSkipBack className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className={`p-5 rounded-lg border-4 bg-gradient-to-br from-rose-400 to-pink-500 border-rose-500 shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] text-white`}
        >
          {isPlaying ? <PixelPause className="w-7 h-7" /> : <PixelPlay className="w-7 h-7" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="p-3 rounded border-4 bg-pink-300 border-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-white"
        >
          <PixelSkipForward className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRepeat(!repeat)}
          className={`p-3 rounded border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
            repeat ? 'bg-rose-400 border-rose-500 text-white' : 'bg-pink-200 border-pink-300 text-pink-600'
          }`}
        >
          <PixelRepeat className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-2">
        <PixelVolume className="w-5 h-5 text-pink-500" />
        <div className="flex-1 h-4 bg-pink-100 rounded border-2 border-pink-300">
          <div className="w-3/4 h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded border-r-2 border-pink-400" />
        </div>
      </div>

      {/* Playlist */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {mockTracks.map((t, idx) => (
          <motion.button
            key={t.id}
            whileHover={{ x: 4 }}
            onClick={() => {
              setCurrentTrack(idx);
              setProgress(0);
            }}
            className={`w-full flex items-center gap-3 p-2 rounded border-2 transition-all ${
              idx === currentTrack
                ? 'bg-pink-200 border-pink-400 shadow-[3px_3px_0px_0px_rgba(219,39,119,0.2)]'
                : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
            }`}
          >
            <div className={`w-10 h-10 rounded border-2 border-white bg-gradient-to-br ${t.color} flex items-center justify-center`}>
              <PixelHeart className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-rose-600">{t.title}</p>
              <p className="text-xs text-pink-500">{t.artist}</p>
            </div>
            <span className="text-xs font-bold text-pink-600">{t.duration}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
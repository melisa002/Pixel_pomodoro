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
import { useMusic, tracks } from '@/app/contexts/MusicContext';

interface MusicPlayerProps {
  onSave: (data: any) => void;
}

export function MusicPlayer({ onSave }: MusicPlayerProps) {
  const {
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
  } = useMusic();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const track = getCurrentTrack();

  return (
    <div className="space-y-4 font-['Pixelify_Sans']">
      {/* Album Art */}
      <motion.div
        key={currentTrack}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative h-48 rounded-lg bg-gradient-to-br ${track.color} overflow-hidden border-4 border-rose-800 shadow-[8px_8px_0px_0px_rgba(159,18,57,0.3)]`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[length:4px_4px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-lg bg-white/30 border-4 border-white/60 flex items-center justify-center"
          >
            <PixelHeart className="w-12 h-12 text-rose-100" />
          </motion.div>
        </div>
      </motion.div>

      {/* Track Info */}
      <div className="text-center space-y-1">
        <motion.h3
          key={`title-${currentTrack}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-bold text-lg text-rose-900"
        >
          {track.title}
        </motion.h3>
        <motion.p
          key={`artist-${currentTrack}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-rose-700"
        >
          {track.artist}
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          className="h-4 bg-pink-100 rounded border-2 border-rose-300 overflow-hidden cursor-pointer"
          onClick={(e) => {
            if (duration) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }
          }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r from-rose-600 to-red-700 border-r-2 border-rose-700`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-rose-800 font-bold">
          <span>{formatTime(currentTime)}</span>
          <span>{duration ? formatTime(duration) : track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleShuffle}
          className={`p-3 rounded border-4 shadow-[4px_4px_0px_0px_rgba(159,18,57,0.3)] ${
            shuffle ? 'bg-rose-600 border-rose-700 text-pink-100' : 'bg-pink-200 border-rose-300 text-rose-800'
          }`}
        >
          <PixelShuffle className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousTrack}
          className="p-3 rounded border-4 bg-rose-600 border-rose-700 shadow-[4px_4px_0px_0px_rgba(159,18,57,0.3)] text-pink-100"
        >
          <PixelSkipBack className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          className={`p-5 rounded-lg border-4 bg-gradient-to-br from-rose-600 to-red-700 border-rose-800 shadow-[6px_6px_0px_0px_rgba(159,18,57,0.5)] text-pink-100`}
        >
          {isPlaying ? <PixelPause className="w-7 h-7" /> : <PixelPlay className="w-7 h-7" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextTrack}
          className="p-3 rounded border-4 bg-rose-600 border-rose-700 shadow-[4px_4px_0px_0px_rgba(159,18,57,0.3)] text-pink-100"
        >
          <PixelSkipForward className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRepeat}
          className={`p-3 rounded border-4 shadow-[4px_4px_0px_0px_rgba(159,18,57,0.3)] ${
            repeat ? 'bg-rose-600 border-rose-700 text-pink-100' : 'bg-pink-200 border-rose-300 text-rose-800'
          }`}
        >
          <PixelRepeat className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-2">
        <PixelVolume className="w-5 h-5 text-rose-700" />
        <div
          className="flex-1 h-4 bg-pink-100 rounded border-2 border-rose-300 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            setVolume(Math.max(0, Math.min(100, percentage)));
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-red-700 rounded border-r-2 border-rose-700 transition-all"
            style={{ width: `${volume}%` }}
          />
        </div>
        <span className="text-xs text-rose-800 font-bold w-8">{Math.round(volume)}%</span>
      </div>

      {/* Playlist */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {tracks.map((t, idx) => (
          <motion.button
            key={t.id}
            whileHover={{ x: 4 }}
            onClick={() => {
              setCurrentTrack(idx);
            }}
            className={`w-full flex items-center gap-3 p-2 rounded border-2 transition-all ${
              idx === currentTrack
                ? 'bg-pink-200 border-rose-400 shadow-[3px_3px_0px_0px_rgba(159,18,57,0.3)]'
                : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
            }`}
          >
            <div className={`w-10 h-10 rounded border-2 border-white bg-gradient-to-br ${t.color} flex items-center justify-center`}>
              <PixelHeart className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-rose-900">{t.title}</p>
              <p className="text-xs text-rose-700">{t.artist}</p>
            </div>
            <span className="text-xs font-bold text-rose-800">{t.duration}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

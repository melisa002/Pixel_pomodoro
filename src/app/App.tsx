import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelMusic, PixelHeart, PixelTimer, PixelStar } from '@/app/components/PixelIcons';
import { MusicPlayer } from '@/app/components/MusicPlayer';
import { MoodTracker } from '@/app/components/MoodTracker';
import { PomodoroTimer } from '@/app/components/PomodoroTimer';
import { CharacterDisplay } from '@/app/components/CharacterDisplay';

type Tab = 'music' | 'mood' | 'timer' | 'character';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('character');
  const [totalLifetimePomodoros, setTotalLifetimePomodoros] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('lifetimePomodoros');
    if (saved) {
      setTotalLifetimePomodoros(parseInt(saved));
    }
  }, []);

  const handleSave = (componentData: any) => {
    console.log('Data saved:', componentData);
  };

  const handlePomodoroComplete = () => {
    const newTotal = totalLifetimePomodoros + 1;
    setTotalLifetimePomodoros(newTotal);
    localStorage.setItem('lifetimePomodoros', newTotal.toString());
  };

  const tabs = [
    { id: 'character' as Tab, icon: PixelHeart, label: 'Pet', color: 'from-pink-500 to-rose-500' },
    { id: 'timer' as Tab, icon: PixelTimer, label: 'Timer', color: 'from-red-500 to-orange-500' },
    { id: 'music' as Tab, icon: PixelMusic, label: 'Music', color: 'from-purple-500 to-pink-500' },
    { id: 'mood' as Tab, icon: PixelHeart, label: 'Mood', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="size-full min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Widget Container - SQUARE! */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-[600px] aspect-square"
      >
        {/* Main Card with enhanced pixel aesthetic */}
        <div className="relative h-full bg-white rounded-3xl shadow-[0_0_60px_rgba(219,39,119,0.5),16px_16px_0px_0px_rgba(219,39,119,0.25)] border-8 border-pink-300 overflow-hidden flex flex-col">
          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.04]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.5)_2px,rgba(0,0,0,0.5)_4px)]" />
          </div>
          
          {/* Header with pixel pattern */}
          <div className="relative p-4 bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 border-b-8 border-pink-300 shrink-0">
            {/* Pixel pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15)_76%,transparent_77%,transparent)] bg-[length:4px_4px]" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="bg-white/40 p-2 rounded-lg border-4 border-white/60"
                >
                  <PixelStar className="w-5 h-5 text-rose-500" />
                </motion.div>
                <div>
                  <h1 className="text-base font-bold text-rose-600 font-['Press_Start_2P'] leading-tight">
                    Focus Pet
                  </h1>
                  <p className="text-xs text-pink-600 mt-0.5 font-bold">tamagotchi vibes ♡</p>
                </div>
              </div>
              {/* Decorative pixel hearts */}
              <div className="flex gap-1">
                <PixelHeart className="w-4 h-4 text-rose-400 opacity-60" />
                <PixelHeart className="w-4 h-4 text-pink-400 opacity-60" />
              </div>
            </div>
          </div>

          {/* Tab Navigation - 4 tabs in grid */}
          <div className="relative grid grid-cols-4 gap-1 p-2 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border-b-4 border-pink-200 shrink-0">
            {/* Pixel pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,192,203,.05)_25%,rgba(255,192,203,.05)_26%,transparent_27%,transparent_74%,rgba(255,192,203,.05)_75%,rgba(255,192,203,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,192,203,.05)_25%,rgba(255,192,203,.05)_26%,transparent_27%,transparent_74%,rgba(255,192,203,.05)_75%,rgba(255,192,203,.05)_76%,transparent_77%,transparent)] bg-[length:4px_4px]" />
            
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg transition-all border-3 font-bold text-xs ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white border-rose-500 shadow-[3px_3px_0px_0px_rgba(220,38,38,0.4)]'
                      : 'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600 border-pink-300 hover:border-pink-400 shadow-[2px_2px_0px_0px_rgba(219,39,119,0.15)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="leading-none text-[10px]">{tab.label}</span>
                  {/* Active indicator dots */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5"
                    >
                      <div className="w-1 h-1 bg-white rounded-sm" />
                      <div className="w-1 h-1 bg-white rounded-sm" />
                      <div className="w-1 h-1 bg-white rounded-sm" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Content - SCROLLABLE */}
          <div className="relative flex-1 overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-purple-50">
            {/* Subtle pixel grid */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,192,203,.02)_25%,rgba(255,192,203,.02)_26%,transparent_27%,transparent_74%,rgba(255,192,203,.02)_75%,rgba(255,192,203,.02)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,192,203,.02)_25%,rgba(255,192,203,.02)_26%,transparent_27%,transparent_74%,rgba(255,192,203,.02)_75%,rgba(255,192,203,.02)_76%,transparent_77%,transparent)] bg-[length:8px_8px] pointer-events-none" />
            
            <div className="p-4 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'character' && (
                    <CharacterDisplay 
                      totalPomodoros={totalLifetimePomodoros}
                    />
                  )}
                  {activeTab === 'music' && <MusicPlayer onSave={handleSave} />}
                  {activeTab === 'mood' && <MoodTracker onSave={handleSave} />}
                  {activeTab === 'timer' && (
                    <PomodoroTimer 
                      onSave={handleSave} 
                      onPomodoroComplete={handlePomodoroComplete}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer with enhanced design */}
          <div className="relative p-3 bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 border-t-4 border-pink-300 shrink-0">
            {/* Pixel pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent)] bg-[length:4px_4px]" />
            
            <div className="relative flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 bg-rose-400 rounded-sm border border-rose-500" />
                  <div className="w-2 h-2 bg-pink-400 rounded-sm border border-pink-500" />
                  <div className="w-2 h-2 bg-purple-400 rounded-sm border border-purple-500" />
                </div>
                <span className="text-pink-700">feed ur pet ♡</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="w-2.5 h-2.5 bg-gradient-to-br from-rose-400 to-pink-500 rounded-sm border-2 border-rose-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                />
                <span className="text-rose-700">{totalLifetimePomodoros}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced glow effect */}
        <div className="absolute -inset-6 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-[3rem] blur-3xl opacity-25 -z-10 animate-pulse" />
      </motion.div>
    </div>
  );
}
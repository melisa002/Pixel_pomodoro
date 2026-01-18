import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelTimer, PixelReset, PixelCoffee, PixelFire, PixelCheck, PixelPlay, PixelPause } from '@/app/components/PixelIcons';

type TimerMode = 'work' | 'break' | 'longBreak';

interface PomodoroTimerProps {
  onSave: (data: any) => void;
  onPomodoroComplete?: () => void;
}

export function PomodoroTimer({ onSave, onPomodoroComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalCompletedToday, setTotalCompletedToday] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pomodoroTimer');
    if (saved) {
      const data = JSON.parse(saved);
      const savedDate = new Date(data.date).toDateString();
      const today = new Date().toDateString();

      if (savedDate === today) {
        setTotalCompletedToday(data.totalCompletedToday || 0);
      }
      setCompletedPomodoros(data.completedPomodoros || 0);
      
      // Load custom times
      if (data.workTime) setWorkTime(data.workTime);
      if (data.shortBreakTime) setShortBreakTime(data.shortBreakTime);
      if (data.longBreakTime) setLongBreakTime(data.longBreakTime);
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const data = {
      mode,
      completedPomodoros,
      totalCompletedToday,
      date: new Date().toISOString(),
      workTime,
      shortBreakTime,
      longBreakTime,
    };
    localStorage.setItem('pomodoroTimer', JSON.stringify(data));
    onSave(data);
  }, [mode, completedPomodoros, totalCompletedToday, workTime, shortBreakTime, longBreakTime, onSave]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      setTotalCompletedToday(totalCompletedToday + 1);
      
      // Notify parent that pomodoro is complete (to feed character)
      onPomodoroComplete?.();

      // Auto-switch to break
      if (newCompleted % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(longBreakTime * 60);
      } else {
        setMode('break');
        setTimeLeft(shortBreakTime * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(workTime * 60);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workTime * 60);
    } else if (mode === 'break') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'work') {
      setTimeLeft(workTime * 60);
    } else if (newMode === 'break') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((workTime * 60 - timeLeft) / (workTime * 60)) * 100
    : mode === 'break'
    ? ((shortBreakTime * 60 - timeLeft) / (shortBreakTime * 60)) * 100
    : ((longBreakTime * 60 - timeLeft) / (longBreakTime * 60)) * 100;

  const updateWorkTime = (mins: number) => {
    setWorkTime(mins);
    if (mode === 'work' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const updateShortBreak = (mins: number) => {
    setShortBreakTime(mins);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const updateLongBreak = (mins: number) => {
    setLongBreakTime(mins);
    if (mode === 'longBreak' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          icon: PixelFire,
          label: 'Focus Time',
          color: 'from-red-500 to-orange-500',
          bg: 'from-red-500/20 to-orange-500/20',
        };
      case 'break':
        return {
          icon: PixelCoffee,
          label: 'Short Break',
          color: 'from-green-500 to-emerald-500',
          bg: 'from-green-500/20 to-emerald-500/20',
        };
      case 'longBreak':
        return {
          icon: PixelCoffee,
          label: 'Long Break',
          color: 'from-blue-500 to-cyan-500',
          bg: 'from-blue-500/20 to-cyan-500/20',
        };
    }
  };

  const config = getModeConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-6 font-['Pixelify_Sans']">
      {/* Mode Selector */}
      <div className="flex gap-2 p-2 bg-pink-100 rounded-lg border-4 border-pink-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
        {[
          { mode: 'work' as TimerMode, label: 'Work', icon: '🍓' },
          { mode: 'break' as TimerMode, label: 'Break', icon: '🌸' },
          { mode: 'longBreak' as TimerMode, label: 'Long', icon: '🎀' },
        ].map((item) => (
          <motion.button
            key={item.mode}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange(item.mode)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all border-2 ${
              mode === item.mode
                ? 'bg-rose-400 text-white border-rose-500 shadow-[3px_3px_0px_0px_rgba(220,38,38,0.2)]'
                : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
            }`}
          >
            {item.icon} {item.label}
          </motion.button>
        ))}
      </div>

      {/* Timer Display */}
      <motion.div
        key={mode}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative p-8 rounded-xl bg-gradient-to-br ${config.bg} border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]`}
      >
        {/* Pixel Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent)] bg-[length:4px_4px] rounded-xl" />

        {/* Progress Circle */}
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              strokeWidth="12"
              strokeLinecap="square"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className={`stroke-gradient-${mode}`}
              style={{
                stroke: mode === 'work' ? '#dc2626' : mode === 'break' ? '#10b981' : '#ec4899',
              }}
            />
          </svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-6 h-6 text-white" />
              <span className="text-sm font-bold text-white">{config.label}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={timeLeft}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-6xl font-bold text-white font-['Press_Start_2P'] tracking-wider"
              >
                {formatTime(timeLeft)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-4 rounded-lg border-4 bg-pink-200 border-pink-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-pink-600 hover:bg-pink-300"
        >
          <PixelReset className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? handlePause : handleStart}
          className={`px-8 py-4 rounded-lg bg-gradient-to-r ${config.color} border-4 shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] font-bold text-lg flex items-center gap-3 text-white`}
          style={{
            borderColor: mode === 'work' ? '#dc2626' : mode === 'break' ? '#10b981' : '#ec4899',
          }}
        >
          {isRunning ? (
            <>
              <PixelPause className="w-7 h-7" />
              Pause
            </>
          ) : (
            <>
              <PixelPlay className="w-7 h-7" />
              Start
            </>
          )}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-pink-50 rounded-lg border-4 border-pink-200 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <PixelCheck className="w-5 h-5 text-rose-500" />
            <p className="text-sm text-pink-500 font-bold">Today ♡</p>
          </div>
          <p className="text-4xl font-bold text-rose-600">{totalCompletedToday}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-pink-50 rounded-lg border-4 border-pink-200 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <PixelFire className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-pink-500 font-bold">Session ♡</p>
          </div>
          <p className="text-4xl font-bold text-rose-600">{completedPomodoros}</p>
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2">
        {[...Array(4)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`w-4 h-4 rounded border-2 ${
              idx < completedPomodoros % 4
                ? 'bg-rose-400 border-rose-500'
                : 'bg-pink-100 border-pink-300'
            }`}
          />
        ))}
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <button
          className="w-full px-4 py-2 bg-gradient-to-r from-pink-200 to-rose-200 rounded-lg border-4 border-pink-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-pink-700 font-bold hover:bg-pink-300 transition-all"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? '✕ Hide Settings' : '⚙️ Timer Settings'}
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 p-4 bg-pink-50 rounded-lg border-4 border-pink-200">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-bold text-pink-700">🍓 Work:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={workTime}
                      onChange={(e) => updateWorkTime(Number(e.target.value))}
                      className="w-16 px-2 py-1 border-2 border-pink-300 rounded-lg text-center font-bold text-rose-600"
                    />
                    <span className="text-xs text-pink-600 font-bold">mins</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-bold text-pink-700">🌸 Short Break:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={shortBreakTime}
                      onChange={(e) => updateShortBreak(Number(e.target.value))}
                      className="w-16 px-2 py-1 border-2 border-pink-300 rounded-lg text-center font-bold text-rose-600"
                    />
                    <span className="text-xs text-pink-600 font-bold">mins</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-bold text-pink-700">🎀 Long Break:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakTime}
                      onChange={(e) => updateLongBreak(Number(e.target.value))}
                      className="w-16 px-2 py-1 border-2 border-pink-300 rounded-lg text-center font-bold text-rose-600"
                    />
                    <span className="text-xs text-pink-600 font-bold">mins</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
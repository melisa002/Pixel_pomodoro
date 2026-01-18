import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PixelCalendar, PixelTrend } from '@/app/components/PixelIcons';

interface Mood {
  emoji: string;
  label: string;
  color: string;
}

const moods: Mood[] = [
  { emoji: '🌸', label: 'Happy', color: 'from-pink-300 to-rose-300' },
  { emoji: '🎀', label: 'Calm', color: 'from-pink-200 to-purple-200' },
  { emoji: '🍓', label: 'Energized', color: 'from-red-300 to-pink-300' },
  { emoji: '🌙', label: 'Tired', color: 'from-purple-200 to-indigo-300' },
  { emoji: '☁️', label: 'Stressed', color: 'from-gray-200 to-pink-100' },
  { emoji: '🎯', label: 'Focused', color: 'from-rose-300 to-red-400' },
  { emoji: '🧸', label: 'Sad', color: 'from-blue-200 to-purple-200' },
  { emoji: '🎂', label: 'Excited', color: 'from-pink-300 to-fuchsia-300' },
];

interface MoodEntry {
  mood: string;
  timestamp: number;
  note?: string;
}

interface MoodTrackerProps {
  onSave: (data: any) => void;
}

export function MoodTracker({ onSave }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('moodTracker');
    if (saved) {
      const data = JSON.parse(saved);
      setMoodHistory(data.history || []);
    }
  }, []);

  const handleMoodSelect = (emoji: string) => {
    setSelectedMood(emoji);
  };

  const handleSaveMood = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      mood: selectedMood,
      timestamp: Date.now(),
      note: note || undefined,
    };

    const newHistory = [newEntry, ...moodHistory].slice(0, 10);
    setMoodHistory(newHistory);

    const data = { history: newHistory };
    localStorage.setItem('moodTracker', JSON.stringify(data));
    onSave(data);

    setNote('');
    setSelectedMood(null);
  };

  const getMoodData = () => {
    const moodCounts: { [key: string]: number } = {};
    moodHistory.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    return topMood;
  };

  const topMood = getMoodData();

  return (
    <div className="space-y-6 font-['Pixelify_Sans']">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-rose-600">How r u feeling? ♡</h3>
        <p className="text-sm text-pink-500">Track ur mood throughout the day</p>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => (
          <motion.button
            key={mood.emoji}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(mood.emoji)}
            className={`relative p-4 rounded-lg border-4 bg-pink-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
              selectedMood === mood.emoji ? 'border-rose-400 bg-pink-100' : 'border-pink-200 hover:border-pink-300'
            }`}
          >
            <motion.div
              animate={{ scale: selectedMood === mood.emoji ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl"
            >
              {mood.emoji}
            </motion.div>
            <p className="text-xs mt-1 text-pink-600 font-bold">{mood.label}</p>
            {selectedMood === mood.emoji && (
              <motion.div
                layoutId="mood-indicator"
                className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-30 rounded-lg border-4 border-rose-400`}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Note Input */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a cute note... ♡"
            className="w-full p-3 bg-pink-50 border-4 border-pink-200 rounded-lg resize-none focus:outline-none focus:border-rose-400 text-sm text-rose-600 placeholder:text-pink-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
            rows={2}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveMood}
            className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg font-bold text-white border-4 border-rose-500 shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,0.3)] transition-all"
          >
            ♡ Save Mood ♡
          </motion.button>
        </motion.div>
      )}

      {/* Mood Stats */}
      {topMood && (
        <div className="p-4 bg-pink-50 rounded-lg border-4 border-pink-200 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-sm text-pink-500 font-bold">
            <PixelTrend className="w-5 h-5" />
            <span>Ur most common mood ♡</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-5xl">{topMood[0]}</span>
            <div>
              <p className="font-bold text-rose-600">
                {moods.find((m) => m.emoji === topMood[0])?.label}
              </p>
              <p className="text-sm text-pink-500 font-bold">{topMood[1]} times ♡</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Moods */}
      {moodHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-pink-500 font-bold">
            <PixelCalendar className="w-5 h-5" />
            <span>Recent moods ♡</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {moodHistory.map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-2 bg-pink-50 rounded-lg border-2 border-pink-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
              >
                <span className="text-2xl">{entry.mood}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-rose-600">
                    {moods.find((m) => m.emoji === entry.mood)?.label}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-pink-500 truncate">{entry.note}</p>
                  )}
                </div>
                <span className="text-xs text-pink-600 font-bold">
                  {new Date(entry.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
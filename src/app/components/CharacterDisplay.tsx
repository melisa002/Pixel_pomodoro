import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { creatures } from '@/app/components/TamagotchiCreatures';
import { PixelHeart, PixelStar } from '@/app/components/PixelIcons';

interface CharacterDisplayProps {
  totalPomodoros: number;
  onCreatureChange?: (creatureId: string) => void;
}

export function CharacterDisplay({ totalPomodoros, onCreatureChange }: CharacterDisplayProps) {
  const [selectedCreature, setSelectedCreature] = useState('bunny');
  const [showCreatureSelect, setShowCreatureSelect] = useState(false);
  const [justFed, setJustFed] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCreature');
    if (saved) {
      setSelectedCreature(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCreature', selectedCreature);
    onCreatureChange?.(selectedCreature);
  }, [selectedCreature, onCreatureChange]);

  // Random idle animations - like Tamagotchi!
  useEffect(() => {
    const randomBounce = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 800);
      }
    }, 3000);

    const randomHappy = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsHappy(true);
        setTimeout(() => setIsHappy(false), 1500);
      }
    }, 4000);

    return () => {
      clearInterval(randomBounce);
      clearInterval(randomHappy);
    };
  }, []);

  // Determine growth stage based on pomodoros
  const getStage = (pomodoros: number): number => {
    if (pomodoros === 0) return 0; // Egg
    if (pomodoros < 25) return 1; // Baby - hatches after 1 pomodoro!
    if (pomodoros < 50) return 2; // Child
    if (pomodoros < 75) return 3; // Teen
    return 4; // Adult
  };

  const stage = getStage(totalPomodoros % 100);
  const progress = totalPomodoros % 100;
  const creature = creatures.find(c => c.id === selectedCreature) || creatures[0];
  const CreatureComponent = creature.component;

  const getStageLabel = (stage: number): string => {
    switch (stage) {
      case 0: return 'Egg';
      case 1: return 'Baby';
      case 2: return 'Child';
      case 3: return 'Teen';
      case 4: return 'Adult';
      default: return 'Unknown';
    }
  };

  const handleFeed = () => {
    setJustFed(true);
    setIsHappy(true);
    setIsBouncing(true);
    setTimeout(() => {
      setJustFed(false);
      setIsHappy(false);
      setIsBouncing(false);
    }, 2000);
  };

  useEffect(() => {
    if (totalPomodoros > 0) {
      handleFeed();
    }
  }, [totalPomodoros]);

  const canEvolve = totalPomodoros >= 100;

  return (
    <div className="space-y-4 font-['Pixelify_Sans']">
      {/* Character Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative p-6 rounded-xl bg-gradient-to-br ${creature.color} border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden`}
      >
        {/* Pixel pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent)] bg-[length:4px_4px]" />

        {/* Character */}
        <div className="relative flex flex-col items-center gap-4">
          <motion.div
            key={`${selectedCreature}-${stage}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: isBouncing ? [0, -15, 0, -8, 0] : 0,
            }}
            transition={{ 
              scale: { type: 'spring', duration: 0.6 },
              rotate: { type: 'spring', duration: 0.6 },
              y: { duration: 0.6, ease: 'easeInOut' },
            }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: isHappy ? [0, -5, 5, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <CreatureComponent 
                className="w-48 h-48 drop-shadow-lg" 
                stage={stage} 
                isHappy={isHappy}
                isBouncing={isBouncing}
              />
            </motion.div>
            
            {/* Feed animation - hearts */}
            <AnimatePresence>
              {justFed && (
                <>
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -40, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl"
                  >
                    ♡
                  </motion.div>
                  <motion.div
                    initial={{ y: 0, x: 10, opacity: 1, scale: 0.8 }}
                    animate={{ y: -35, x: 20, opacity: 0, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.3, delay: 0.2 }}
                    className="absolute top-0 left-1/2 text-2xl"
                  >
                    ♡
                  </motion.div>
                  <motion.div
                    initial={{ y: 0, x: -10, opacity: 1, scale: 0.8 }}
                    animate={{ y: -38, x: -20, opacity: 0, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.4, delay: 0.1 }}
                    className="absolute top-0 left-1/2 text-2xl"
                  >
                    ♡
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            {/* Happy animation - sparkles */}
            <AnimatePresence>
              {isHappy && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute -top-2 -right-2 text-xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute -bottom-2 -left-2 text-xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 1.3, 0], opacity: [1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="absolute top-1/2 -right-3 text-lg"
                  >
                    ⭐
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Name and stage */}
          <div className="text-center relative z-10">
            <h3 className="text-xl font-bold text-rose-600">{creature.name}</h3>
            <p className="text-sm text-pink-600 font-bold">{getStageLabel(stage)} • {progress}/100</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-pink-50 rounded-lg border-4 border-pink-200 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <PixelHeart className="w-4 h-4 text-rose-500" />
            <p className="text-xs text-pink-500 font-bold">Level</p>
          </div>
          <p className="text-2xl font-bold text-rose-600">{Math.floor(totalPomodoros / 100) + 1}</p>
        </div>

        <div className="p-3 bg-pink-50 rounded-lg border-4 border-pink-200 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <PixelStar className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-pink-500 font-bold">Total</p>
          </div>
          <p className="text-2xl font-bold text-rose-600">{totalPomodoros}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-pink-600">
          <span>Growth Progress</span>
          <span>{progress}/100</span>
        </div>
        <div className="h-4 bg-pink-100 rounded border-2 border-pink-300 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${creature.color} border-r-2 border-pink-400`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Evolution notice */}
      {canEvolve && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(234,179,8,0.3)]"
        >
          <div className="flex items-center gap-3">
            <PixelStar className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-bold text-yellow-800">Ready to evolve!</p>
              <p className="text-xs text-yellow-700">Pick a new creature below ♡</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Creature selector */}
      <div className="space-y-2">
        <button
          onClick={() => setShowCreatureSelect(!showCreatureSelect)}
          className="w-full p-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg font-bold text-white border-4 border-rose-500 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] transition-all"
        >
          {showCreatureSelect ? '✕ Close' : '♡ Pick Creature'}
        </button>

        <AnimatePresence>
          {showCreatureSelect && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2 p-2 bg-pink-50 rounded-lg border-4 border-pink-200">
                {creatures.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCreature(c.id);
                      setShowCreatureSelect(false);
                    }}
                    className={`p-3 rounded-lg border-4 transition-all ${
                      selectedCreature === c.id
                        ? `bg-gradient-to-br ${c.color} border-rose-400 shadow-[3px_3px_0px_0px_rgba(220,38,38,0.2)]`
                        : 'bg-white border-pink-200 hover:border-pink-300'
                    }`}
                  >
                    <c.component className="w-12 h-12 mx-auto" stage={0} />
                    <p className="text-xs font-bold text-rose-600 mt-1">{c.emoji}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feeding tip */}
      <div className="p-3 bg-pink-50 rounded-lg border-2 border-pink-200 text-center">
        <p className="text-xs text-pink-600 font-bold">
          Complete pomodoros to feed ur pet ♡
        </p>
        <p className="text-xs text-pink-500 mt-1">
          {stage === 4 ? 'Fully grown! Keep studying!' : 'Keep going to see evolution!'}
        </p>
      </div>
    </div>
  );
}
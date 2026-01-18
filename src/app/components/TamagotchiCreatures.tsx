import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface CreatureProps {
  className?: string;
  stage?: number;
  isHappy?: boolean;
  isBouncing?: boolean;
}

// BUNNY - True Tamagotchi pixel style
export function TamagotchiBunny({ className = '', stage = 0, isHappy = false, isBouncing = false }: CreatureProps) {
  const [frame, setFrame] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyesClosed(true);
      setTimeout(() => setEyesClosed(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Walk animation frames
  useEffect(() => {
    if (isHappy || isBouncing) {
      const walkInterval = setInterval(() => {
        setFrame(f => (f + 1) % 2);
      }, 300);
      return () => clearInterval(walkInterval);
    } else {
      setFrame(0);
    }
  }, [isHappy, isBouncing]);

  if (stage === 0) {
    // EGG
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        {/* Egg shape - pixel perfect */}
        <rect x="34" y="26" width="12" height="4" fill="#FFB3C1" />
        <rect x="30" y="30" width="20" height="4" fill="#FFC0CB" />
        <rect x="28" y="34" width="24" height="4" fill="#FFD1DC" />
        <rect x="26" y="38" width="28" height="12" fill="#FFE4E8" />
        <rect x="28" y="50" width="24" height="4" fill="#FFD1DC" />
        <rect x="30" y="54" width="20" height="4" fill="#FFC0CB" />
        <rect x="34" y="58" width="12" height="4" fill="#FFB3C1" />
        
        {/* Spots */}
        <rect x="36" y="42" width="4" height="4" fill="#FF69B4" />
        <rect x="44" y="44" width="4" height="4" fill="#FF69B4" />
      </svg>
    );
  }

  const bodySize = stage === 1 ? 1 : stage === 2 ? 1.1 : stage === 3 ? 1.2 : 1.3;
  
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <g transform={`scale(${bodySize}) translate(${40 * (1 - bodySize)}, ${40 * (1 - bodySize)})`}>
        {/* EARS - pixel style */}
        <g>
          {/* Left ear */}
          <rect x="20" y="18" width="4" height="4" fill="#FFD1DC" />
          <rect x="20" y="22" width="4" height="8" fill="#FFC0CB" />
          <rect x="22" y="24" width="2" height="4" fill="#FFE4E8" />
          
          {/* Right ear */}
          <rect x="56" y="18" width="4" height="4" fill="#FFD1DC" />
          <rect x="56" y="22" width="4" height="8" fill="#FFC0CB" />
          <rect x="56" y="24" width="2" height="4" fill="#FFE4E8" />
        </g>

        {/* HEAD - round pixel style */}
        <rect x="28" y="24" width="24" height="4" fill="#FFD1DC" />
        <rect x="24" y="28" width="32" height="20" fill="#FFE4E8" />
        <rect x="28" y="48" width="24" height="4" fill="#FFD1DC" />
        
        {/* CHEEKS */}
        <rect x="24" y="38" width="6" height="6" fill="#FFB3C1" opacity="0.7" />
        <rect x="50" y="38" width="6" height="6" fill="#FFB3C1" opacity="0.7" />

        {/* EYES */}
        {eyesClosed ? (
          <>
            <rect x="32" y="34" width="4" height="2" fill="#2C2C2C" />
            <rect x="44" y="34" width="4" height="2" fill="#2C2C2C" />
          </>
        ) : (
          <>
            {/* Left eye */}
            <rect x="32" y="32" width="4" height="6" fill="#2C2C2C" />
            <rect x="33" y="33" width="2" height="2" fill="#FFFFFF" />
            
            {/* Right eye */}
            <rect x="44" y="32" width="4" height="6" fill="#2C2C2C" />
            <rect x="45" y="33" width="2" height="2" fill="#FFFFFF" />
          </>
        )}

        {/* NOSE */}
        <rect x="38" y="40" width="4" height="4" fill="#FF69B4" />

        {/* MOUTH */}
        {isHappy ? (
          <>
            <rect x="34" y="44" width="2" height="2" fill="#FF69B4" />
            <rect x="36" y="46" width="8" height="2" fill="#FF69B4" />
            <rect x="44" y="44" width="2" height="2" fill="#FF69B4" />
          </>
        ) : (
          <rect x="36" y="44" width="8" height="2" fill="#FF69B4" />
        )}

        {/* BODY - if not baby */}
        {stage >= 2 && (
          <>
            <rect x="30" y="52" width="20" height="4" fill="#FFD1DC" />
            <rect x="26" y="56" width="28" height="12" fill="#FFE4E8" />
            <rect x="30" y="68" width="20" height="4" fill="#FFD1DC" />
            
            {/* ARMS - animated walking */}
            {frame === 0 ? (
              <>
                <rect x="20" y="56" width="6" height="10" fill="#FFC0CB" />
                <rect x="54" y="56" width="6" height="10" fill="#FFC0CB" />
              </>
            ) : (
              <>
                <rect x="20" y="58" width="6" height="10" fill="#FFC0CB" />
                <rect x="54" y="54" width="6" height="10" fill="#FFC0CB" />
              </>
            )}

            {/* FEET - animated walking */}
            {frame === 0 ? (
              <>
                <rect x="32" y="72" width="6" height="4" fill="#FFB3C1" />
                <rect x="42" y="72" width="6" height="4" fill="#FFB3C1" />
              </>
            ) : (
              <>
                <rect x="32" y="70" width="6" height="4" fill="#FFB3C1" />
                <rect x="42" y="74" width="6" height="4" fill="#FFB3C1" />
              </>
            )}
          </>
        )}

        {/* BOW - for teen and adult */}
        {stage >= 3 && (
          <g>
            <rect x="34" y="20" width="4" height="4" fill="#FF69B4" />
            <rect x="42" y="20" width="4" height="4" fill="#FF69B4" />
            <rect x="38" y="20" width="4" height="4" fill="#FF1493" />
          </g>
        )}

        {/* TAIL - for adult */}
        {stage >= 4 && (
          <>
            <rect x="58" y="60" width="4" height="4" fill="#FFD1DC" />
            <rect x="60" y="58" width="4" height="4" fill="#FFC0CB" />
          </>
        )}
      </g>
    </svg>
  );
}

// CAT - True Tamagotchi pixel style
export function TamagotchiCat({ className = '', stage = 0, isHappy = false, isBouncing = false }: CreatureProps) {
  const [frame, setFrame] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [tailFrame, setTailFrame] = useState(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyesClosed(true);
      setTimeout(() => setEyesClosed(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (isHappy || isBouncing) {
      const walkInterval = setInterval(() => {
        setFrame(f => (f + 1) % 2);
      }, 300);
      return () => clearInterval(walkInterval);
    } else {
      setFrame(0);
    }
  }, [isHappy, isBouncing]);

  // Tail animation - always moving
  useEffect(() => {
    const tailInterval = setInterval(() => {
      setTailFrame(f => (f + 1) % 3);
    }, 500);
    return () => clearInterval(tailInterval);
  }, []);

  if (stage === 0) {
    // EGG
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <rect x="34" y="26" width="12" height="4" fill="#BA68C8" />
        <rect x="30" y="30" width="20" height="4" fill="#CE93D8" />
        <rect x="28" y="34" width="24" height="4" fill="#E1BEE7" />
        <rect x="26" y="38" width="28" height="12" fill="#F3E5F5" />
        <rect x="28" y="50" width="24" height="4" fill="#E1BEE7" />
        <rect x="30" y="54" width="20" height="4" fill="#CE93D8" />
        <rect x="34" y="58" width="12" height="4" fill="#BA68C8" />
        
        <rect x="36" y="42" width="4" height="4" fill="#9C27B0" />
        <rect x="44" y="44" width="4" height="4" fill="#9C27B0" />
      </svg>
    );
  }

  const bodySize = stage === 1 ? 1 : stage === 2 ? 1.1 : stage === 3 ? 1.2 : 1.3;
  
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <g transform={`scale(${bodySize}) translate(${40 * (1 - bodySize)}, ${40 * (1 - bodySize)})`}>
        {/* EARS - pointy pixel triangles */}
        <g>
          {/* Left ear */}
          <rect x="24" y="20" width="4" height="4" fill="#E1BEE7" />
          <rect x="26" y="16" width="4" height="4" fill="#CE93D8" />
          <rect x="28" y="12" width="4" height="4" fill="#BA68C8" />
          <rect x="27" y="18" width="2" height="4" fill="#F3E5F5" />
          
          {/* Right ear */}
          <rect x="52" y="20" width="4" height="4" fill="#E1BEE7" />
          <rect x="50" y="16" width="4" height="4" fill="#CE93D8" />
          <rect x="48" y="12" width="4" height="4" fill="#BA68C8" />
          <rect x="51" y="18" width="2" height="4" fill="#F3E5F5" />
        </g>

        {/* HEAD */}
        <rect x="28" y="24" width="24" height="4" fill="#E1BEE7" />
        <rect x="24" y="28" width="32" height="20" fill="#F3E5F5" />
        <rect x="28" y="48" width="24" height="4" fill="#E1BEE7" />
        
        {/* CHEEKS */}
        <rect x="22" y="38" width="8" height="6" fill="#CE93D8" opacity="0.6" />
        <rect x="50" y="38" width="8" height="6" fill="#CE93D8" opacity="0.6" />

        {/* EYES - cat style */}
        {eyesClosed ? (
          <>
            <rect x="32" y="34" width="4" height="2" fill="#2C2C2C" />
            <rect x="44" y="34" width="4" height="2" fill="#2C2C2C" />
          </>
        ) : (
          <>
            {/* Left eye */}
            <rect x="32" y="32" width="4" height="6" fill="#2C2C2C" />
            <rect x="33" y="34" width="2" height="4" fill="#9C27B0" />
            <rect x="34" y="33" width="1" height="2" fill="#FFFFFF" />
            
            {/* Right eye */}
            <rect x="44" y="32" width="4" height="6" fill="#2C2C2C" />
            <rect x="45" y="34" width="2" height="4" fill="#9C27B0" />
            <rect x="46" y="33" width="1" height="2" fill="#FFFFFF" />
          </>
        )}

        {/* WHISKERS - pixel lines */}
        <rect x="16" y="38" width="6" height="2" fill="#9C27B0" />
        <rect x="16" y="42" width="6" height="2" fill="#9C27B0" />
        <rect x="58" y="38" width="6" height="2" fill="#9C27B0" />
        <rect x="58" y="42" width="6" height="2" fill="#9C27B0" />

        {/* NOSE */}
        <rect x="38" y="40" width="4" height="4" fill="#FF69B4" />

        {/* MOUTH */}
        {isHappy ? (
          <>
            <rect x="40" y="44" width="2" height="2" fill="#FF69B4" />
            <rect x="34" y="44" width="2" height="2" fill="#FF69B4" />
            <rect x="36" y="46" width="8" height="2" fill="#FF69B4" />
            <rect x="44" y="44" width="2" height="2" fill="#FF69B4" />
          </>
        ) : (
          <>
            <rect x="36" y="44" width="2" height="2" fill="#FF69B4" />
            <rect x="40" y="44" width="2" height="2" fill="#FF69B4" />
            <rect x="42" y="44" width="2" height="2" fill="#FF69B4" />
          </>
        )}

        {/* BODY */}
        {stage >= 2 && (
          <>
            <rect x="30" y="52" width="20" height="4" fill="#E1BEE7" />
            <rect x="26" y="56" width="28" height="12" fill="#F3E5F5" />
            <rect x="30" y="68" width="20" height="4" fill="#E1BEE7" />
            
            {/* FEET - walking animation */}
            {frame === 0 ? (
              <>
                <rect x="32" y="72" width="6" height="4" fill="#CE93D8" />
                <rect x="42" y="72" width="6" height="4" fill="#CE93D8" />
              </>
            ) : (
              <>
                <rect x="32" y="70" width="6" height="4" fill="#CE93D8" />
                <rect x="42" y="74" width="6" height="4" fill="#CE93D8" />
              </>
            )}

            {/* TAIL - animated swish */}
            {tailFrame === 0 && (
              <>
                <rect x="54" y="60" width="4" height="8" fill="#E1BEE7" />
                <rect x="56" y="56" width="4" height="4" fill="#CE93D8" />
              </>
            )}
            {tailFrame === 1 && (
              <>
                <rect x="54" y="58" width="4" height="10" fill="#E1BEE7" />
                <rect x="58" y="56" width="4" height="4" fill="#CE93D8" />
              </>
            )}
            {tailFrame === 2 && (
              <>
                <rect x="54" y="60" width="4" height="8" fill="#E1BEE7" />
                <rect x="56" y="68" width="4" height="4" fill="#CE93D8" />
              </>
            )}
          </>
        )}
      </g>
    </svg>
  );
}

// BEAR - True Tamagotchi pixel style
export function TamagotchiBear({ className = '', stage = 0, isHappy = false, isBouncing = false }: CreatureProps) {
  const [frame, setFrame] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyesClosed(true);
      setTimeout(() => setEyesClosed(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (isHappy || isBouncing) {
      const walkInterval = setInterval(() => {
        setFrame(f => (f + 1) % 2);
      }, 300);
      return () => clearInterval(walkInterval);
    } else {
      setFrame(0);
    }
  }, [isHappy, isBouncing]);

  if (stage === 0) {
    // EGG
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none">
        <rect x="34" y="26" width="12" height="4" fill="#FFB74D" />
        <rect x="30" y="30" width="20" height="4" fill="#FFCC80" />
        <rect x="28" y="34" width="24" height="4" fill="#FFE0B2" />
        <rect x="26" y="38" width="28" height="12" fill="#FFF3E0" />
        <rect x="28" y="50" width="24" height="4" fill="#FFE0B2" />
        <rect x="30" y="54" width="20" height="4" fill="#FFCC80" />
        <rect x="34" y="58" width="12" height="4" fill="#FFB74D" />
        
        <rect x="36" y="42" width="4" height="4" fill="#FF9800" />
        <rect x="44" y="44" width="4" height="4" fill="#FF9800" />
      </svg>
    );
  }

  const bodySize = stage === 1 ? 1 : stage === 2 ? 1.1 : stage === 3 ? 1.2 : 1.3;
  
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <g transform={`scale(${bodySize}) translate(${40 * (1 - bodySize)}, ${40 * (1 - bodySize)})`}>
        {/* EARS - round pixel circles */}
        <g>
          {/* Left ear */}
          <rect x="22" y="18" width="8" height="4" fill="#FFCC80" />
          <rect x="20" y="22" width="12" height="8" fill="#FFE0B2" />
          <rect x="24" y="24" width="4" height="4" fill="#FFF3E0" />
          
          {/* Right ear */}
          <rect x="50" y="18" width="8" height="4" fill="#FFCC80" />
          <rect x="48" y="22" width="12" height="8" fill="#FFE0B2" />
          <rect x="52" y="24" width="4" height="4" fill="#FFF3E0" />
        </g>

        {/* HEAD */}
        <rect x="28" y="24" width="24" height="4" fill="#FFCC80" />
        <rect x="24" y="28" width="32" height="20" fill="#FFE0B2" />
        <rect x="28" y="48" width="24" height="4" fill="#FFCC80" />
        
        {/* SNOUT/MUZZLE */}
        <rect x="32" y="38" width="16" height="10" fill="#FFF3E0" />

        {/* EYES */}
        {eyesClosed ? (
          <>
            <rect x="32" y="32" width="4" height="2" fill="#5D4037" />
            <rect x="44" y="32" width="4" height="2" fill="#5D4037" />
          </>
        ) : (
          <>
            {/* Left eye */}
            <rect x="30" y="30" width="6" height="6" fill="#5D4037" />
            <rect x="32" y="31" width="2" height="2" fill="#FFFFFF" />
            
            {/* Right eye */}
            <rect x="44" y="30" width="6" height="6" fill="#5D4037" />
            <rect x="46" y="31" width="2" height="2" fill="#FFFFFF" />
          </>
        )}

        {/* NOSE - big triangle */}
        <rect x="38" y="42" width="4" height="4" fill="#8D6E63" />
        <rect x="36" y="44" width="8" height="2" fill="#8D6E63" />

        {/* MOUTH */}
        {isHappy ? (
          <>
            <rect x="34" y="46" width="2" height="2" fill="#8D6E63" />
            <rect x="36" y="48" width="8" height="2" fill="#8D6E63" />
            <rect x="44" y="46" width="2" height="2" fill="#8D6E63" />
          </>
        ) : (
          <rect x="36" y="46" width="8" height="2" fill="#8D6E63" />
        )}

        {/* BODY */}
        {stage >= 2 && (
          <>
            <rect x="30" y="52" width="20" height="4" fill="#FFCC80" />
            <rect x="26" y="56" width="28" height="14" fill="#FFE0B2" />
            <rect x="30" y="70" width="20" height="4" fill="#FFCC80" />
            
            {/* BELLY */}
            <rect x="34" y="58" width="12" height="10" fill="#FFF3E0" />
            
            {/* ARMS - animated */}
            {frame === 0 ? (
              <>
                <rect x="20" y="56" width="6" height="12" fill="#FFCC80" />
                <rect x="54" y="56" width="6" height="12" fill="#FFCC80" />
              </>
            ) : (
              <>
                <rect x="20" y="58" width="6" height="12" fill="#FFCC80" />
                <rect x="54" y="54" width="6" height="12" fill="#FFCC80" />
              </>
            )}

            {/* FEET */}
            {frame === 0 ? (
              <>
                <rect x="32" y="74" width="6" height="4" fill="#FFB74D" />
                <rect x="42" y="74" width="6" height="4" fill="#FFB74D" />
              </>
            ) : (
              <>
                <rect x="32" y="72" width="6" height="4" fill="#FFB74D" />
                <rect x="42" y="76" width="6" height="4" fill="#FFB74D" />
              </>
            )}
          </>
        )}

        {/* HONEY POT - for adult */}
        {stage >= 4 && (
          <g transform="translate(58, 56)">
            <rect x="0" y="0" width="10" height="8" fill="#FFC107" />
            <rect x="2" y="2" width="6" height="4" fill="#FFD54F" />
          </g>
        )}
      </g>
    </svg>
  );
}

export const creatures = [
  {
    id: 'bunny',
    name: 'Cherry Bunny',
    component: TamagotchiBunny,
    color: 'from-pink-100 via-pink-50 to-rose-50',
    emoji: '🐰',
  },
  {
    id: 'cat',
    name: 'Lavender Cat',
    component: TamagotchiCat,
    color: 'from-purple-100 via-purple-50 to-pink-50',
    emoji: '🐱',
  },
  {
    id: 'bear',
    name: 'Honey Bear',
    component: TamagotchiBear,
    color: 'from-amber-100 via-orange-50 to-yellow-50',
    emoji: '🐻',
  },
];

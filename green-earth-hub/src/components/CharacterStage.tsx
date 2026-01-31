import React from 'react';
import { Character } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

import aaravDetermined from '../assets/Aarav_determined.png';
import aaravFrustrated from '../assets/Aarav_frustrated.png';
import aaravInspired from '../assets/Aarav_inspired.png';
import aaravWorried from '../assets/Aarav_worried.png';
import mayaConcerned from '../assets/Maya_concerned.png';
import mayaConfident from '../assets/Maya_confident.png';

interface CharacterStageProps {
  characters: Character[];
}

// Fallback for unknown expressions
const CHAR_IMAGES: Record<string, Record<string, string>> = {
  'Aarav': {
    'determined': aaravDetermined,
    'frustrated': aaravFrustrated,
    'inspired': aaravInspired,
    'worried': aaravWorried,
    'neutral': aaravDetermined, // fallback
    'happy': aaravInspired,    // fallback
    'angry': aaravFrustrated   // fallback
  },
  'Maya': {
    'concerned': mayaConcerned,
    'confident': mayaConfident,
    'happy': mayaConfident,    // fallback
    'worried': mayaConcerned,  // fallback
    'determined': mayaConfident // fallback
  }
};

export const CharacterStage: React.FC<CharacterStageProps> = ({ characters }) => {
  // Helper to get position styles
  const getPosition = (pos: string) => {
    switch (pos) {
      case 'left': return 'left-[5%] md:left-[10%]';
      case 'center': return 'left-1/2 -translate-x-1/2';
      case 'right': return 'right-[5%] md:right-[10%]';
      default: return 'left-1/2';
    }
  };

  const getCharacterImage = (id: string, expression: string) => {
    const char = CHAR_IMAGES[id];
    if (char && char[expression]) return char[expression];
    // Attempt fallback to neutral or first key
    if (char) return Object.values(char)[0];
    return null;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {characters.map((char) => {
          const imageSrc = getCharacterImage(char.id, char.expression || 'neutral');

          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: -120 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className={`absolute top-[40%] -translate-y-1/2 h-auto w-auto max-w-[400px] flex items-end justify-center ${getPosition(char.position)}`}
            >
              {imageSrc ? (
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src={imageSrc}
                    alt={`${char.id} ${char.expression}`}
                    className="h-[50vh] w-auto object-cover"
                  />
                </div>
              ) : (
                // Fallback for missing characters
                <div className="h-full w-[300px] bg-gray-500/50 flex items-center justify-center rounded-t-3xl border-4 border-white">
                  <span className="text-4xl text-white font-bold">{char.id}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

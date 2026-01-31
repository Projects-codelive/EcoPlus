import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';
import { CharacterStage } from './CharacterStage';
import { DialogueBox } from './DialogueBox';
import { ChoiceButtons } from './ChoiceButtons';
import { WorldEffects } from './WorldEffects';
import { AnimatePresence, motion } from 'framer-motion';

export const SceneView: React.FC = () => {
  const { currentSceneId, makeChoice, nextScene, isGameOver, ending } = useGameStore();
  const scene = scenes[currentSceneId];

  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [reactionText, setReactionText] = useState<string | null>(null);

  // Reset state when scene changes
  useEffect(() => {
    setDialogueIndex(0);
    setShowChoices(false);
    setReactionText(null);
    setIsTyping(true);
  }, [currentSceneId]);

  if (!scene && !isGameOver) return <div>Loading...</div>;

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white p-10 text-center">
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">GAME OVER</h1>
        <h2 className="text-3xl mb-8">Ending: {ending}</h2>
        <p className="max-w-xl text-lg text-gray-300 mb-12">
          Your choices have shaped the future of Neovara. The tides have settled, but the threads of your actions remain.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  const currentDialogue = scene.dialogue[dialogueIndex];

  const handleDialogueComplete = () => {
    if (dialogueIndex < scene.dialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      setShowChoices(true);
    }
  };

  const handleChoice = (choice: any) => {
    makeChoice(choice);
    setShowChoices(false);
    setReactionText(choice.reactionText);

    // Reaction beat delay
    setTimeout(() => {
      nextScene(choice.nextSceneId);
    }, 2500);
  };

  // Background mapping
  const getBackground = (bg: string) => {
    // Using gradients/colors as placeholders for now
    switch (bg) {
      case 'city_morning': return 'bg-gradient-to-b from-blue-200 to-blue-100';
      case 'city_smog': return 'bg-gradient-to-b from-yellow-900 to-gray-800';
      case 'flood_warning': return 'bg-gradient-to-b from-purple-900 to-black';
      case 'community_center': return 'bg-gradient-to-b from-orange-100 to-orange-50';
      case 'park_withered': return 'bg-gradient-to-b from-gray-700 to-gray-600';
      case 'park_blooming': return 'bg-gradient-to-b from-green-300 to-green-100';
      case 'apartment': return 'bg-gradient-to-b from-slate-800 to-slate-900';
      default: return 'bg-gray-900';
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${getBackground(scene.background)} transition-colors duration-1000`}>
      
      {/* World Effects Layer */}
      <WorldEffects />

      {/* Characters Layer */}
      <CharacterStage characters={scene.characters} />

      {/* UI Layer */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between pointer-events-none">
        {/* Top Bar (Location/Date placeholder) */}
        <div className="p-6 flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur px-4 py-2 rounded text-white/80 text-sm font-mono">
            NEOVARA | 2028
          </div>
        </div>

        {/* Reaction Text Overlay */}
        <AnimatePresence>
          {reactionText && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
            >
              <p className="text-2xl md:text-3xl text-white font-serif italic max-w-2xl text-center px-8 leading-relaxed">
                "{reactionText}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogue & Choices */}
        <div className="pointer-events-auto">
          {!showChoices && !reactionText && (
            <DialogueBox 
              dialogue={currentDialogue} 
              onComplete={handleDialogueComplete}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
            />
          )}

          {showChoices && !reactionText && (
            <ChoiceButtons 
              choices={scene.choices} 
              onChoose={handleChoice} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

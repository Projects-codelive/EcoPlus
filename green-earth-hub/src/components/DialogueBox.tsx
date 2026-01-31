import React, { useState, useEffect } from 'react';
import { DialogueLine } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueBoxProps {
  dialogue: DialogueLine;
  onComplete: () => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onComplete, isTyping, setIsTyping }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
    setIsTyping(true);
  }, [dialogue, setIsTyping]);

  useEffect(() => {
    if (charIndex < dialogue.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + dialogue.text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 30); // Typing speed
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [charIndex, dialogue.text, setIsTyping]);

  const handleClick = () => {
    if (isTyping) {
      // Instant finish
      setDisplayedText(dialogue.text);
      setCharIndex(dialogue.text.length);
      setIsTyping(false);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-30 flex flex-col justify-end pb-8 px-12 cursor-pointer"
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={dialogue.speaker}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-xl font-bold text-cta uppercase tracking-wider">
              {dialogue.speaker === 'You' ? '' : dialogue.speaker}
            </span>
          </div>

          <div className="bg-card/95 backdrop-blur-sm border border-primary/10 p-6 rounded-3xl shadow-xl min-h-[100px]">
            <p className="text-lg text-primary font-light leading-relaxed font-sans">
              {displayedText}
              {isTyping && <span className="animate-pulse text-cta">|</span>}
            </p>

            {!isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 right-6 text-xs text-cta uppercase tracking-widest animate-bounce"
              >
                Click to continue ▼
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

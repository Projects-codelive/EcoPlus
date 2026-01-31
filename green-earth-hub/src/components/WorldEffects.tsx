import React from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export const WorldEffects: React.FC = () => {
  const { currentSceneId, world } = useGameStore();
  const scene = scenes[currentSceneId];
  
  // Determine overlays based on scene weather and world state
  const isSmoggy = scene?.weather === 'smog' || world.airQuality < 30;
  const isRaining = scene?.weather === 'rain' || scene?.weather === 'storm';
  const isStormy = scene?.weather === 'storm';
  
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Smog Overlay */}
      <div 
        className={`absolute inset-0 bg-yellow-900/20 mix-blend-multiply transition-opacity duration-1000 ${isSmoggy ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div 
        className={`absolute inset-0 bg-gray-500/10 backdrop-blur-[1px] transition-opacity duration-1000 ${isSmoggy ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Rain Effect (CSS Animation) */}
      {isRaining && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent opacity-50">
          {/* Simple CSS rain would go here, using a static overlay for now */}
          <div className="w-full h-full bg-[url('https://raw.githubusercontent.com/youware-ai/assets/main/rain-overlay.png')] opacity-30 animate-pulse" />
        </div>
      )}

      {/* Storm Flashes */}
      {isStormy && (
        <div className="absolute inset-0 bg-white opacity-0 animate-[pulse_5s_ease-in-out_infinite] mix-blend-overlay" />
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
    </div>
  );
};

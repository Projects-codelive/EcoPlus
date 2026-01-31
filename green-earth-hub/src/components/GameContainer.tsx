import React from 'react';
import { SceneView } from './SceneView.tsx';
import { MetersSidebar } from './MetersSidebar.tsx';

import { BackgroundMusic } from './BackgroundMusic.tsx';

export const GameContainer: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <BackgroundMusic />
      <MetersSidebar />
      <div className="flex-1 relative">
        <SceneView />
      </div>
    </div>
  );
};

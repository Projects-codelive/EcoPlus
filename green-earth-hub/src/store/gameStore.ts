import { create } from 'zustand';
import { GameState, SceneId, Choice } from '../types/game';
import { scenes } from '../data/scenes';

interface GameStore extends GameState {
  // Actions
  startGame: () => void;
  makeChoice: (choice: Choice) => void;
  nextScene: (sceneId: SceneId) => void;
  resetGame: () => void;
  calculateEnding: () => void;
}

const INITIAL_STATE: GameState = {
  currentSceneId: 'start',
  history: [],
  meters: {
    awareness: 0,
    impact: 0,
    empathy: 0,
    action: 0,
  },
  world: {
    airQuality: 50,
    waterLevel: 50,
    biodiversity: 50,
  },
  emotions: {
    fear: 20,
    hope: 50,
    empowerment: 20,
  },
  isGameOver: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  startGame: () => {
    set({ ...INITIAL_STATE });
  },

  makeChoice: (choice: Choice) => {
    const { meters, world, emotions } = get();
    const impact = choice.impact;

    // Update meters
    const newMeters = {
      awareness: Math.min(100, Math.max(0, meters.awareness + (impact.awareness || 0))),
      impact: Math.min(100, Math.max(0, meters.impact + (impact.impact || 0))),
      empathy: Math.min(100, Math.max(0, meters.empathy + (impact.empathy || 0))),
      action: Math.min(100, Math.max(0, meters.action + (impact.action || 0))),
    };

    // Update world state
    const newWorld = {
      airQuality: Math.min(100, Math.max(0, world.airQuality + (impact.airQuality || 0))),
      waterLevel: Math.min(100, Math.max(0, world.waterLevel + (impact.waterLevel || 0))),
      biodiversity: Math.min(100, Math.max(0, world.biodiversity + (impact.biodiversity || 0))),
    };

    // Update emotions
    const newEmotions = {
      fear: Math.min(100, Math.max(0, emotions.fear + (impact.fear || 0))),
      hope: Math.min(100, Math.max(0, emotions.hope + (impact.hope || 0))),
      empowerment: Math.min(100, Math.max(0, emotions.empowerment + (impact.empowerment || 0))),
    };

    set({
      meters: newMeters,
      world: newWorld,
      emotions: newEmotions,
    });
  },

  nextScene: (sceneId: SceneId) => {
    const { history } = get();
    set({
      currentSceneId: sceneId,
      history: [...history, sceneId],
    });

    if (sceneId === 'ending') {
      get().calculateEnding();
    }
  },

  resetGame: () => {
    set({ ...INITIAL_STATE });
  },

  calculateEnding: () => {
    const { meters } = get();
    const totalScore = meters.awareness + meters.impact + meters.empathy + meters.action;
    let ending: GameState['ending'] = 'Passive Observer';

    if (meters.action > 80 && meters.impact > 70) {
      ending = 'Climate Champion';
    } else if (meters.empathy > 80 && meters.awareness > 70) {
      ending = 'Community Catalyst';
    } else if (meters.impact < 30) {
      ending = 'Unintentional Polluter';
    }

    set({ isGameOver: true, ending });
  },
}));

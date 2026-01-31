export type CharacterId = 'Aarav' | 'Maya' | 'You' | 'System';
export type Expression = 'neutral' | 'worried' | 'determined' | 'frustrated' | 'hopeful' | 'happy' | 'angry';
export type SceneId = string;

export interface CharacterState {
  id: CharacterId;
  expression: Expression;
  position: 'left' | 'center' | 'right' | 'hidden';
}

export interface DialogueLine {
  speaker: CharacterId;
  text: string;
  expression?: Expression; // Updates the character's expression for this line
  side?: 'left' | 'right' | 'center'; // Visual placement focus
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: SceneId;
  impact: {
    awareness?: number;
    impact?: number;
    empathy?: number;
    action?: number;
    airQuality?: number;
    waterLevel?: number;
    biodiversity?: number;
    fear?: number;
    hope?: number;
    empowerment?: number;
  };
  reactionText: string; // The immediate reaction line shown after clicking
}

export interface Scene {
  id: SceneId;
  background: 'city_morning' | 'city_smog' | 'flood_warning' | 'community_center' | 'park_withered' | 'park_blooming' | 'apartment';
  characters: CharacterState[]; // Initial character setup for the scene
  dialogue: DialogueLine[];
  choices: Choice[];
  music?: 'calm' | 'tension' | 'hope' | 'crisis';
  weather?: 'clear' | 'rain' | 'smog' | 'storm';
}

export interface GameState {
  currentSceneId: SceneId;
  history: SceneId[];
  meters: {
    awareness: number;
    impact: number;
    empathy: number;
    action: number;
  };
  world: {
    airQuality: number; // 0-100 (100 is best)
    waterLevel: number; // 0-100 (0 is normal, 100 is flood)
    biodiversity: number; // 0-100
  };
  emotions: {
    fear: number;
    hope: number;
    empowerment: number;
  };
  isGameOver: boolean;
  ending?: 'Climate Champion' | 'Community Catalyst' | 'Passive Observer' | 'Unintentional Polluter';
}

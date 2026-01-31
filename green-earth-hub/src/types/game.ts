export type SceneId = string;

export interface DialogueLine {
    speaker: string;
    text: string;
}

export interface Impact {
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
}

export interface Choice {
    id: string;
    text: string;
    nextSceneId: SceneId;
    reactionText: string;
    impact: Impact;
}

export interface Character {
    id: string;
    name: string;
    image: string; // URL or path
    position: 'left' | 'center' | 'right';
    expression?: string;
}

export interface Scene {
    id: SceneId;
    background: string;
    characters: Character[];
    dialogue: DialogueLine[];
    choices: Choice[];
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
        airQuality: number;
        waterLevel: number;
        biodiversity: number;
    };
    emotions: {
        fear: number;
        hope: number;
        empowerment: number;
    };
    isGameOver: boolean;
    ending?: string;
}

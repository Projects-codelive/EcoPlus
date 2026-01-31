import level1 from '/Level_1.png';
import level2 from '/Level_2.png';
import level3 from '/Level__3.png';
import level4 from '/Level_4.png';
import level5 from '/Level_5.jpg';
import level6 from '/Level_6.jpg';
import level7 from '/Level_7.jpg';

export interface LevelData {
    level: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    avatar: string;
}

export const LEVEL_THRESHOLDS: LevelData[] = [
    { level: 1, name: 'Novice', minPoints: 0, maxPoints: 100, avatar: level1 },
    { level: 2, name: 'Scout', minPoints: 101, maxPoints: 300, avatar: level2 },
    { level: 3, name: 'Guardian', minPoints: 301, maxPoints: 600, avatar: level3 },
    { level: 4, name: 'Champion', minPoints: 601, maxPoints: 1000, avatar: level4 },
    { level: 5, name: 'Hero', minPoints: 1001, maxPoints: 1500, avatar: level5 },
    { level: 6, name: 'Legend', minPoints: 1501, maxPoints: 2100, avatar: level6 },
    { level: 7, name: 'Mythic', minPoints: 2101, maxPoints: Infinity, avatar: level7 },
];

export const getUserLevel = (points: number): LevelData => {
    const level = LEVEL_THRESHOLDS.find(l => points >= l.minPoints && points <= l.maxPoints);
    return level || LEVEL_THRESHOLDS[0];
};

export const getNextLevel = (currentLevel: number): LevelData | null => {
    if (currentLevel >= LEVEL_THRESHOLDS.length) return null;
    return LEVEL_THRESHOLDS.find(l => l.level === currentLevel + 1) || null;
};
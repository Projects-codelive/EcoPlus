export const LEVEL_THRESHOLDS = [
    { level: 1, name: "Seedling", minPoints: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seedling" },
    { level: 2, name: "Sprout", minPoints: 500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sprout" },
    { level: 3, name: "Sapling", minPoints: 1000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sapling" },
    { level: 4, name: "Tree", minPoints: 2000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tree" },
    { level: 5, name: "Forest", minPoints: 4000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Forest" },
];

export const getUserLevel = (points: number) => {
    // Find the highest level where points >= minPoints
    // We can reverse the array to find the first match, or just loop
    let currentLevel = LEVEL_THRESHOLDS[0];

    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (points >= LEVEL_THRESHOLDS[i].minPoints) {
            currentLevel = LEVEL_THRESHOLDS[i];
            break;
        }
    }

    // Calculate progress to next level
    const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === currentLevel.level + 1);
    const nextLevel = nextLevelIndex !== -1 ? LEVEL_THRESHOLDS[nextLevelIndex] : null;

    let progress = 0;
    if (nextLevel) {
        const range = nextLevel.minPoints - currentLevel.minPoints;
        const gained = points - currentLevel.minPoints;
        progress = Math.min(100, Math.max(0, (gained / range) * 100));
    } else {
        progress = 100; // Max level reached
    }

    return {
        ...currentLevel,
        progress,
        nextLevelPoints: nextLevel ? nextLevel.minPoints : null
    };
};

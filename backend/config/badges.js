export const ALL_POSSIBLE_BADGES = [
    {
        id: 1,
        name: 'Seed Planter',
        icon: '🌱',
        description: 'Complete your very first climate quiz.',
        criteria: { quizzesCompleted: 1 }
    },
    {
        id: 2,
        name: 'Climate Scholar',
        icon: '📚',
        description: 'Complete 2 quizzes on Climate Science.',
        criteria: { subject: 'Climate Science', count: 2 }
    },
    {
        id: 3,
        name: 'Ocean Defender',
        icon: '🌊',
        description: 'Score 60%+ in an Oceans & Water quiz.',
        criteria: { subject: 'Oceans', minPercentage: 60 }
    },
    {
        id: 4,
        name: 'Green Genius',
        icon: '🧠',
        description: 'Complete any quiz with an average score of 70% or higher.',
        criteria: { minPercentage: 70 }
    },
    {
        id: 5,
        name: 'Habit Hero',
        icon: '♻️',
        description: 'Engage with the platform on 2 different days.',
        criteria: { uniqueDays: 2 }
    },
    {
        id: 6,
        name: 'Change Maker',
        icon: '🌍',
        description: 'Complete 5 unique lessons or quizzes.',
        criteria: { uniqueQuizzes: 5 }
    },
    {
        id: 7,
        name: 'Net Zero Hero',
        icon: '🦸',
        description: 'Achieve a perfect score (100%) in any quiz.',
        criteria: { minPercentage: 100 }
    },
    {
        id: 8,
        name: 'Nocturnal Nature',
        icon: '🦉',
        description: 'Complete a learning module after 10 PM.',
        criteria: { afterHour: 22 }
    },
];


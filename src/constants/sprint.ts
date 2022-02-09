export type GameWord = {
    question: string;
    answer: string;
    right: boolean;
    rightAnswer: string;
    userAnswer: boolean;
}

type Sprint = {
    gameOptions: Array<string>;
    difficult: number;
    gameWords: Array<GameWord>;
    page: number;
    group: number;
    count: number;
    score: number;
    answerSeries: number;
    seriesTotalStatistics: number;
    advanceScore: Array<number>;
}

export const sprintGame: Sprint = {
    gameOptions: ['SCORE: ', 'right-answer', 'wrong-answer'],
    difficult: 1,
    gameWords: [],
    page: 0,
    group: 0,
    count: 0,
    score: 0,
    answerSeries: 0,
    seriesTotalStatistics: 0,
    advanceScore: [10, 20, 30, 40, 50, 60, 70],
}

export type GameWord = {
    question: string;
    answer: string;
    right: boolean;
    rightAnswer: string;
    userAnswer: boolean;
}

type Sprint = {
    difficult: number;
    gameWords: Array<GameWord>;
    page: number;
    group: number;
    count: number;
    score: number;
}

export const sprintGame: Sprint = {
    difficult: 1,
    gameWords: [],
    page: 0,
    group: 0,
    count: 0,
    score: 0,
}

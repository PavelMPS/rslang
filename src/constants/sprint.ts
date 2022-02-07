export type GameWord = {
    question: string;
    answer: string;
    right: boolean;
}

type Sprint = {
    difficult: number;
    gameWords: Array<GameWord>;
    userAnswers: Array<GameWord>;
    page: number;
    group: number;
    count: number;
    score: number;
}

export const sprintGame: Sprint = {
    difficult: 1,
    gameWords: [],
    userAnswers: [],
    page: 0,
    group: 0,
    count: 0,
    score: 0,
}

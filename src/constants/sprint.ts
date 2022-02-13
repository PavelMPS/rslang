export type GameWord = {
    id: string;
    word: string;
    answer: string;
    right: boolean;
    wordTranslate: string;
    userAnswer: boolean;
    audio: string;
}

export type Sprint = {
    gameOptions: Array<string>;
    gameOver: Array<string>;
    difficult: number;
    gameWords: Array<GameWord>;
    page: number;
    group: number;
    count: number;
    score: number;
    newWords: number;
    allAnswers: number;
    rightAnswers: number;
    learnedWords: number;
    currentAnswerSerie: number;
    maxSerie: number;
    advanceScore: Array<number>;
}

export const sprintGame: Sprint = {
    gameOptions: ['SCORE: ', 'right-answer', 'wrong-answer', 'Your score is: ', 'Try again?'],
    gameOver: ['Don\'t despair!', 'Nice work!','You dont answer any question :('],
    difficult: 1,
    gameWords: [],
    page: 0,
    group: 0,
    count: 0,
    score: 0,
    newWords: 0,
    allAnswers: 0,
    rightAnswers: 0,
    learnedWords: 0,
    currentAnswerSerie: 0,
    maxSerie: 0,
    advanceScore: [10, 20, 30, 40, 50, 60, 70],
}

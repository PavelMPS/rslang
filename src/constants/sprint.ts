export type GameWord = {
    id: string;
    word: string;
    answer: string;
    right: boolean;
    wordTranslate: string;
    userAnswer: boolean;
    audio: string;
}

type Sprint = {
    gameOptions: Array<string>;
    gameOver: Array<string>;
    gameMessages: Array<string>;
    difficult: number;
    gameWords: Array<GameWord>;
    page: number;
    group: number;
    count: number;
    score: number;
    answerSeries: number;
    seriesTotalStatistics: number;
    advanceScore: Array<number>;
    rightAnswers: number,
    allAnswers: number,
    fromTextbook: boolean,
}

export const sprintGame: Sprint = {
    gameOptions: ['SCORE: ', 'right-answer', 'wrong-answer', 'Your score is: ', 'Try again?', 'Question: '],
    gameOver: ['Don\'t despair!', 'Nice work!','You dont answer any question :('],
    gameMessages: ['nice!', 'good!', 'very good!', 'amazing!', 'excellent!', 'impressive!', 'godlike!'],
    difficult: 1,
    gameWords: [],
    page: 0,
    group: 0,
    count: 0,
    score: 0,
    answerSeries: 0,
    seriesTotalStatistics: 0,
    advanceScore: [10, 20, 30, 40, 50, 60, 70],
    rightAnswers: 0,
    allAnswers: 0,
    fromTextbook: true,
}

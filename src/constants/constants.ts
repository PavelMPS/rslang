export const sprint: string = 'sprint';
export const audiochallenge: string = 'audiochallenge';

export const maxLives: number = 5;
export const averegeSprintGameScore: number = 100;
export const minScore: number = 0;
export const answersLength = 5;

export const maxQuestionCount = 20;

export const maxPageCount = 30;

export const difficultWeak = 'easy';
export const difficultHeavy = 'hard';

export const filters = {
    hard: `filter={"$and":[{"userWord.difficulty": "hard"}]}&wordsPerPage=3600`,
}

export const optionFilter = {
    learned: 'learned',
    noLearned: 'noLearned',
    hard: 'hard',
    wordsPerPage: 'wordsPerPage'
}

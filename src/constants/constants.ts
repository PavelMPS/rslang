export const sprint: string = 'sprint';
export const audiochallenge: string = 'audiochallenge';

export const maxLives: number = 5;
export const averegeSprintGameScore: number = 100;
export const minScore: number = 0;
export const answersLength = 5;

export const maxQuestionCount = 20;

export const maxPageCount = 30;

export const difficultWeak = 'hard';
export const difficultHeavy = 'easy';

export const filters = {
    learned: `{"$and":[{"userWord.optional.isLerned": true}]}`,
    noLearned: `{"$and":[{"userWord.optional.isLerned": false}]}`,
    hard: `{"$and":[{"userWord.difficulty": "hard"}]}`,
}

export const optionFilter = {
    learned: 'learned',
    noLearned: 'noLearned',
    hard: 'hard',
}
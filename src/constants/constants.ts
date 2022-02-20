export const sprint: string = 'sprint';
export const audiochallenge: string = 'audiochallenge';
export const maxLives: number = 5;
export const averegeSprintGameScore: number = 100;
export const minScore: number = 0;
export const answersLength: number = 5;
export const maxQuestionCount: number = 20;
export const differenceCoefficient: number = 4
export const maxPageCount: number = 30;
export const difficultWeak: string = 'easy';
export const difficultHeavy: string = 'hard';

export const filters: {hard: string} = {
  hard: `filter={"$and":[{"userWord.difficulty": "hard"}]}&wordsPerPage=3600`,
}

export const optionFilter: FilterOption = {
  noLearned: 'noLearned',
  hard: 'hard',
}

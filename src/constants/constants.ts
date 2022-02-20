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

export const description: string = `
<p>Hey! Would you want to start learning English, but there is no money for a tutor?</p>
<p>Do you want to learn English easily on your own?</p>
<p>Our application will help you with this.</p>
<p>We have an electronic textbook with 3600 most common English words.</p>
<p>There are also 2 games to test knowledge on 6 levels of difficulty.</p>
<p>Learn English with the cats.</p>`;
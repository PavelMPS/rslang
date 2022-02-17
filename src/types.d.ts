interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
}

interface IWordQuestion {
  id: string,
  group: number,
  page:	number,
  word:	string,
  image:	string,
  audio:	string,
  audioMeaning:	string,
  audioExample:	string,
  textMeaning: string,
  textExample:	string,
  transcription:	string,
  wordTranslate:	string,
  textMeaningTranslate:	string,
  textExampleTranslate:	string,
  userAnswer?: boolean,
}

interface IAudiochallenge {
  page: number;
  group: number;
  answerSeries: number;
  maxLine: number;
  lives: number;
  questionNum: number;
  results: boolean[];
  gameWords: IWordQuestion[],
  rightAnswers: number,
  allAnswers: number,
}
interface IRegisterUser {
  name: string,
  email: string,
  password: string
}

interface ISignUser {
  email: string,
  password: string
}

interface IUserWord {
  id?: string,
  difficulty: string,
  optional: IOptional,
  wordId?: string,
}

interface IOptional {
  isLerned: boolean,
  rightAnswers: number,
  allAnswers: number,
  answersForIsLerned: number,
}

interface IStatistics {
  learnedWords: number,
  optional: IStatisticsOptional,
}

interface IStatisticsOptional {
  sprint: IGameStatistic;
  audiochallenge: IGameStatistic;
  year: number;
  month: number;
  day: number;
}

interface IGameStatistic {
  newWords: number;
  rightAnswers: number;
  allAnswers: number;  
  maxLine: number;
}

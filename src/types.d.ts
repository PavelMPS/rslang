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
  lives: number;
  questionNum: number;
  results: boolean[];
  gameWords: IWordQuestion[],
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
  difficulty: string,
  optional: IOptional,
}

interface IOptional {
  isLerned: boolean,
  rightAnswers: number,
  allAnswers: number,
  answersForIsLerned: number,
}

interface IStatisticGame {
  newWords: number;
  allAnswers: number;
  rightAnswers: number;
  maxSerieAnswers: number;
}

interface IStatistic {
  learnedWords: number;
  optional: Object<IStatisticGame>;
}
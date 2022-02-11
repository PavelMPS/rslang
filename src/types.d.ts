interface IWord {
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
}

interface IAudiochallenge {
  page: number;
  group: number;
  maxLine: number;
  lives: number;
  questionNum: number;
  results: boolean[];
}

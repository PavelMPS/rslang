import { getWords, getUserWords, getUserWord, updateUserWord, createUserWord, getStatistics, updateStatistics, getUserAggregatedWords } from '../api/api';
import { createAydio, getQuestionArr, playAudio, resetGame } from '../utilits/utilits';
import { audiochallenge, sprint, difficultHeavy, difficultWeak, optionFilter, path } from '../constants/constants';
import { startGameSprint } from '../sprint-game/sprint-game';
import { renderAudiochallengePage } from '../audiochallenge-page/audiochallenge-page';
import { audiochallengeSettings } from '../constants/audiochallenge';
import { sprintGame } from '../constants/sprint';
import '../textbook-page/textbook-page.css';

export let textbookSettings: { page: number, group: number } = {
  page: 0,
  group: 0,
};
if (localStorage.getItem('Textbook')) {
  const newSettings: string = localStorage.getItem('Textbook') || '';
  textbookSettings = JSON.parse(newSettings);
};
const maxPageNum: number = 29;

async function getUserWordsParam(card: HTMLElement, userWords: IUserWord[]): Promise<void> {
  userWords.find((elem: IUserWord): void => {
    if (elem.wordId === card.dataset.id) {
      const heavyBTN = card.querySelector('.heavy-btn') as HTMLElement;
      const learnedBTN = card.querySelector('.learned-btn') as HTMLElement;
      if (elem.difficulty === difficultHeavy) {
        heavyBTN.classList.add('active');
        card.classList.add('heavy-word');
      };
      if (elem.optional.isLerned) {
        learnedBTN.classList.add('active');
        card.classList.add('learned-word');
        heavyBTN.classList.add('passive');
      };
      const statistics = card.querySelector('.word-statistic') as HTMLElement;
      statistics.innerHTML = `${elem.optional.rightAnswers} / ${elem.optional.allAnswers}`;
      return;
    };
  });
};

async function makeLearned(id: string, btn: HTMLElement, heavyBTN: HTMLElement, card: HTMLElement): Promise<void> {
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  };
  const statistic: IStatistics | undefined = await getStatistics(userId);
  const wordResponse: Response = await getUserWord(userId, id);
  let learnedWords: number = 0;
  let learned: boolean = false;

  if (wordResponse.ok && statistic) {
    const wordInf: IUserWord = await wordResponse.json();
    let difficult: string;
    if (btn.classList.contains('active')) {
      learned = true;
      learnedWords = statistic.learnedWords + 1;
      difficult = difficultWeak;
      heavyBTN.classList.remove('active');
      heavyBTN.classList.add('passive');
      card.classList.remove('heavy-word');
    } else {
      learned = false;
      if (statistic.learnedWords > 0) { learnedWords = statistic.learnedWords - 1 }
      difficult = wordInf.difficulty;
      heavyBTN.classList.remove('passive');
    };
    await updateUserWord(userId, id, difficult, learned, wordInf.optional.rightAnswers, wordInf.optional.allAnswers, 0);
    await updateStatistics(userId, learnedWords, statistic.optional.sprint, statistic.optional.audiochallenge, statistic.optional.year, statistic.optional.month, statistic.optional.day);
  } else {
    let rightWordAnswers: number = 0;
    let allWordAnswers: number = 0;
    let answersForIsLerned: number = 0;
    if (statistic) {
      if (btn.classList.contains('active')) {
        learned = true;
        learnedWords = statistic.learnedWords + 1;
      } else {
        learned = false;
        if (statistic.learnedWords > 0) { learnedWords = statistic.learnedWords - 1 };
      };
      await createUserWord(userId, id, difficultWeak, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
      await updateStatistics(userId, learnedWords, statistic.optional.sprint, statistic.optional.audiochallenge, statistic.optional.year, statistic.optional.month, statistic.optional.day);
    };
  };
};

async function chooseDifficult(id: string, btn: HTMLElement): Promise<void> {
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  };
  const wordResponse: Response = await getUserWord(userId, id);
  if (wordResponse.ok) {
    const wordInf: IUserWord = await wordResponse.json();
    if (btn.classList.contains('active')) {
      await updateUserWord(userId, id, difficultHeavy, wordInf.optional.isLerned, wordInf.optional.rightAnswers, wordInf.optional.allAnswers, wordInf.optional.answersForIsLerned);
    } else {
      await updateUserWord(userId, id, difficultWeak, wordInf.optional.isLerned, wordInf.optional.rightAnswers, wordInf.optional.allAnswers, wordInf.optional.answersForIsLerned);
    };
  } else {
    let learned: boolean = false;
    let rightWordAnswers: number = 0;
    let allWordAnswers: number = 0;
    let answersForIsLerned: number = 0;
    await createUserWord(userId, id, difficultHeavy, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
  };
};

function createTextbookContent(words: IWord[]): string {
  let textForInput: string = '' as string;
  words.forEach((word: IWord): void => {
    textForInput += `<div class="word-card" data-id="${word.id}">
      <div class="word-wrapper">
        <div class="word-img" style="background-image: url('${path}/${word.image}');"></div>
        <div class="word-inf">
          <div class="word">${word.word} - ${word.transcription} - ${word.wordTranslate}</div>
          <div class="word-meaning">
            <div class="english"><b>${word.textMeaning}</b></div>
            <div class="translation">${word.textMeaningTranslate}</div>
          </div>
          <div class="word-example">
            <div class="english">${word.textExample}</div>
            <div class="translation">${word.textExampleTranslate}</div>
          </div>
        </div>
      </div>
      <div class="word-settings-container">
        <div class="word-statistic disable">0 / 0</div>
        <div class="audio-btn"></div>
        <div class="heavy-btn disable"></div>
        <div class="learned-btn disable"></div>
      </div>
    </div>` as string;
  });
  return textForInput;
};

function createDifficultContent(words: IAgregetedWord[]): string {
  let textForInput: string = '';
  words.forEach((word: IAgregetedWord): void => {
    textForInput += `<div class="word-card" data-id="${word._id}">
      <div class="word-wrapper">
        <div class="word-img" style="background-image: url('${path}/${word.image}');"></div>
        <div class="word-inf">
          <div class="word">${word.word} - ${word.transcription} - ${word.wordTranslate}</div>
          <div class="word-meaning">
            <div class="english"><b>${word.textMeaning}</b></div>
            <div class="translation">${word.textMeaningTranslate}</div>
          </div>
          <div class="word-example">
            <div class="english">${word.textExample}</div>
            <div class="translation">${word.textExampleTranslate}</div>
          </div>
        </div>
      </div>
      <div class="word-settings-container">
        <div class="word-statistic disable">0 / 0</div>
        <div class="audio-btn"></div>
        <div class="heavy-btn disable"></div>
        <div class="learned-btn disable"></div>
      </div>
    </div>` as string;
  });
  return textForInput;
};

async function renderTextbookContent(): Promise<void> {
  const page = document.querySelector('.page') as HTMLElement;
  page.innerHTML = '';
  const gameContainer = document.querySelector('.game-container') as HTMLElement;
  const pageNum = document.querySelector('.page-num') as HTMLElement;
  let words: IWord[] | IAgregetedWord[] = [];
  let userWords: IUserWord[];
  if (localStorage.getItem('Your token')) {
    userWords = await getUserWords();
  };
  if (textbookSettings.group !== 6) {
    words = await getWords(textbookSettings.group, textbookSettings.page);
    page.innerHTML = createTextbookContent(words);
  } else {
    words = await getUserAggregatedWords(optionFilter.hard);
    if (words.length > 0) {
      page.innerHTML = createDifficultContent(words as IAgregetedWord[]);
    } else {
      page.innerHTML = '<div class="??nnouncement">You haven not chosen any difficult words yet.</div>';
    };
  };

  const wordCards = document.querySelectorAll('.word-card') as NodeListOf<HTMLElement>;
  wordCards.forEach((card: HTMLElement): void => {
    const audioBTN = card.querySelector('.audio-btn') as HTMLElement;
    audioBTN.addEventListener(('click'), (): void => {
      if (textbookSettings.group !== 6) {
        playTextbookAudio(words as IWord[], card);
      } else {
        playDifficultAudio(words as IAgregetedWord[], card);
      };
    });
    const heavyBTN = card.querySelector('.heavy-btn') as HTMLElement;
    heavyBTN.addEventListener(('click'), (): void => {
      if (!heavyBTN.classList.contains('passive')) {
        heavyBTN.classList.toggle('active');
        card.classList.toggle('heavy-word');
        chooseDifficult(card.dataset.id as string, heavyBTN);
        if (textbookSettings.group === 6) {
          setTimeout(renderTextbookContent, 200);
        };
      };
    });

    const learnedBTN = card.querySelector('.learned-btn') as HTMLElement;
    learnedBTN.addEventListener('click', (): void => {
      learnedBTN.classList.toggle('active');
      card.classList.toggle('learned-word');
      makeLearned(card.dataset.id as string, learnedBTN, heavyBTN, card);
      let count: number = 0;
      wordCards.forEach((wordCard: HTMLElement): void => {
        if (wordCard.classList.contains('learned-word')) {
          count = count + 1;
        };
      });
      if (count === wordCards.length) {
        page.classList.add('learned');
        pageNum.classList.add('learned');
        gameContainer.classList.add('disable');
      } else {
        page.classList.remove('learned');
        pageNum.classList.remove('learned');
        gameContainer.classList.remove('disable');
      };
    });

    const wordStatistic = card.querySelector('.word-statistic') as HTMLElement;
    if (localStorage.getItem('Your token')) {
      getUserWordsParam(card, userWords);
      heavyBTN.classList.remove('disable');
      learnedBTN.classList.remove('disable');
      wordStatistic.classList.remove('disable');
    };
  });
  let count: number = 0;
  wordCards.forEach((wordCard: HTMLElement): void => {
    if (wordCard.classList.contains('learned-word')) {
      count = count + 1;
    };
  });
  if (count === 20) {
    page.classList.add('learned');
    gameContainer.classList.add('disable');
    pageNum.classList.add('learned');
  } else {
    page.classList.remove('learned');
    gameContainer.classList.remove('disable');
    pageNum.classList.remove('learned');
  };

  if (textbookSettings.group === 6) {
    const nav = document.querySelector('.page-nav') as HTMLElement;
    nav.style.opacity = '0';
    gameContainer.classList.add('disable');
  };
  localStorage.setItem('Textbook', JSON.stringify(textbookSettings));
};

function playTextbookAudio(words: IWord[], card: HTMLElement): void {
  const id: string = card.dataset.id as string;
  const word: IWord = words.find((word: IWord) => word.id === id) as IWord;
  const wordAudio: HTMLAudioElement = createAydio(word.audio);
  const wordMeaning: HTMLAudioElement = createAydio(word.audioMeaning);
  const wordExample: HTMLAudioElement = createAydio(word.audioExample);
  playAudio(wordAudio);
  wordAudio.onended = function (): void {
    playAudio(wordMeaning);
    wordMeaning.onended = function (): void {
      playAudio(wordExample);
    };
  };
};

function playDifficultAudio(words: IAgregetedWord[], card: HTMLElement): void {
  const id: string = card.dataset.id as string;
  const word: IAgregetedWord = words.find((word: IAgregetedWord) => word._id === id) as IAgregetedWord;
  const wordAudio: HTMLAudioElement = createAydio(word.audio);
  const wordMeaning: HTMLAudioElement = createAydio(word.audioMeaning);
  const wordExample: HTMLAudioElement = createAydio(word.audioExample);
  playAudio(wordAudio);
  wordAudio.onended = function (): void {
    playAudio(wordMeaning);
    wordMeaning.onended = function (): void {
      playAudio(wordExample);
    };
  };
};

export function createTextbookStructure(): void {
  const main: HTMLElement = document.querySelector('.main') as HTMLElement;
  main.innerHTML = '';
  const content: string = `<div class="textbook">
        <div class="sidebar">
          <div class="bookmarks">
            <div class="bookmark" data-group="0">I</div>
            <div class="bookmark" data-group="1">II</div>
            <div class="bookmark" data-group="2">III</div>
            <div class="bookmark" data-group="3">IV</div>
            <div class="bookmark" data-group="4">V</div>
            <div class="bookmark" data-group="5">VI</div>
            <div class="bookmark disable" data-group="6"></div>
          </div>

          <div class="page-nav">
            <div class="prev-page"></div>
            <div class="page-num">${textbookSettings.page + 1}</div>
            <div class="next-page"></div>
          </div>
        </div>        
        <div class="page">
        </div>   
        <div class="game-container">
          <div class="sprint-btn"></div>
          <div class="game-menu-text">Let's start training</div>
          <div class="audio-call-btn"></div>
        </div>
        <a class="top-btn" href="#">TOP
        </a>
      </div>`;

  main.innerHTML = content;
};

function toPrevPage(): void {
  textbookSettings.page = textbookSettings.page - 1;
  renderTextbookPage();
};

function toNextPage(): void {
  textbookSettings.page = textbookSettings.page + 1;
  renderTextbookPage();
};

function goToGroup(bookmark: HTMLElement): void {
  textbookSettings.group = Number(bookmark.dataset.group);
  textbookSettings.page = 0;
  renderTextbookPage();
};

export async function renderTextbookPage(): Promise<void> {
  createTextbookStructure();
  renderTextbookContent();
  const bookmarks: NodeListOf<HTMLElement> = document.querySelectorAll('.bookmark');
  if (localStorage.getItem('Your token')) {
    bookmarks[6].classList.remove('disable');
  };
  bookmarks.forEach((bookmarkEl: HTMLElement): void => {
    if (Number(bookmarkEl.dataset.group) === textbookSettings.group) {
      bookmarkEl.classList.add('active');
    };
    bookmarkEl.addEventListener('click', (): void => goToGroup(bookmarkEl));
  });
  const prevBTN = document.querySelector('.prev-page') as HTMLElement;
  const nextBTN = document.querySelector('.next-page') as HTMLElement;

  if (textbookSettings.page === 0) {
    prevBTN.classList.add('disable');
  };
  if (textbookSettings.page === maxPageNum) {
    nextBTN.classList.add('disable');
  };

  if (!prevBTN.classList.contains('disable')) {
    prevBTN.addEventListener('click', toPrevPage);
  };
  if (!nextBTN.classList.contains('disable')) {
    nextBTN.addEventListener('click', toNextPage);
  };

  const sprintBTN = document.querySelector('.sprint-btn') as HTMLElement;
  sprintBTN.addEventListener('click', async (): Promise<void> => {
    resetGame(sprint);
    await startGameSprint(textbookSettings.group, textbookSettings.page);
    sprintGame.fromTextbook = true;
  });
  const audiocallBTN: HTMLElement = document.querySelector('.audio-call-btn') as HTMLElement;
  audiocallBTN.addEventListener('click', async (): Promise<void> => {
    resetGame(audiochallenge);
    const arr: IWord[] = await getQuestionArr(textbookSettings.group, audiochallenge, textbookSettings.page)
    await renderAudiochallengePage(arr);
    audiochallengeSettings.fromTextbook = true;
  });
};

import { getWord, getWords, getUserWords, getUserWord, updateUserWord, createUserWord, getStatistics, updateStatistics } from '../api/api';
import { createAydio, getQuestionArr, playAudio, resetGame } from '../utilits/utilits';
import { audiochallenge, difficultHeavy, difficultWeak } from '../constants/constants';

import '../textbook-page/textbook-page.css';
import { startGameSprint } from '../sprint-game/sprint-game';
import { renderAudiochallengePage } from '../audiochallenge-page/audiochallenge-page';

const textbookSettings: { page: number, group: number } = {
  page: 0,
  group: 0,
}
const maxPageNum = 29;

async function getUserWordsParam( card: HTMLElement, userWords: IUserWord[]) {
  userWords.find((elem: IUserWord) => {
    if (elem.wordId === card.dataset.id) {
      const heavyBTN: HTMLElement = card.querySelector('.heavy-btn') as HTMLElement;
      const learnedBTN: HTMLElement = card.querySelector('.learned-btn') as HTMLElement;
      if (elem.difficulty === 'hard') {
        heavyBTN.classList.add('active');
        card.classList.add('heavy-word');
      }
      if (elem.optional.isLerned) {
        learnedBTN.classList.add('active');
        card.classList.toggle('learned-word');
      }
      const statistics: HTMLElement = card.querySelector('.word-statistic') as HTMLElement;
      statistics.innerHTML = `${elem.optional.rightAnswers} / ${elem.optional.allAnswers}`;
      return;
    }
  });
}

async function makeLearned(id: string, btn: HTMLElement) {
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }
  const statistic = await getStatistics(userId);

  const wordResponse: Response = await getUserWord(userId, id);
  let learnedWords = 0;
  let learned: boolean = false;

  if (wordResponse.ok && statistic) {
    const wordInf: IUserWord = await wordResponse.json();
    if (btn.classList.contains('active')) {
      learned = true;
      learnedWords = statistic.learnedWords + 1;
    } else {
      learned = false;
      learnedWords = statistic.learnedWords - 1;
    }
    await updateUserWord(userId, id, wordInf.difficulty, learned, wordInf.optional.rightAnswers, wordInf.optional.allAnswers, wordInf.optional.answersForIsLerned);
    await updateStatistics(userId, learnedWords, statistic.optional.sprint, statistic.optional.audiochallenge, statistic.optional.year, statistic.optional.month, statistic.optional.day);
  } else {
    let rightWordAnswers: number = 0;
    let allWordAnswers: number = 0;
    let answersForIsLerned: number = 0;
    if (statistic) {
      if (btn.classList.contains('active')) {
        learned = true;
        statistic.learnedWords = statistic.learnedWords + 1;
      } else {
        learned = false;
        if (statistic.learnedWords > 0) {learnedWords = statistic.learnedWords - 1;}
      }
      await createUserWord(userId, id, difficultWeak, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
    await updateStatistics(userId, learnedWords, statistic.optional.sprint, statistic.optional.audiochallenge, statistic.optional.year, statistic.optional.month, statistic.optional.day);
    }
    
    
  }
}

async function chooseDifficult(id: string, btn: HTMLElement) {
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }

  const wordResponse: Response = await getUserWord(userId, id);

  if (wordResponse.ok) {
    const wordInf: IUserWord = await wordResponse.json();
    if (btn.classList.contains('active')) {
      await updateUserWord(userId, id, difficultHeavy, wordInf.optional.isLerned, wordInf.optional.rightAnswers, wordInf.optional.allAnswers,  wordInf.optional.answersForIsLerned);
    } else {
      await updateUserWord(userId, id, difficultWeak, wordInf.optional.isLerned, wordInf.optional.rightAnswers, wordInf.optional.allAnswers,  wordInf.optional.answersForIsLerned);
    }    
  } else {
    let learned: boolean = false;
    let rightWordAnswers: number = 0;
    let allWordAnswers: number = 0;
    let answersForIsLerned: number = 0;
  
    await createUserWord(userId, id, difficultHeavy, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
  }
}

function createTextbookContent(words: IWord[]): string {
  let textForInput: string = '' as string;
  words.forEach((word: IWord): void => {
    textForInput += `<div class="word-card" data-id="${word.id}">
      <div class="word-wrapper">
        <div class="word-img" style="background-image: url('https://react-rslang-example.herokuapp.com/${word.image}');"></div>
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
        <div class="word-statistic disable"></div>
        <div class="audio-btn"></div>
        <div class="heavy-btn disable"></div>
        <div class="learned-btn disable"></div>
      </div>
    </div>`;
  })
  return textForInput;
}

async function getDifficultWords(): Promise<IWord[]> {
  const userWords = await getUserWords();
  const newWords: IWord[] = [];
  userWords.forEach(async (userWord: IUserWord) => {
    if (userWord.difficulty === difficultHeavy) {
      const word: IWord = await getWord(userWord.wordId as string);
      newWords.push(word);
    }
  });
  return newWords;
}

async function renderTextbookContent(): Promise<void> {
  const page: HTMLElement = document.querySelector('.page') as HTMLElement;
  page.innerHTML = '';

  let words: IWord[] = [];

  let userWords: IUserWord[];
  if (localStorage.getItem('Your token')) {
    userWords = await getUserWords();
  }

  if (textbookSettings.group !== 6) {
    words = await getWords(textbookSettings.group, textbookSettings.page);
    page.innerHTML = createTextbookContent(words);
  } else {
    const difficultWords: IWord[] = await getDifficultWords();
    console.log(createTextbookContent(difficultWords));
    // page.innerHTML = createTextbookContent(difficultWords);
  }



  const wordCards: NodeListOf<HTMLElement> = document.querySelectorAll('.word-card') as  NodeListOf<HTMLElement>;
  wordCards.forEach((card: HTMLElement, index: number) => {
    const audioBTN: HTMLElement = card.querySelector('.audio-btn') as HTMLElement;
    audioBTN.addEventListener(('click'), (): void => {
      playTextbookAudio(words, card);
    });

    const heavyBTN: HTMLElement = card.querySelector('.heavy-btn') as HTMLElement;
    heavyBTN.addEventListener(('click'), (): void => {
      heavyBTN.classList.toggle('active');
      card.classList.toggle('heavy-word');
      chooseDifficult(card.dataset.id as string, heavyBTN);
    });

    const learnedBTN: HTMLElement = card.querySelector('.learned-btn') as HTMLElement;
    learnedBTN.addEventListener(('click'), (): void => {
      learnedBTN.classList.toggle('active');
      card.classList.toggle('learned-word');
      makeLearned(card.dataset.id as string, learnedBTN);
    });

    const wordStatistic: HTMLElement = card.querySelector('.word-statistic') as HTMLElement;

    if (localStorage.getItem('Your token')) {
      getUserWordsParam(card, userWords);
      heavyBTN.classList.remove('disable');
      learnedBTN.classList.remove('disable');
      wordStatistic.classList.remove('disable');
    }
  })
}

function playTextbookAudio(words: IWord[], card: HTMLElement): void {
  const id = card.dataset.id;
  const word: IWord = words.find((word: IWord) => word.id === id) as IWord;
  const wordAudio = createAydio(word.audio);
  const wordMeaning = createAydio(word.audioMeaning);
  const wordExample = createAydio(word.audioExample);

  playAudio(wordAudio);

  wordAudio.onended = function () {
    playAudio(wordMeaning);
    wordMeaning.onended = function () {
      playAudio(wordExample);
    }
  }
}

export function createTextbookStructyre(): void {
  const main: HTMLElement = document.querySelector('.main') as HTMLElement;
  main.innerHTML = '';

  const content = `<div class="textbook">
      <div class="page-container">
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
        <div class="game-container">
          <div class="sprint-btn"></div>
          <div class="audio-call-btn"></div>
          <div class="game-menu-text">Let's start training</div>
        </div>        
        <div class="page">
        </div>
      </div>      
    </div>`;

    main.innerHTML = content;
}

function toPrevPage(): void {
  textbookSettings.page = textbookSettings.page - 1;
  renderTextbookPage();
}

function toNextPage(): void {
  textbookSettings.page = textbookSettings.page + 1;
  renderTextbookPage();
}

function goToGroup(bookmark: HTMLElement): void {
  textbookSettings.group = Number(bookmark.dataset.group);
  textbookSettings.page = 0;
  renderTextbookPage();
}

export function renderTextbookPage(): void {
  createTextbookStructyre();
  renderTextbookContent();
  
  const bookmarks: NodeListOf<HTMLElement> = document.querySelectorAll('.bookmark');

  if (localStorage.getItem('Your token')) {
    bookmarks[6].classList.remove('disable');
  }

  bookmarks.forEach((bookmarkEl: HTMLElement) => {
    if (Number(bookmarkEl.dataset.group) === textbookSettings.group) {
      bookmarkEl.classList.add('active');
    }
    bookmarkEl.addEventListener(('click'), (): void => goToGroup(bookmarkEl));
  })

  const prevBTN: HTMLElement = document.querySelector('.prev-page') as HTMLElement;
  if (!prevBTN.classList.contains('disable')) {
    prevBTN.addEventListener(('click'), toPrevPage);
  }

  const nextBTN: HTMLElement = document.querySelector('.next-page') as HTMLElement;
  if (!nextBTN.classList.contains('disable')) {
    nextBTN.addEventListener(('click'), toNextPage);
  }

  if (textbookSettings.page === 0) {
    prevBTN.classList.add('disable');
  }
  if (textbookSettings.page === maxPageNum) {
    nextBTN.classList.add('disable');
  }

  const sprintBTN: HTMLElement = document.querySelector('.sprint-btn') as HTMLElement;
  sprintBTN.addEventListener(('click'), async (): Promise<void> => {
    console.log(textbookSettings)
    await startGameSprint(textbookSettings.group, textbookSettings.page);
  });

  const audiocallBTN: HTMLElement = document.querySelector('.audio-call-btn') as HTMLElement;
  audiocallBTN.addEventListener(('click'), async (): Promise<void> => {
    resetGame(audiochallenge)
    const arr = await getQuestionArr(textbookSettings.group, textbookSettings.page)
    renderAudiochallengePage(arr);
  });
}

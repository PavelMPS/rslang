import { getWords, getUserWord, updateUserWord, createUserWord, getStatistics, updateStatistics, getUserAggregatedWords, getUserWords } from '../api/api';
import { textbookSettings } from '../textbook-page/textbook-page';
import { sprintDescription, sprintGame } from '../constants/sprint';
import { audiochallengeDescription, audiochallengeSettings } from '../constants/audiochallenge';
import { keyboardControl, startGameSprint } from '../sprint-game/sprint-game';
import { renderAudiochallengePage } from '../audiochallenge-page/audiochallenge-page';
import { maxLives, averegeSprintGameScore, minScore, sprint, audiochallenge, maxPageCount, maxQuestionCount, difficultHeavy, difficultWeak, optionFilter, differenceCoefficient  } from '../constants/constants';

import '../utilits/utilits.css';

export async function getQuestionArr(group: number, game: string, page?: number): Promise<IWord[]> {
  const wordArr: Array<IWord[]> = [];
  if (page !== undefined && localStorage.getItem('Your token')) {
    const arr: IWord[] = await getQuestionArrFromTextbook(group, page, game);
    wordArr.push(arr);
  }
  if (page !== undefined && !localStorage.getItem('Your token')) {
    const arr: IWord[] = await getWords(group, page);
    wordArr.push(arr);
  }
  if (page === undefined) {
    const pagesArr: number[] = [];
    for (let i = 0; i < differenceCoefficient; i ++) {
      pagesArr[i] = getRandomPage(pagesArr);
      const arr: IWord[] = await getWords(group, pagesArr[i]);
      wordArr.push(arr);
    }
  }
  const totalArr: IWord[] = wordArr.flat();
  shuffle(totalArr);
  return totalArr.slice(0, maxQuestionCount);
}

async function getQuestionArrFromTextbook(group: number, page: number, game: string): Promise<IWord[]> {
  let gameGroup: number;
  if (game === sprint) {
    gameGroup = group;
  } else {
    gameGroup = group;
  }
  let totalArr: IAgregetedWord[] = [];
    const arr: IAgregetedWord[] = await getUserAggregatedWords(optionFilter.noLearned, gameGroup);
    arr.forEach((el: IAgregetedWord): void => {
      if (el.page <= page) {
        totalArr.push(el);
      };
      if (totalArr.length === maxQuestionCount) {
        return;
      }
    });       
    totalArr = totalArr.reverse();
    const newTotalArr: IWord[] = JSON.parse(JSON.stringify(totalArr).replace(/_id/g, 'id')) ;
  return newTotalArr;
}

function getRandomPage(arr: number[]): number {
  let newNum = Math.floor(Math.random() * maxPageCount);
  if (arr.includes(newNum)) {
    return getRandomPage(arr);
  } else {
    return newNum;
  }
}

export async function chooseDifficult(game: string): Promise<void> {
  const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.difficult-btn');
  const buttonContainer = document.querySelector('.difficult-buttons-container') as HTMLElement;
  buttonContainer.addEventListener('click', async (e: Event): Promise<void> => {
    const target = e.target as HTMLElement;
    buttons.forEach((el): void => {
      el.classList.remove('active');
    })
    target.classList.add('active');
    if (game === sprint) {
      sprintGame.difficult = Number(target.dataset.group);
    } else {
      audiochallengeSettings.group = Number(target.dataset.group);
    }
  })
}

export async function renderGroupSelectionPage(game: string): Promise<void> {
  const content: string = ` <div class="group-select-page">
      <div class="game-title-container">
        <div class="game-page-title"></div>
      </div>
      <div class="audiochallenge-main-inf">
        <div class="game-img"></div>
        <div class="game-describe-container"></div>
      </div>

      <div class="game-difficult-container">
          <div class="difficult-subtitle">Choose the difficult of the game:</div>
          <div class="difficult-buttons-container">
              <button class="btn difficult-btn" id="difficult-btn-1" data-group="0">I</button>
              <button class="btn difficult-btn" id="difficult-btn-2" data-group="1">II</button>
              <button class="btn difficult-btn" id="difficult-btn-3" data-group="2">III</button>
              <button class="btn difficult-btn" id="difficult-btn-4" data-group="3">IV</button>
              <button class="btn difficult-btn" id="difficult-btn-5" data-group="4">V</button>
              <button class="btn difficult-btn" id="difficult-btn-6" data-group="5">VI</button>
          </div>
      </div>
      <div class="btn start-btn">Let's start!</div>
    </div>`;

  const footer = document.querySelector('.footer') as HTMLElement;
  const main = document.querySelector('.main') as HTMLElement;
  footer.classList.add('disabled');
  main.innerHTML = content;

  const title = main.querySelector('.game-page-title') as HTMLElement;
  const description = main.querySelector('.game-describe-container') as HTMLElement;

  const startBTN: HTMLElement = main.querySelector('.start-btn') as HTMLElement;
  const gameImg: HTMLElement = main.querySelector('.game-img') as HTMLElement;

  if (game === audiochallenge) {
    title.innerHTML = audiochallenge.toUpperCase();
    description.innerHTML = audiochallengeDescription;

    startBTN.addEventListener('click', async () => {
      const newWordArr: IWord[] = await getQuestionArr(audiochallengeSettings.group, game);
      audiochallengeSettings.questionNum = minScore;
      renderAudiochallengePage(newWordArr);
      audiochallengeSettings.fromTextbook = false;
    });
    gameImg.classList.add('audiochallenge');
  } else if (game === sprint) {
    title.innerHTML = sprint.toUpperCase();;
    description.innerHTML = sprintDescription;
    startBTN.addEventListener('click', () => {
      startGameSprint();
      sprintGame.fromTextbook = false;
    } );
    gameImg.classList.add('sprint');
  }
  await chooseDifficult(game);
}

export function shuffle(array: IWordQuestion[] | IGameWord[] | number[]): void {
  array.sort(() => Math.random() - 0.5);
}

export function playAudio(audio: HTMLAudioElement) {
  audio.play();
}

export function createAydio(link: string): HTMLAudioElement {
  const audio: HTMLAudioElement = new Audio();
  audio.preload = 'auto';
  audio.src = `https://react-rslang-example.herokuapp.com/${link}`;
  return audio;
}

export async function getResults(words: IWordQuestion[] | IGameWord[], game: string): Promise<void> {
  const main = document.querySelector('.main') as HTMLElement;
  let rightAnswers: string = '';
  let wrongAnswers: string = '';

  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
    await changeUserWords(words, game);
  }
  if (game === sprint) {
    words.length = sprintGame.allAnswers;
    document.removeEventListener('keydown', keyboardControl);
  }
  words.forEach((word: IWordQuestion | IGameWord, index: number): void => {
    if (word.userAnswer === true) {
      rightAnswers += `<div>
        <div class="result-audio-btn" data-index="${index}"></div>
        <div>${word.word} - ${word.wordTranslate}</div>
      </div>`;
    } else if (word.userAnswer === false) {
        wrongAnswers += `<div>
        <div class="result-audio-btn" data-index="${index}"></div>
        <div>${word.word} - ${word.wordTranslate}</div>
      </div>`;
    }
  });
  
  const content: string = `
    <div class="results-container">
      <div class="tabs-container">
        <div class="main-tab">MAIN</div>
        <div class="words-tab disable">RESULTS</div>
      </div>
      <div class="main-container">
        <div class="results-inf"></div>
        <div class="results-img"></div>
        <div class="try-again-btn">Try again?</div>
      </div>
      <div class="words-container disable">
        <div class="answers-container">
          <div class="answer-title-right"></div>
          <ol class="right-answers-result">${rightAnswers}</ol>
        </div>
        <div class="answers-container">
          <div class="answer-title-wrong"></div>
          <ol class="wrong-answers-result">${wrongAnswers}</ol>
        </div>
      </div>
    </div>
  `; 
  main.innerHTML = content;
  tryAgain(game);
  listenTabs();
  createResultsAydio(words);
  createResults(game);
}

function createResultsAydio(words: IWordQuestion[] | IGameWord[]): void {
  const audioBTNS= document.querySelectorAll('.result-audio-btn') as NodeListOf<HTMLElement>;

  audioBTNS.forEach((audioBTN: HTMLElement): void => {
    audioBTN.addEventListener('click', (): void => {
      const index = audioBTN.dataset.index as string;
      const audio: HTMLAudioElement = createAydio(words[index].audio);
      playAudio(audio);
    })
  })
}

function tryAgain(game: string): void {
  const tryAgainBtn = document.querySelector('.try-again-btn') as HTMLButtonElement;
  if (game === sprint) {
    if (sprintGame.fromTextbook) {
      tryAgainBtn.addEventListener('click', async (): Promise<void> => {
        await startGameSprint(textbookSettings.group, textbookSettings.page);
      });
    } else {
      tryAgainBtn.addEventListener('click', (): void => {
        renderGroupSelectionPage(game);
      });
    }
  } else {
    if (sprintGame.fromTextbook) {
      tryAgainBtn.addEventListener('click', async (): Promise<void> => {
        const arr = await getQuestionArr(textbookSettings.group, game, textbookSettings.page)
        renderAudiochallengePage(arr);
      });
    } else {
      tryAgainBtn.addEventListener('click', (): void => {
        renderGroupSelectionPage(game);
      });
    }
  }
}

export async function resetGame(game: string): Promise<void> {
  if (game === audiochallenge) {
    audiochallengeSettings.answerSeries = minScore;
    audiochallengeSettings.maxLine = minScore;
    audiochallengeSettings.lives = maxLives;
    audiochallengeSettings.questionNum = minScore;
    audiochallengeSettings.results = [];
  } else if (game === sprint) {
    sprintGame.count = 0;
    sprintGame.score = 0;
    sprintGame.group = 0;
    sprintGame.page = 0;
    sprintGame.answerSeries = 0;
    sprintGame.seriesTotalStatistics = 0;
    sprintGame.rightAnswers = 0;
    sprintGame.allAnswers = 0;
  }
}

function listenTabs(): void {
  const mainTab = document.querySelector('.main-tab') as HTMLElement;
  const wordsTab = document.querySelector('.words-tab') as HTMLElement;
  const mainContainer = document.querySelector('.main-container') as HTMLElement;
  const wordsContainer = document.querySelector('.words-container') as HTMLElement;

  mainTab.addEventListener('click', (): void => {
    mainTab.classList.remove('disable');
    wordsTab.classList.add('disable');
    mainContainer.classList.remove('disable');
    wordsContainer.classList.add('disable');
  });
  wordsTab.addEventListener('click', (): void => {
    mainTab.classList.add('disable');
    wordsTab.classList.remove('disable');
    mainContainer.classList.add('disable');
    wordsContainer.classList.remove('disable');
  });
}

function createResults(game: string): void {
  const goodResultsSprint = 'Great job! Your score is: ' + sprintGame.score + ' points';
  const badResultsSprint = 'It will be better next time... Your score is: ' + + sprintGame.score + ' points';
  const goodResultsAudio = 'Great job! You have ' + audiochallengeSettings.lives + ' lives left';
  const badResultsAudio = 'It will be better next time... Unfortunately there are no lives left...';

  const resultImg = document.querySelector('.results-img') as HTMLElement;
  const resultTitle = document.querySelector('.results-inf') as HTMLElement;

  if (game === audiochallenge && audiochallengeSettings.lives > minScore) {
    resultTitle.innerHTML = goodResultsAudio;
    resultImg.classList.add('good-result-img');
  } else if (game === audiochallenge && audiochallengeSettings.lives === minScore) {
    resultTitle.innerHTML = badResultsAudio;
    resultImg.classList.add('bad-result-img');
  } else if (game === sprint && sprintGame.score >= averegeSprintGameScore) {
    resultTitle.innerHTML = goodResultsSprint;
    resultImg.classList.add('good-result-img');
  } else if (game === sprint && sprintGame.score < averegeSprintGameScore) {
    resultTitle.innerHTML = badResultsSprint;
    resultImg.classList.add('bad-result-img');
  }
  // setTimeout(() => {
  //   resetGame(game);
  // }, 2000);
}

export async function changeUserWords(words: IWordQuestion[] | IGameWord[], game: string): Promise<void> {
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }
  const wordsInf: INewWord = await checkWords(words, userId);
  setTimeout(() => {
    updateStatisticsByResults(userId, game, wordsInf);
  }, 500); 
}

async function checkWords(words: IWordQuestion[] | IGameWord[], userId: string | null): Promise<INewWord> {
  const wordsInf: INewWord = {newWords: 0, learnedWords: 0};
  words.forEach(async (word: IWordQuestion | IGameWord): Promise<void> => {
    if (word.userAnswer === true || word.userAnswer === false) {
      const wordResponse: Response = await getUserWord(userId, word.id);
      let learned: boolean = false;
      let rightWordAnswers: number = 0;
      let allWordAnswers: number = 0;
      let answersForIsLerned: number = 0;
      let maxCount: number = 3;

      if (wordResponse.ok) {
        const wordInf: IUserWord = await wordResponse.json();

        let difficult: string;

        if (word.userAnswer === true) {
          rightWordAnswers = wordInf.optional.rightAnswers + 1;
          allWordAnswers = wordInf.optional.allAnswers + 1;
          answersForIsLerned = wordInf.optional.answersForIsLerned + 1;
        } else if (word.userAnswer === false) {
          allWordAnswers = wordInf.optional.allAnswers + 1;
          answersForIsLerned = 0;
        }
        if (wordInf.difficulty === difficultHeavy) {
          maxCount = 5;
        }
        if (answersForIsLerned >= maxCount) {
          learned = true;
          difficult = difficultWeak;
          wordsInf.learnedWords = wordsInf.learnedWords + 1;
        } else {
          learned = false;
          difficult = wordInf.difficulty;
        }
        await updateUserWord(userId, word.id, difficult, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
      } else {
        wordsInf.newWords = wordsInf.newWords + 1;
        if (word.userAnswer === true) {
          rightWordAnswers = 1;
          answersForIsLerned = 1;
        }
        allWordAnswers = 1;
        await createUserWord(userId, word.id, difficultWeak, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
      }
    }
  });
  return wordsInf;
}

async function updateStatisticsByResults(userId: string | null, game: string, wordsInf: {newWords: number, learnedWords: number}): Promise<void> {
  const statisticInf = await getStatistics(userId) as IStatistics;
  const newLearnedWords: number = wordsInf.learnedWords + statisticInf.learnedWords;
  if (game === sprint) {
    let maxLine: number = sprintGame.seriesTotalStatistics;
    if (sprintGame.seriesTotalStatistics < statisticInf.optional.sprint.maxLine) {
      maxLine = statisticInf.optional.sprint.maxLine;
    }
    const sprintStatistic: IGameStatistic = {
      newWords: statisticInf.optional.sprint.newWords + wordsInf.newWords,
      rightAnswers: statisticInf.optional.sprint.rightAnswers + sprintGame.rightAnswers,
      allAnswers: statisticInf.optional.sprint.allAnswers + sprintGame.allAnswers, 
      maxLine: maxLine,
    } 
    await updateStatistics(userId, newLearnedWords, sprintStatistic, statisticInf.optional.audiochallenge, statisticInf.optional.year, statisticInf.optional.month, statisticInf.optional.day);
  } else if (game === audiochallenge) {
    let maxLine: number = audiochallengeSettings.maxLine;
    if (audiochallengeSettings.maxLine < statisticInf.optional.audiochallenge.maxLine) {
      maxLine = statisticInf.optional.audiochallenge.maxLine;
    }
    console.log('result', maxLine, audiochallengeSettings);
    const audiochallengeStatistic: IGameStatistic = {
      newWords: statisticInf.optional.audiochallenge.newWords + wordsInf.newWords,
      rightAnswers: statisticInf.optional.audiochallenge.rightAnswers + audiochallengeSettings.rightAnswers,
      allAnswers: statisticInf.optional.audiochallenge.allAnswers + audiochallengeSettings.allAnswers, 
      maxLine: maxLine,
    }
    await updateStatistics(userId, newLearnedWords, statisticInf.optional.sprint, audiochallengeStatistic, statisticInf.optional.year, statisticInf.optional.month, statisticInf.optional.day);
  }
  resetGame(game);
}

export async function createStatistic(id: string, year: number, month: number, day: number): Promise<void> {
  const sprintStatistic: IGameStatistic = {
    newWords: 0,
    rightAnswers: 0,
    allAnswers: 0, 
    maxLine: 0,
  }
  const audiochallengeStatistic: IGameStatistic = {
    newWords: 0,
    rightAnswers: 0,
    allAnswers: 0, 
    maxLine: 0,
  }
  await updateStatistics(id, 0, sprintStatistic, audiochallengeStatistic, year, month, day); 
}
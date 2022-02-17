import { getWords, getUserWord, updateUserWord, createUserWord, getStatistics, updateStatistics, getUserAggregatedWords, getUserWords } from '../api/api';
import { sprintGame, GameWord } from '../constants/sprint';
import { audiochallengeSettings } from '../constants/audiochallenge';
import { startGameSprint } from '../sprint-game/sprint-game';
import { renderAudiochallengePage, shuffleWords } from '../audiochallenge-page/audiochallenge-page';
import { maxLives, averegeSprintGameScore, minScore, sprint, audiochallenge, maxPageCount, maxQuestionCount, difficultHeavy, difficultWeak, optionFilter, filters } from '../constants/constants';

import '../utilits/utilits.css';

export async function getQuestionArr(group: number, page?: number): Promise<IWord[]> {  
  if (page !== undefined && localStorage.getItem('Your token')) {
    const arr = await getQuestionArrFromTextbook(group, page);
    return arr;
  }
  if (page !== undefined && !localStorage.getItem('Your token')) {
    const arr: IWord[] = await getWords(group, page);
    console.log('textbook without login',arr);
    return arr;
  }
  const pagesArr: number[] = [];
  const wordArr: Array<IWord[]> = [];
  for (let i = 0; i < 4; i ++) {
    pagesArr[i] = getRandomPage(pagesArr);
    const arr: IWord[] = await getWords(group, pagesArr[i]);
    wordArr.push(arr);
  }

  const totalArr: IWord[] = wordArr.flat();

  shuffle(totalArr);
  console.log(totalArr)
  return totalArr.slice(0, maxQuestionCount);
}

async function getQuestionArrFromTextbook(group: number, page: number): Promise<IWord[]> {
  const totalArr: IWord[] = [];
  const allUserWords: IUserWord[] = await getUserWords();
  while (page >= 0) {
    const arr: IWord[] = await getWords(group, page);
    
    arr.forEach((el, i) => {
      const wordId: string = el.id;

      allUserWords.forEach((elem, index) =>{
        if (wordId !== elem.wordId ) {
          totalArr.push(el);
          if (totalArr.length === maxQuestionCount) {
            return totalArr;
          }
          console.log('true')
        } else if(elem.optional.isLerned === false){
          console.log('true')
          totalArr.push(el);
          if (totalArr.length === maxQuestionCount) {
            return totalArr;
          }
        }
      })
    })
    page--;
  }
  console.log('Конец', totalArr)
  return totalArr.slice(0, maxQuestionCount);
}

function getRandomPage(arr: number[]) {
  let newNum = Math.floor(Math.random() * (maxPageCount));
  if (arr.includes(newNum)) {
    return getRandomPage(arr);
  } else {
    return newNum;
  }
}

export async function chooseDifficult(game: string): Promise<void> {
  const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.difficult-btn');
  const buttonContainer: HTMLElement = document.querySelector('.difficult-buttons-container') as HTMLElement;
  buttonContainer?.addEventListener('click', async (e: Event) => {
    const target = e.target as HTMLElement;
    buttons.forEach((el): void => {
      el.classList.remove('active')
    })
    target.classList.add('active');

    if (game === 'sprint') {
      sprintGame.difficult = Number(target.dataset.group);
    } else {
      audiochallengeSettings.group = Number(target.dataset.group);
    }
  })
}

export async function renderGroupSelectionPage(game: string): Promise<void> {
  await resetGame(game);
  const content: string = ` <div class="group-select-page">
      <div class="game-title-container">
        <h3 class="game-page-title"></h3>
      </div>
      <div class="audiochallenge-main-inf">
        <div class="game-img"></div>
        <div class="game-describe-container"></div>
      </div>

      <div class="game-difficult-container">
          <h4 class="difficult-subtitle">Choose the difficult of the game:</h4>
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

  const title: HTMLElement = main.querySelector('.game-page-title') as HTMLElement;
  const description: HTMLElement = main.querySelector('.game-describe-container') as HTMLElement;

  const sprintTitle = 'SPRINT';
  const audiochallengeTitle = 'AUDIOCHALLENGE';
  const sprintDescription = `In this game you must choose rihgt answer.
        Click at that button you think right or press key left or right
        for choosing answer`;
  const audiochallengeDescription = `<h3 class="game-describe">"Audiochallenge" is a workout that improves listening comprehension.</h3>
        <ul>
          <li>Use the mouse to select.</li>
          <li>Use number keys from 1 to 5 to select an answer.</li>
          <li>Use a space to repeat a word.</li>
          <li>Use the Enter key for a hint or to move to the next word.</li>
        </ul>`;

  const startBTN: HTMLElement = main.querySelector('.start-btn') as HTMLElement;
  const gameImg: HTMLElement = main.querySelector('.game-img') as HTMLElement;

  if (game === 'audiochallenge') {
    title.innerHTML = audiochallengeTitle;
    description.innerHTML = audiochallengeDescription;

    startBTN.addEventListener('click', async () => {
      const newWordArr: IWord[] = await shuffleWords() as IWord[];
      audiochallengeSettings.questionNum = minScore;
      renderAudiochallengePage(newWordArr);
    });
    gameImg.classList.add('audiochallenge');
  } else if (game === 'sprint') {
    title.innerHTML = sprintTitle;
    description.innerHTML = sprintDescription;
    startBTN.addEventListener('click', () => {
      startGameSprint();
    } );
    gameImg.classList.add('sprint');
  }

  await chooseDifficult(game);
}

export function shuffle(array: IWordQuestion[] | GameWord[] | number[]): void {
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

export async function getResults(words: IWordQuestion[] | GameWord[], game: string): Promise<void> {
  const main = document.querySelector('.main') as HTMLElement;
  let rightAnswers: string = '';
  let wrongAnswers: string = '';

  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
    await changeUserWords(words, game);
  }
  if (game === sprint) { words.length = sprintGame.allAnswers}
  words.forEach((word: IWordQuestion | GameWord, index: number): void => {
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
  })
  
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

function createResultsAydio(words: IWordQuestion[] | GameWord[]): void {
  const audioBTNS: NodeListOf<HTMLElement> = document.querySelectorAll('.result-audio-btn') as NodeListOf<HTMLElement>;

  audioBTNS.forEach((audioBTN: HTMLElement) => {
    audioBTN.addEventListener('click', () => {
      const index: string = audioBTN.dataset.index as string;
      const audio: HTMLAudioElement = createAydio(words[index].audio);
      playAudio(audio);
    })
  })
}

function tryAgain(game: string): void {
  const tryAgainBtn = document.querySelector('.try-again-btn') as HTMLButtonElement;
  tryAgainBtn.addEventListener('click', () => {
    renderGroupSelectionPage(game);
  });
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
  }
}

function listenTabs() {
  const mainTab: HTMLElement = document.querySelector('.main-tab') as HTMLElement;
  const wordsTab: HTMLElement = document.querySelector('.words-tab') as HTMLElement;
  const mainContainer: HTMLElement = document.querySelector('.main-container') as HTMLElement;
  const wordsContainer: HTMLElement = document.querySelector('.words-container') as HTMLElement;

  mainTab.addEventListener('click', () => {
    mainTab.classList.remove('disable');
    wordsTab.classList.add('disable');
    mainContainer.classList.remove('disable');
    wordsContainer.classList.add('disable');
  })
  wordsTab.addEventListener('click', () => {
    mainTab.classList.add('disable');
    wordsTab.classList.remove('disable');
    mainContainer.classList.add('disable');
    wordsContainer.classList.remove('disable');
  })
}

function createResults(game: string) {
  const goodResultsSprint = 'Great job! Your score is: ' + sprintGame.score + ' points';
  const badResultsSprint = 'It will be better next time... Your score is: ' + + sprintGame.score + ' points';
  const goodResultsAudio = 'You have ' + audiochallengeSettings.lives + ' lives left';
  const badResultsAudio = 'It will be better next time... Unfortunately there are no lives left...';

  const resultImg: HTMLElement = document.querySelector('.results-img') as HTMLElement;
  const resultTitle: HTMLElement = document.querySelector('.results-inf') as HTMLElement;

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
}

export async function changeUserWords(words: IWordQuestion[] | GameWord[], game: string) {
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }
  console.log('user id is: ', userId)
  const wordsInf = await checkWords(words, userId);
 
  await updateStatisticsByResults(userId, game, wordsInf);
}

async function checkWords(words: IWordQuestion[] | GameWord[], userId: string | null) {
  const wordsInf: {newWords: number, learnedWords: number} = {newWords: 0, learnedWords: 0};

  words.forEach(async (word: IWordQuestion | GameWord) => {
    if (word.userAnswer === true || word.userAnswer === false) {
      const wordResponse: Response = await getUserWord(userId, word.id);
      let learned: boolean = false;
      let rightWordAnswers: number = 0;
      let allWordAnswers: number = 0;
      let answersForIsLerned: number = 0;
      let maxCount: number = 3;
      if (wordResponse.ok) {
        const wordInf: IUserWord = await wordResponse.json();
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
          wordsInf.learnedWords = wordsInf.learnedWords + 1;
        } else {
          learned = false;
        }
        await updateUserWord(userId, word.id, wordInf.difficulty, learned, rightWordAnswers, allWordAnswers, answersForIsLerned);
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
  })
  return wordsInf;
}

async function updateStatisticsByResults(userId: string | null, game: string, wordsInf: {newWords: number, learnedWords: number}) {
  const statisticInf = await getStatistics(userId) as IStatistics;
  const newLearnedWords = wordsInf.learnedWords + statisticInf.learnedWords;
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

    const audiochallengeStatistic: IGameStatistic = {
      newWords: statisticInf.optional.audiochallenge.newWords + wordsInf.newWords,
      rightAnswers: statisticInf.optional.audiochallenge.rightAnswers + audiochallengeSettings.rightAnswers,
      allAnswers: statisticInf.optional.audiochallenge.allAnswers + audiochallengeSettings.allAnswers, 
      maxLine: maxLine,
    }
    await updateStatistics(userId, newLearnedWords, statisticInf.optional.sprint, audiochallengeStatistic, statisticInf.optional.year, statisticInf.optional.month, statisticInf.optional.day);
  }
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
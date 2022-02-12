import { sprintGame, GameWord } from '../constants/sprint';
import { audiochallengeSettings } from '../constants/audiochallenge';
import { startGameSprint } from '../sprint-game/sprint-game';
import { renderAudiochallengePage, shuffleWords } from '../audiochallenge-page/audiochallenge-page';
import { maxLives, averegeSprintGameScore, minScore, answersLength, sprint, audiochallenge } from '../constants/constants';

import '../utilits/utilits.css';

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
    startBTN.addEventListener('click', startGameSprint);
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

export function getResults(words: IWordQuestion[] | GameWord[], game: string): void {
  const main = document.querySelector('.main') as HTMLElement;
  let rightAnswers: string = '';
  let wrongAnswers: string = '';

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
    if (game === audiochallenge) {
      audiochallengeSettings.answerSeries = minScore;
      audiochallengeSettings.lives = maxLives;
      audiochallengeSettings.questionNum = minScore;
      audiochallengeSettings.results = [];
    } else if (game === sprint) {
      sprintGame.count = 0;
      sprintGame.score = 0;
      sprintGame.group = sprintGame.difficult;
      sprintGame.page = 0;
    }
    renderGroupSelectionPage(game);
  });
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
  const goodResults = 'Great job! Your score is: ';
  const badResults = 'It will be better next time... Your score is: ';

  const resultImg: HTMLElement = document.querySelector('.results-img') as HTMLElement;
  const resultTitle: HTMLElement = document.querySelector('.results-inf') as HTMLElement;

  if (game === audiochallenge && audiochallengeSettings.lives > minScore) {
    resultTitle.innerHTML = goodResults + audiochallengeSettings.lives + ' lives left';
    resultImg.classList.add('good-result-img');
  } else if (game === audiochallenge && audiochallengeSettings.lives === minScore) {
    resultTitle.innerHTML = badResults + audiochallengeSettings.lives + ' lives left';
    resultImg.classList.add('bad-result-img');
  } else if (game === sprint && sprintGame.score >= averegeSprintGameScore) {
    resultTitle.innerHTML = goodResults + sprintGame.score + ' points';
    resultImg.classList.add('good-result-img');
  } else if (game === sprint && sprintGame.score < averegeSprintGameScore) {
    resultTitle.innerHTML = badResults + sprintGame.score + ' points';
    resultImg.classList.add('bad-result-img');
  }
}
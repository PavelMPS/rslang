import { startGameSprint } from '../sprint-game/sprint-game';
import { sprintGame } from '../constants/sprint';
import { audiochallengeSettings, maxQuestionCount } from '../constants/audiochallenge';
import { getWords } from '../textbook-page/textbook-page';
import { maxLives, averegeSprintGameScore, minScore, answersLength, sprint, audiochallenge } from '../constants/constants';

import '../audiochallenge-page/audiochallenge-page.css';

function renderAudiochallengeQuestion(words: IWord[], answers: number[]) {
  let content = ``;
  answers.forEach((answer: number) => {
    content += `<div class="answers-btn" data-translate="${words[answer].wordTranslate}">${words[answer].wordTranslate}</div>`
  });

  return content;
}

export async function renderAudiochallengePage(newWordArr: IWord[]): Promise<void> {
  const content: string = `    <div class="audiochallenge-container">
      <div class="hearts-container">
        <div class="heart broken"></div>
        <div class="heart broken"></div>
        <div class="heart broken"></div>
        <div class="heart broken"></div>
        <div class="heart broken"></div>
      </div>
      <div class="listen-btn"></div>
      <div class="btns-container">
        <div class="answers-btn-container">

        </div>
        <div class="next-question-btn disable">NEXT</div>
      </div>
    </div>`;

  const main = document.querySelector('.main') as HTMLElement;
  main.innerHTML = content;

  createQuestion(newWordArr, audiochallengeSettings.questionNum);

  chooseAnswer(newWordArr[audiochallengeSettings.questionNum].wordTranslate);

  brokeHeart();

  const nextBTN: HTMLElement = document.querySelector('.next-question-btn') as HTMLElement;
  nextBTN.addEventListener('click', () => {
    audiochallengeSettings.questionNum = audiochallengeSettings.questionNum + 1;
    renderAudiochallengePage(newWordArr);
  })
}

async function chooseDifficult(game: string): Promise<void> {
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

function brokeHeart() {
  const hearts: NodeListOf<Element> = document.querySelectorAll('.heart') as NodeListOf<Element>;
  for (let i = 0; i < audiochallengeSettings.lives; i++) {
    hearts[i].classList.remove('broken');
  }
}

async function chooseAnswer(result: string): Promise<void> {
  const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.answers-btn');
  const buttonContainer: HTMLElement = document.querySelector('.answers-btn-container') as HTMLElement;
  const nextBTN: HTMLElement = document.querySelector('.next-question-btn') as HTMLElement;

  buttons.forEach((btn: HTMLElement) => {
    btn.addEventListener('click', () => {
      buttons.forEach((el) => {
        el.classList.add('disable');
      })
      if (btn.dataset.translate === result) {
        btn.classList.add('right');
        ++audiochallengeSettings.maxLine;
        audiochallengeSettings.results.push(true);
      } else {
        btn.classList.add('wrong');
        audiochallengeSettings.maxLine = minScore;
        --audiochallengeSettings.lives;
        audiochallengeSettings.results.push(false);
      }
  
      nextBTN.classList.remove('disable');
    })
  })

  // buttonContainer.addEventListener('click', async (e: Event) => {
  //   const target = e.target as HTMLElement;
  //   buttons.forEach((el) => {
  //     el.classList.remove('active');
  //     el.classList.add('disable');
  //   })

  //   if (target.dataset.translate === result) {
  //     target.classList.add('right');
  //     ++audiochallengeSettings.maxLine;
  //     audiochallengeSettings.results.push(true);
  //   } else {
  //     target.classList.add('wrong');
  //     audiochallengeSettings.maxLine = 0;
  //     --audiochallengeSettings.lives;
  //     audiochallengeSettings.results.push(false);
  //   }

  //   nextBTN.classList.remove('disable');
  // })
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

function getRandomNumAnsw(answersArr: number[]): number {
  let newNum = Math.floor(Math.random() * (maxQuestionCount - 1 + 1));

  if (answersArr.includes(newNum)) {
    return getRandomNumAnsw(answersArr);
  } else {
    return newNum;
  }
}

function shuffleArr(answersArr: number[]|IWord[]): number[]|IWord[] {
  let answers = answersArr;
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = answers[i];
    answers[i] = answers[j];
    answers[j] = temp;
  }
  return answers;
}

async function shuffleWords(): Promise<IWord[]> {
  const wordsArr: IWord[] = await getWords(audiochallengeSettings.group, audiochallengeSettings.page);
  const newWordsArr: IWord[] = shuffleArr(wordsArr) as IWord[];
  return newWordsArr;
}

function getAnswers(questionNum: number) {
  const answersArr: number[] = [];

  answersArr[0] = questionNum;
  for (let i = 1; i < answersLength; i++) {
    answersArr[i] = getRandomNumAnsw(answersArr);
  }
  return shuffleArr(answersArr);
}

function playAudio(audio: HTMLAudioElement) {
  audio.play();
}

function createAydio(link: string): HTMLAudioElement {
  const audio: HTMLAudioElement = new Audio();
  audio.preload = 'auto';
  audio.src = `https://react-rslang-example.herokuapp.com/${link}`;

  return audio;
} 

async function createQuestion(newWordArr: IWord[], index: number): Promise<void> {
  const answersContainer = document.querySelector('.answers-btn-container') as HTMLElement;
  const listenBTN: HTMLElement = document.querySelector('.listen-btn') as HTMLElement;

  if (index < maxQuestionCount && audiochallengeSettings.lives !== minScore) {
    const answers = getAnswers(index);
    answersContainer.innerHTML = renderAudiochallengeQuestion(newWordArr, answers as number[]);
    const wordAudio: HTMLAudioElement = createAydio(newWordArr[index].audio);

    playAudio(wordAudio);
    listenBTN.addEventListener('click', () => playAudio(wordAudio));
  } else {
    getResults(newWordArr, audiochallenge);
    console.log('вызов результатов');
  }
}

function getResults(words: IWord[], game: string): void {
  const main = document.querySelector('.main') as HTMLElement;
  let rightAnswers: string = '';
  let wrongAnswers: string = '';

  const goodResults = 'Great job! Your score is: ';
  const badResults = 'It will be better next time... Your score is: ';

  for (let i = 0; i < audiochallengeSettings.results.length; i++) {
    if (audiochallengeSettings.results[i]) {
      rightAnswers += `<div>
        <div class="result-audio-btn" data-index="${i}"></div>
        <div>${words[i].word} - ${words[i].wordTranslate}</div>
      </div>`;
    } else if (!audiochallengeSettings.results[i]) {
        wrongAnswers += `<div  data-index="${i}">
        <div class="result-audio-btn" data-index="${i}"></div>
        <div>${words[i].word} - ${words[i].wordTranslate}</div>
      </div>`;
    }
  }

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
          <div class="answer-subtitle-right"></div>
          <ol class="right-answers-result">${rightAnswers}</ol>
        </div>
        <div class="answers-container">
          <div class="answer-subtitle-wrong"></div>
          <ol class="wrong-answers-result">${wrongAnswers}</ol>
        </div>
      </div>
    </div>
  `; 
  main.innerHTML = content;

  const tryAgainBtn = document.querySelector('.try-again-btn') as HTMLButtonElement;
  tryAgainBtn.addEventListener('click', () => {
      audiochallengeSettings.maxLine = minScore;
      audiochallengeSettings.lives = maxLives;
      audiochallengeSettings.questionNum = minScore;
      audiochallengeSettings.results = [];
      renderGroupSelectionPage('audiochallenge');
  });

  const mainTab: HTMLElement = main.querySelector('.main-tab') as HTMLElement;
  const wordsTab: HTMLElement = main.querySelector('.words-tab') as HTMLElement;
  const mainContainer: HTMLElement = main.querySelector('.main-container') as HTMLElement;
  const wordsContainer: HTMLElement = main.querySelector('.words-container') as HTMLElement;

  mainTab.addEventListener('click', () => {
    console.log(1);
    mainTab.classList.remove('disable');
    wordsTab.classList.add('disable');
    mainContainer.classList.remove('disable');
    wordsContainer.classList.add('disable');
  })
  wordsTab.addEventListener('click', () => {
    console.log(2);
    mainTab.classList.add('disable');
    wordsTab.classList.remove('disable');
    mainContainer.classList.add('disable');
    wordsContainer.classList.remove('disable');
  })

  const audioBTNS: NodeListOf<HTMLElement> = document.querySelectorAll('.result-audio-btn') as NodeListOf<HTMLElement>;

  audioBTNS.forEach((audioBTN: HTMLElement) => {
    audioBTN.addEventListener('click', () => {
      const index: string = audioBTN.dataset.index as string;
      const audio: HTMLAudioElement = createAydio(words[index].audio);
      playAudio(audio);
    })
  })

  const resultImg: HTMLElement = main.querySelector('.results-img') as HTMLElement;
  const resultTitle: HTMLElement = main.querySelector('.results-inf') as HTMLElement;

  if (game === audiochallenge && audiochallengeSettings.lives > minScore) {
    resultTitle.innerHTML = goodResults + audiochallengeSettings.lives + ' lives left';
    resultImg.classList.add('good-result-img');
    console.log(game, audiochallengeSettings.lives);
  } else if (game === audiochallenge && audiochallengeSettings.lives === minScore) {
    resultTitle.innerHTML = badResults + audiochallengeSettings.lives + ' lives left';
    resultImg.classList.add('bad-result-img');
    console.log(game, audiochallengeSettings.lives);
  } else if (game === sprint && sprintGame.score >= averegeSprintGameScore) {
    resultTitle.innerHTML = goodResults + sprintGame.score + ' points';
    resultImg.classList.add('good-result-img');
  } else if (game === sprint && sprintGame.score < averegeSprintGameScore) {
    resultTitle.innerHTML = badResults + sprintGame.score + ' points';
    resultImg.classList.add('bad-result-img');
  }
}

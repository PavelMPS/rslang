import { startGameSprint } from '../sprint-game/sprint-game';
import { sprintGame } from '../constants/sprint';
import { audiochallengeSettings, maxQuestionCount } from '../constants/audiochallenge';
import { getWords } from '../textbook-page/textbook-page';

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
        <div class="next-question-btn">NEXT</div>
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
    buttons.forEach((el, i) => {
      el.classList.remove('active')
    })
    target.classList.add('active');

    if (game === 'sprint') {
      sprintGame.difficult = Number(target.dataset.group);
    } else {
      audiochallengeSettings.group = Number(target.dataset.group);
      console.log(audiochallengeSettings.group);
    }
  })
}

function brokeHeart() {
  const hearts: NodeListOf<Element> = document.querySelectorAll('.heart') as NodeListOf<Element>;
  for (let i = 0; i <= audiochallengeSettings.brokenLives; i++) {
    hearts[i].classList.remove('broken');
  }
}

async function chooseAnswer(result: string): Promise<void> {
  const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.answers-btn');
  const buttonContainer: HTMLElement = document.querySelector('.answers-btn-container') as HTMLElement;
  buttonContainer.addEventListener('click', async (e: Event) => {
    const target = e.target as HTMLElement;
    buttons.forEach((el) => {
      el.classList.remove('active');
      el.classList.add('disable');
    })

    if (target.dataset.translate === result) {
      target.classList.add('right');
      ++audiochallengeSettings.maxLine;
    } else {
      target.classList.add('wrong');
      audiochallengeSettings.maxLine = 0;
      --audiochallengeSettings.brokenLives;
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
      const newWordArr: IWord[] = await shuffleWords();
      audiochallengeSettings.questionNum = 0;
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

function shuffleAnswers(answersArr: number[]): number[] {
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
  console.log(audiochallengeSettings.group, audiochallengeSettings.page);
  const wordsArr: IWord[] = await getWords(audiochallengeSettings.group, audiochallengeSettings.page);
  let words = wordsArr;
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = words[i];
    words[i] = words[j];
    words[j] = temp;
  }
  return words;
}

function getAnswers(newWordArr: IWord[], questionNum: number) {
  const answersLength = 5;
  const answersArr: number[] = [];

  answersArr[0] = questionNum;
  for (let i = 1; i < answersLength; i++) {
    answersArr[i] = getRandomNumAnsw(answersArr);
  }
  return shuffleAnswers(answersArr);
}

function playAudio(audio: HTMLAudioElement) {
  audio.play();
}

async function createQuestion(newWordArr: IWord[], index: number): Promise<void> {
  const wordAudio: HTMLAudioElement = new Audio();
  wordAudio.preload = 'auto';


  const answersContainer = document.querySelector('.answers-btn-container') as HTMLElement;
  const listenBTN: HTMLElement = document.querySelector('.listen-btn') as HTMLElement;

  if (index < maxQuestionCount) {
    const answers = getAnswers(newWordArr, index);
    answersContainer.innerHTML = renderAudiochallengeQuestion(newWordArr, answers);
    wordAudio.src = `https://react-rslang-example.herokuapp.com/${newWordArr[index].audio}`;
    playAudio(wordAudio);
    listenBTN.addEventListener('click', () => playAudio(wordAudio));
  } else {
    console.log('вызов результатов');
  }
}

function checkQuestion() {

}

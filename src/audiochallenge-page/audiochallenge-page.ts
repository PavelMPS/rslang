import { audiochallengeSettings } from '../constants/audiochallenge';
import { shuffle, createAydio, playAudio, getResults, getQuestionArr } from '../utilits/utilits';
import { getWords } from '../api/api';
import { minScore, answersLength, maxQuestionCount, audiochallenge } from '../constants/constants';

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
        <div class="not-to-know-btn">I don't know</div>
        <div class="next-question-btn disable">NEXT</div>
      </div>
    </div>`;

  const main = document.querySelector('.main') as HTMLElement;
  main.innerHTML = content;

  createQuestion(newWordArr, audiochallengeSettings.questionNum);

  chooseAnswer(newWordArr[audiochallengeSettings.questionNum].wordTranslate, audiochallengeSettings.questionNum);

  brokeHeart();

  const nextBTN: HTMLElement = document.querySelector('.next-question-btn') as HTMLElement;
  nextBTN.addEventListener('click', () => {
    audiochallengeSettings.questionNum = audiochallengeSettings.questionNum + 1;
    renderAudiochallengePage(newWordArr);
  })
}

function brokeHeart() {
  const hearts: NodeListOf<Element> = document.querySelectorAll('.heart') as NodeListOf<Element>;
  for (let i = 0; i < audiochallengeSettings.lives; i++) {
    hearts[i].classList.remove('broken');
  }
}

async function chooseAnswer(result: string, index: number): Promise<void> {
  const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.answers-btn');
  const nextBTN: HTMLElement = document.querySelector('.not-to-know-btn') as HTMLElement;
  const notToKnowBTN: HTMLElement = document.querySelector('.next-question-btn') as HTMLElement;

  buttons.forEach((btn: HTMLElement) => {
    btn.addEventListener('click', () => {
      buttons.forEach((el: HTMLElement) => {
        el.classList.add('disable');
      })
      if (btn.dataset.translate === result) {
        btn.classList.add('right');
        ++audiochallengeSettings.answerSeries;
        audiochallengeSettings.gameWords[index].userAnswer = true;
      } else if (btn.dataset.translate !== result) {
        btn.classList.add('wrong');
        audiochallengeSettings.answerSeries = minScore;
        --audiochallengeSettings.lives;
        audiochallengeSettings.gameWords[index].userAnswer = false;
      }
      
      nextBTN.classList.add('disable');
      notToKnowBTN.classList.remove('disable');
    })
  })
  nextBTN.addEventListener('click', () => {
    buttons.forEach((btn: HTMLElement) => {
      btn.classList.add('disable');
      if (btn.dataset.translate === result) {
        btn.classList.add('right');
      }
    })
    audiochallengeSettings.answerSeries = minScore;
    --audiochallengeSettings.lives;
    audiochallengeSettings.gameWords[index].userAnswer = false;
    nextBTN.classList.add('disable');
    notToKnowBTN.classList.remove('disable');
  })
}

function getRandomNum(arr: number[]): number {
  let newNum = Math.floor(Math.random() * (maxQuestionCount - 1 + 1));
  if (arr.includes(newNum)) {
    return getRandomNum(arr);
  } else {
    return newNum;
  }
}

export async function shuffleWords(): Promise<IWord[]> {
  audiochallengeSettings.gameWords = await getQuestionArr(audiochallengeSettings.group);
  shuffle(audiochallengeSettings.gameWords);
  return audiochallengeSettings.gameWords;
}

function getAnswers(questionNum: number): number[] {
  const answersArr: number[] = [];

  answersArr[0] = questionNum;
  for (let i = 1; i < answersLength; i++) {
    answersArr[i] = getRandomNum(answersArr);
  }
  shuffle(answersArr);
  return answersArr;
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
  }
}



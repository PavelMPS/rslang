import { audiochallengeSettings } from '../constants/audiochallenge';
import { shuffle, createAydio, playAudio, getResults } from '../utilits/utilits';
import { minScore, answersLength, audiochallenge } from '../constants/constants';
import '../audiochallenge-page/audiochallenge-page.css';

function renderAudiochallengeQuestion(words: IWord[], answers: number[]) {
  let content = ``;
  answers.forEach((answer: number) => {
    content += `<div class="answers-btn" data-translate="${words[answer].wordTranslate}">${words[answer].wordTranslate}</div>`
  });
  return content;
};

export async function renderAudiochallengePage(newWordArr: IWord[]): Promise<void> {
  const main: HTMLElement = document.querySelector('.main') as HTMLElement;
  const noWords: string = '<div class="аnnouncement">Not enough words to play on this page. Continue learning new words.</div>';
  if (newWordArr.length <= 1) {
    main.innerHTML = noWords;
  } else {
    audiochallengeSettings.gameWords = newWordArr;
    const content: string = `<div class="audiochallenge-container">
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
  
  
    main.innerHTML = content;
    audiochallengeSettings.allAnswers = newWordArr.length;
    createQuestion(newWordArr, audiochallengeSettings.questionNum);
    brokeHeart();
  }
};

function brokeHeart(): void {
  const hearts: NodeListOf<Element> = document.querySelectorAll('.heart') as NodeListOf<Element>;
  for (let i = 0; i < audiochallengeSettings.lives; i++) {
    hearts[i].classList.remove('broken');
  };
};

const listener: Array<(event: KeyboardEvent) => void> = [];

async function chooseAnswer(result: string, index: number, newWordArr: IWord[]): Promise<void> {
  const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.answers-btn');
  const notToKnowBTN: HTMLElement = document.querySelector('.not-to-know-btn') as HTMLElement;
  const nextBTN: HTMLElement = document.querySelector('.next-question-btn') as HTMLElement;

  document.removeEventListener('keydown', listener[0]);
  document.removeEventListener('keydown', listener[1]);
  listener[0] = (event: KeyboardEvent) => {
    if (event.code == 'Digit1') {
      checkAnswer(buttons, buttons[0], result, index, notToKnowBTN, nextBTN);
    } else if (event.code == 'Digit2') {
      checkAnswer(buttons, buttons[1], result, index, notToKnowBTN, nextBTN);
    } else if (event.code == 'Digit3') {
      checkAnswer(buttons, buttons[2], result, index, notToKnowBTN, nextBTN);
    } else if (event.code == 'Digit4') {
      checkAnswer(buttons, buttons[3], result, index, notToKnowBTN, nextBTN);
    } else if (event.code == 'Digit5') {
      checkAnswer(buttons, buttons[4], result, index, notToKnowBTN, nextBTN);
    };
  };
  listener[1] = (event: KeyboardEvent) => {
    if (event.code == 'Enter' && !notToKnowBTN.classList.contains('disable')) {
      chooseNotToKnowBTN(buttons, index, result, notToKnowBTN, nextBTN);
    } else if (event.code == 'Enter' && !nextBTN.classList.contains('disable')) {
      showNextQuestion(newWordArr);
    };
  };
  document.addEventListener('keydown', listener[0]);
  document.addEventListener('keydown', listener[1]);

  buttons.forEach((btn: HTMLElement) => {
    btn.addEventListener('click', (): void => {
      checkAnswer(buttons, btn, result, index, notToKnowBTN, nextBTN);
    });
  });
  notToKnowBTN.addEventListener('click', (): void => {
    chooseNotToKnowBTN(buttons, index, result, notToKnowBTN, nextBTN);
  });
  nextBTN.addEventListener('click', (): void => {
    showNextQuestion(newWordArr);
  });
};

function chooseNotToKnowBTN(buttons: NodeListOf<HTMLElement>, index: number, result: string, notToKnowBTN: HTMLElement, nextBTN: HTMLElement) {
  buttons.forEach((btn: HTMLElement) => {
    btn.classList.add('disable');
    if (btn.dataset.translate === result) {
      btn.classList.remove('disable');
    };
  });
  if (audiochallengeSettings.answerSeries > audiochallengeSettings.maxLine) {
    audiochallengeSettings.maxLine = audiochallengeSettings.answerSeries;
  };
  audiochallengeSettings.answerSeries = minScore;
  audiochallengeSettings.lives = audiochallengeSettings.lives - 1;
  audiochallengeSettings.gameWords[index].userAnswer = false;
  nextBTN.classList.remove('disable');
  notToKnowBTN.classList.add('disable');
};

function showNextQuestion(newWordArr: IWord[]) {
  audiochallengeSettings.questionNum = audiochallengeSettings.questionNum + 1;
  renderAudiochallengePage(newWordArr);
};

function checkAnswer(buttons: NodeListOf<HTMLElement>, btn: HTMLElement, result: string, index: number, notToKnowBTN: HTMLElement, nextBTN: HTMLElement) {
  buttons.forEach((el: HTMLElement) => {
    el.classList.add('disable');
  });
  if (btn.dataset.translate === result) {
    btn.classList.add('right');
    audiochallengeSettings.answerSeries = audiochallengeSettings.answerSeries + 1;
    audiochallengeSettings.rightAnswers = audiochallengeSettings.rightAnswers + 1;
    audiochallengeSettings.gameWords[index].userAnswer = true;
  } else if (btn.dataset.translate !== result) {
    btn.classList.add('wrong');
    if (audiochallengeSettings.answerSeries > audiochallengeSettings.maxLine) {
      audiochallengeSettings.maxLine = audiochallengeSettings.answerSeries;
    };
    audiochallengeSettings.answerSeries = minScore;
    audiochallengeSettings.lives = audiochallengeSettings.lives - 1;
    audiochallengeSettings.gameWords[index].userAnswer = false;
  };
  nextBTN.classList.remove('disable');
  notToKnowBTN.classList.add('disable');
  document.removeEventListener('keydown', listener[0]);
};

function getRandomNum(arr: number[]): number {
  let newNum = Math.floor(Math.random() * (audiochallengeSettings.allAnswers - 1 + 1));
  if (arr.includes(newNum)) {
    return getRandomNum(arr);
  } else {
    return newNum;
  };
};

function getAnswers(questionNum: number, words: IWord[]): number[] {
  const answersArr: number[] = [];
  answersArr[0] = questionNum;
  if (words.length >= answersLength) {
    for (let i = 1; i < answersLength; i++) {
      answersArr[i] = getRandomNum(answersArr);
    };
  } else {
    for (let i = 1; i < words.length; i++) {
      answersArr[i] = getRandomNum(answersArr);
    };
  };
  shuffle(answersArr);
  return answersArr;
};

async function createQuestion(newWordArr: IWord[], index: number): Promise<void> {
  const answersContainer = document.querySelector('.answers-btn-container') as HTMLElement;
  const listenBTN: HTMLElement = document.querySelector('.listen-btn') as HTMLElement;

  if (index < audiochallengeSettings.allAnswers && audiochallengeSettings.lives > minScore) {
    const answers = getAnswers(index, newWordArr);
    answersContainer.innerHTML = renderAudiochallengeQuestion(newWordArr, answers as number[]);
    const wordAudio: HTMLAudioElement = createAydio(newWordArr[index].audio);
    playAudio(wordAudio);
    listenBTN.addEventListener('click', () => playAudio(wordAudio));

    document.removeEventListener('keydown', listener[2]);
    const addListenetToListenBTN: (event: KeyboardEvent) => void = (event) => {
      if (event.code == 'Space') {
        playAudio(wordAudio);
        listenBTN.classList.add('active');
        setTimeout(() => listenBTN.classList.remove('active'), 500);
      };
    };
    listener[2] = addListenetToListenBTN;
    document.addEventListener('keydown', addListenetToListenBTN);
    chooseAnswer(newWordArr[audiochallengeSettings.questionNum].wordTranslate, audiochallengeSettings.questionNum, newWordArr);
  } else {
    const main = document.querySelector('.main') as HTMLElement;
    main.innerHTML = '';
    if (audiochallengeSettings.answerSeries > audiochallengeSettings.maxLine) {
      audiochallengeSettings.maxLine = audiochallengeSettings.answerSeries;
    };
    getResults(newWordArr, audiochallenge);
  };
};

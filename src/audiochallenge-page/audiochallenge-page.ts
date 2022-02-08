import '../audiochallenge-page/audiochallenge-page.css';
import { sprintGame } from '../constants/sprint';
import { startGameSprint } from '../sprint-game/sprint-game';

export async function renderAudiochallengePage() {
  console.log('audiochallenge');
  //TODO function
  const content: string = `    <div class="audiochallenge-container">
      <div class="hearts-container">
        <div class="heart"></div>
        <div class="heart"></div>
        <div class="heart"></div>
        <div class="heart"></div>
        <div class="heart broken"></div>
      </div>
      <div class="listen-btn"></div>
      <div class="btns-container">
        <div class="answers-btn-container">
          <div class="answers-btn" id="one">one</div>
          <div class="answers-btn" id="two">two</div>
          <div class="answers-btn" id="three">three</div>
          <div class="answers-btn" id="four">four</div>
          <div class="answers-btn" id="five">five</div>
        </div>
        <div class="next-question-btn">NEXT</div>
      </div>
    </div>`;

  const main = document.querySelector('.main') as HTMLElement;
  main.innerHTML = content;
}

//в качестве переменной game в функцию передается название игры 'audiochallenge'/'sprint' от которой зависит текст, котик, листенер
//реализовано получение номера группы при выборе сложности

export async function renderGroupSelectionPage(game: string): Promise<void> {
    const content: string = ` <div class="group-select-page">
      <div class="game-title-container">
        <h3 class="game-page-title"></h3>
      </div>
      <div class="audiochallenge-main-inf">
        <div class="audiochallenge-img"></div>
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
    const difficultBTNs: NodeListOf<HTMLElement> = main.querySelectorAll('.difficult-btn') as NodeListOf<HTMLElement>;

    let group: string|undefined = '0';

    difficultBTNs.forEach((difficultBTN: HTMLElement): void => {
      difficultBTN.addEventListener('click', () => {
        difficultBTNs.forEach((btn: HTMLElement) => {
          btn.classList.remove('active');
        })
        difficultBTN.classList.add('active');
        group = difficultBTN.dataset.group;
        if (group) sprintGame.difficult = +group;
      })
    })

    if (game === 'audiochallenge') {
      title.innerHTML = audiochallengeTitle;
      description.innerHTML = audiochallengeDescription;
      startBTN.addEventListener('click', renderAudiochallengePage);
    } else if (game === 'sprint') {
      title.innerHTML = sprintTitle;
      description.innerHTML = sprintDescription;
      startBTN.addEventListener('click', startGameSprint);
    }
}

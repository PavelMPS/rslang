import '../audiochallenge-page/audiochallenge-page.css';

export async function renderAudiochallengePage() {
  console.log('audiochallenge');
  //TODO function
}

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
              <button class="btn difficult-btn" id="difficult-btn-1">I</button>
              <button class="btn difficult-btn" id="difficult-btn-2">II</button>
              <button class="btn difficult-btn" id="difficult-btn-3">III</button>
              <button class="btn difficult-btn" id="difficult-btn-4">IV</button>
              <button class="btn difficult-btn" id="difficult-btn-5">V</button>
              <button class="btn difficult-btn" id="difficult-btn-6">VI</button>
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

    if (game === 'audiochallenge') {
      title.innerHTML = audiochallengeTitle;
      description.innerHTML = audiochallengeDescription;
    } else if (game === 'sprint') {
      title.innerHTML = sprintTitle;
      description.innerHTML = sprintDescription;
    }

    await renderAudiochallengePage();
}

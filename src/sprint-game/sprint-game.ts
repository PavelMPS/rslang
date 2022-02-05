import '../sprint-game/sprint-game.css';

export async function renderSprintPage(): Promise<void> {
    const content: string = `
    <div class="game-sprint-title-container">
        <h3 class="game-sprint-page-title">SPRINT</h3>
    </div>
    <div class="game-sprint-describe-container">
        <h3 class="game-sprint-describe">In this game you must choose rihgt answer.
        Click at that button you think right or press key left or right
        for choosing answer</h3>
    </div>
    <div class="game-sprint-difficult-container">
        <h4 class="sprint-difficult-subtitle">Choose the difficult of the game:</h4>
        <div class="difficult-buttons-container">
            <button class="btn difficult-btn" id="sprint-difficult-btn-1">1</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-2">2</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-3">3</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-4">4</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-5">5</button>
            <button class="btn difficult-btn" id="sprint-difficult-btn-6">6</button>
        </div>
    </div>
    <button class="btn sprint-start-btn">Let's start!</button>
    `;
    const footer = document.querySelector('.footer') as HTMLElement;
    const main = document.querySelector('.main') as HTMLElement;
    footer.classList.add('disabled');
    main.innerHTML = content;
    await startGameSprint();
}

async function startGameSprint(): Promise<void> {
    const btnStart = document.querySelector('.sprint-start-btn') as HTMLButtonElement;
    btnStart.addEventListener('click', () => {
        const content: string = `
        <div style="font-size: 40px; padding-top: 200px">LOADING ... PLEASE WAIT</div>
        `;
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = content;
    })   
}

import '../sprint-game/sprint-game.css';

export async function renderSprintPage(): Promise<void> {
    const content: string = `
    <div class="game-sprint-title-container">
        <h2 class="game-sprint-title">SPRINT</h2>
    </div>
    <div class="game-sprint-describe-container">
        <h3 class="game-sprint-describe"> In this game you must choose rihgt answer</h3>
    </div>
    <div class="game-sprint-difficult-container">
        <h4 class="sprint-difficult-subtitle">Choose the difficult of the game</h4>
        <div class="difficult-buttons-container">
            <button class="btn" id="sprint-difficult-btn-1">1</button>
            <button class="btn" id="sprint-difficult-btn-2">2</button>
            <button class="btn" id="sprint-difficult-btn-3">3</button>
            <button class="btn" id="sprint-difficult-btn-4">4</button>
            <button class="btn" id="sprint-difficult-btn-5">5</button>
            <button class="btn" id="sprint-difficult-btn-6">6</button>
        </div>
    </div>
    <button class="btn sprint-start-btn">Let's start!</button>
    `;
    const main = document.querySelector('.main') as HTMLElement;
}
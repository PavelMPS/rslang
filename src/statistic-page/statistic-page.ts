import { renderStartPage } from '../start-page/start-page';
import '../statistic-page/statistic-page.css';

export async function renderStatisticPage(): Promise<void> {
    const content: string = `
        <div class="games-statistic-title-container">
            <h2 class="games-statistic-title">Mini-games statistic:</h2>
        </div>

        <div class="games-statistic-container">
            <div class="game-sprint-statistic-container">
                <div class="game-sprint">
                    <div class="game-sprint-title">
                        <h3>SPRINT</h3>
                    </div>
                    <div class="sprint-newwords-stat">New words count: 0 words</div>
                    <div class="sprint-right-answer-stat">Right answers count: 0%</div>
                    <div class="sprint-longest-serie-stat">The longest serie: 0 words</div>
                </div>
            </div>
            <div class="game-audiochallenge-statistic-container">
                <div class="game-audiochallenge">
                     <div>
                        <h3 class="game-audiochallenge-title">AUDIOCHALLENGE</h3>
                    </div>
                    <div class="audiochallenge-newwords-stat">New words count: 0 words</div>
                    <div class="audiochallenge-right-answer-stat">Right answers: 0%</div>
                    <div class="audiochallenge-longest-serie-stat">The longest serie: 0 words</div>
                </div>
            </div>

        </div>

        <div class="words-statistic-title-container">
            <h2 class="words-statistic-title">Words statistic:</h2>
        </div>

        <div class="words-statistic-container">
            <div class="new-words-count">New words count: 0 words</div>
            <div class="learn-words-count">Learned words count: 0 words</div>
            <div class="right-answers-count">Right answers: 0%</div>
        </div>
        <button class="btn home-btn">Home</div>
    `;

    const main = document.querySelector('.main') as HTMLElement;  
    main.innerHTML = content;
    await backToHome();
}

async function backToHome(): Promise<void> {
    const homeBtn = document.querySelector('.home-btn') as HTMLElement;
    homeBtn.addEventListener('click', renderStartPage);
}
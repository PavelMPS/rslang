import { renderStartPage } from '../start-page/start-page';
import '../statistic-page/statistic-page.css';

export async function renderStatisticPage(): Promise<void> {
    const content: string = `
    <div class="games-statistic-title-container">
        <h2 class="games-statistic-title">Mini-games statistic:</h2>
    </div>

<div class="games-statistic-container">
    <div class="statistics-container">
        <div class="game-sprint">
            <div class="game-sprint-title">
                <h3>Sprint</h3>
            </div>
            <div class="stats-block__wrap">
                <div class="stats__description-block">
                    <div class="stats__description">New words count</div>
                    <div class="stats__description">Right answers</div>
                    <div class="stats__description">The longest serie</div>
                </div>
                <div class="stats__info-block">
                    <div class="stats__info">0 words</div>
                    <div class="stats__info">0%</div>
                    <div class="stats__info">0 words</div>
                </div>
            </div>
        </div>
    </div>

    <div class="statistics-container">
        <div class="game-audiochallenge">
            <div>
                <h3 class="game-audiochallenge-title">Audio Challenge</h3>
            </div>
            <div class="stats-block__wrap">
                <div class="stats__description-block">
                    <div class="stats__description">New words count</div>
                    <div class="stats__description">Right answers</div>
                    <div class="stats__description">The longest serie</div>
                </div>
                <div class="stats__info-block">
                    <div class="stats__info">0 words</div>
                    <div class="stats__info">0%</div>
                    <div class="stats__info">0 words</div>
                </div>
            </div>
        </div>
    </div>

</div>

<div class="words-statistic-title-container">
    <h2 class="words-statistic-title">Words statistic:</h2>
</div>
<div class="statistics-container">
<div class="stats-block__wrap">
    <div class="stats__description-block">
        <div class="stats__description">New words count</div>
        <div class="stats__description">Right answers</div>
        <div class="stats__description">Learned words count</div>
    </div>
    <div class="stats__info-block">
        <div class="stats__info">0 words</div>
        <div class="stats__info">0%</div>
        <div class="stats__info">0 words</div>
    </div>
</div>
</div>

<button class="btn home-btn">Home</button>
    `;

    const main = document.querySelector('.main') as HTMLElement;
    main.innerHTML = content;
    await backToHome();
}

async function backToHome(): Promise<void> {
    const homeBtn = document.querySelector('.home-btn') as HTMLElement;
    homeBtn.addEventListener('click', renderStartPage);
}
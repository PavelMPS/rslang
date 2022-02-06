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
                <img class="stats-sticker__img" src="./assets/analysis.png"> 
                <div class="stats__description-block">
                    <div class="stats__description">New words</div> 
                    <div class="stats__description">Right answers</div> 
                    <div class="stats__description">The longest serie</div> 
                </div>
                <div class="stats__info-block">
                    <div class="stats__info" class="sprint-new__words-count">0 words</div>
                    <div class="stats__info" class="sprint-right__words-count">0%</div>
                    <div class="stats__info" class="sprint-longest__words-serie">0 words</div>
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
                <img class="stats-sticker__img" src="./assets/pie.png"> 
                <div class="stats__description-block">
                    <div class="stats__description">New words</div> 
                    <div class="stats__description">Right answers</div> 
                    <div class="stats__description">The longest serie</div> 
                </div>
                <div class="stats__info-block">
                    <div class="stats__info" class="audiochallenge-new__words-count">0 words</div>
                    <div class="stats__info" class="audiochallenge-right__words-count">0%</div>
                    <div class="stats__info" class="audiochallenge-longest__words-serie">0 words</div>
                </div>
                </div>
            </div>
        </div>

    </div>

    <div class="words-statistic-title-container">
        <h2 class="words-statistic-title">Words statistic:</h2>
    </div>
    <div class="stats-block__wrap">
    <div class="statistics-container">
    <div class="stats-block__wrap">
    <img class="stats-sticker__img" src="./assets/search.png"> 
        <div class="stats__description-block">
            <div class="stats__description">New words count</div> 
            <div class="stats__description">Right answers</div> 
            <div class="stats__description">Learned words count</div> 
        </div>
        <div class="stats__info-block">
            <div class="stats__info" class="everyday-new__words-count">0 words</div>
            <div class="stats__info" class="everyday-learn__words-count">0 words</div>
            <div class="stats__info" class="everyday-right__words-count">0%</div>
       </div>
       </div>
    </div>
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
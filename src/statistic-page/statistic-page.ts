import { getStatistics } from '../api/api';
import '../statistic-page/statistic-page.css';
import { createStatistic } from '../utilits/utilits';

export async function renderStatisticPage(): Promise<void> {
    const main = document.querySelector('.main') as HTMLElement;
    let userId: string = '';
    if (localStorage.getItem('Your userId')) {
        userId = localStorage.getItem('Your userId') as string;
    }   
        const statisticInfo: IStatistics = await getStatistics(userId);
        let sprintRightAnswersPercent: number = 0;
        let audiochallengeRightAnswersPercent: number = 0;
        let totalRightPercent: number = 0;
        const sprintNewWords: number = statisticInfo.optional.sprint.newWords;
        const audiochallengeNewWords: number = statisticInfo.optional.audiochallenge.newWords;
        if (statisticInfo.optional.sprint.allAnswers > 0) {
            sprintRightAnswersPercent = Math.round(statisticInfo.optional.sprint.rightAnswers /
                statisticInfo.optional.sprint.allAnswers * 100);
        }
        if (statisticInfo.optional.audiochallenge.allAnswers > 0) {
            audiochallengeRightAnswersPercent = Math.round(statisticInfo.optional.audiochallenge.rightAnswers /
                statisticInfo.optional.audiochallenge.allAnswers * 100);
        }      
        const totalNewWords: number = sprintNewWords + audiochallengeNewWords;      
        if (sprintRightAnswersPercent === 0 && audiochallengeRightAnswersPercent === 0) {
            totalRightPercent = 0;
        } else {
            totalRightPercent = (sprintRightAnswersPercent + audiochallengeRightAnswersPercent) / 2;
        }
        
        const content: string = `
        <div class="statistic-page__title">
            <h2 class="games-statistic-title">Statistics</h2>
        </div>
    
        <div class="games-statistic-container">
            <div class="statistics-container">
                    <div class="game-title">
                        <h3>Sprint game</h3>
                    </div>
                    <div class="stats-block__wrap">
                        <img class="stats-sticker__img" src="./assets/analysis.png"> 
                    <div class="stats__description-block">
                        <div class="stats__description">New words</div> 
                        <div class="stats__description">Right answers</div> 
                        <div class="stats__description">The longest serie</div> 
                    </div>
                    <div class="stats__info-block">
                        <div class="stats__info" class="sprint-new__words-count">${sprintNewWords} words</div>
                        <div class="stats__info" class="sprint-right__words-count">${sprintRightAnswersPercent} %</div>
                        <div class="stats__info" class="sprint-longest__words-serie">${statisticInfo.optional.sprint.maxLine} words</div>
                    </div>
                </div>
            </div>
    
            <div class="statistics-container">
                     <div class="game-title">
                        <h3 class="game-title">Audio Challenge</h3>
                    </div>
                    <div class="stats-block__wrap">
                    <img class="stats-sticker__img" src="./assets/pie.png"> 
                    <div class="stats__description-block">
                        <div class="stats__description">New words</div> 
                        <div class="stats__description">Right answers</div> 
                        <div class="stats__description">The longest serie</div> 
                    </div>
                    <div class="stats__info-block">
                        <div class="stats__info" class="audiochallenge-new__words-count">${audiochallengeNewWords} words</div>
                        <div class="stats__info" class="audiochallenge-right__words-count">${audiochallengeRightAnswersPercent}%</div>
                        <div class="stats__info" class="audiochallenge-longest__words-serie">${statisticInfo.optional.audiochallenge.maxLine} words</div>
                    </div>
                </div>
            </div>
    
        <div class="statistics-container">
            <div class="game-title">
                <h3 class="game-title">Overall progress</h3>
            </div>
        <div class="stats-block__wrap">
        <img class="stats-sticker__img" src="./assets/search.png"> 
            <div class="stats__description-block">
                <div class="stats__description">New words count</div> 
                <div class="stats__description">Right answers</div> 
                <div class="stats__description">Learned words count</div> 
            </div>
            <div class="stats__info-block">
                <div class="stats__info" class="everyday-new__words-count">${totalNewWords} words</div>
                <div class="stats__info" class="everyday-learn__words-count">${totalRightPercent}%</div>
                <div class="stats__info" class="everyday-right__words-count">${statisticInfo.learnedWords } words</div>
           </div>
        </div>
        </div>
        </div>
    `;  
    main.innerHTML = content;
}   

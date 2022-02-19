import { getStatistics } from "../api/api";
import { statisticOptions } from "../constants/statistic";
import "../statistic-page/statistic-page.css";
import { createStatistic } from "../utilits/utilits";

export async function renderStatisticPage(): Promise<void> {
  const main: HTMLElement | null = document.querySelector(".main");
  let userId: string = "";
  if (localStorage.getItem("Your userId")) {
    userId = localStorage.getItem("Your userId") as string;
  }
  if ((!localStorage.getItem("Your id") || localStorage.getItem("Your id")) &&
    !userId) {
      if (main) {
        main.innerHTML = `<h2 class="wrong-message-statistic">${statisticOptions.wrongMessage}</h2>`;
      }
    return;
  } else {
    let statisticInfo = (await getStatistics(userId)) as IStatistics;
    if (statisticInfo === undefined) {
      const currentDate: Date = new Date();
      const day: number = currentDate.getDate();
      const month: number = currentDate.getMonth();
      const year: number = currentDate.getFullYear();
      await createStatistic(userId, year, month, day);
      statisticInfo = (await getStatistics(userId)) as IStatistics;
    }
    let sprintRightAnswersPercent: number = 0;
    let audiochallengeRightAnswersPercent: number = 0;
    let totalRightPercent: number = 0;
    const sprintNewWords: number = statisticInfo.optional.sprint.newWords;
    const audiochallengeNewWords: number =
      statisticInfo.optional.audiochallenge.newWords;
    if (statisticInfo.optional.sprint.allAnswers > 0) {
      sprintRightAnswersPercent = Math.round(
        (statisticInfo.optional.sprint.rightAnswers /
          statisticInfo.optional.sprint.allAnswers) *
          statisticOptions.percentCoefficient
      );
    }
    if (statisticInfo.optional.audiochallenge.allAnswers > 0) {
      audiochallengeRightAnswersPercent = Math.round(
        (statisticInfo.optional.audiochallenge.rightAnswers /
          statisticInfo.optional.audiochallenge.allAnswers) *
          statisticOptions.percentCoefficient
      );
    }
    const totalNewWords: number = sprintNewWords + audiochallengeNewWords;
    if (
      sprintRightAnswersPercent === 0 &&
      audiochallengeRightAnswersPercent === 0
    ) {
      totalRightPercent = 0;
    } else if (
      sprintRightAnswersPercent === 0 &&
      audiochallengeRightAnswersPercent > 0
    ) {
      totalRightPercent = audiochallengeRightAnswersPercent;
    } else if (
      sprintRightAnswersPercent > 0 &&
      audiochallengeRightAnswersPercent === 0
    ) {
      totalRightPercent = sprintRightAnswersPercent;
    } else {
      totalRightPercent =
        (sprintRightAnswersPercent + audiochallengeRightAnswersPercent) / 2;
    }
    const content: string = `
      <div class="statistic-page__title">
        <h2 class="games-statistic-title">${statisticOptions.pageTitle}</h2>
      </div>
  
      <div class="games-statistic-container">
        <div class="statistics-container">
          <div class="game-title">
              <h3>${statisticOptions.gameNames[0]}</h3>
            </div>
            <div class="stats-block__wrap">
              <img class="stats-sticker__img" src="./assets/analysis.png"> 
            <div class="stats__description-block">
              <div class="stats__description">${statisticOptions.tableOptions[0]}</div> 
              <div class="stats__description">${statisticOptions.tableOptions[1]}</div> 
              <div class="stats__description">${statisticOptions.tableOptions[2]}</div> 
            </div>
            <div class="stats__info-block">
              <div class="stats__info" class="sprint-new__words-count">${sprintNewWords} ${statisticOptions.words}</div>
              <div class="stats__info" class="sprint-right__words-count">${sprintRightAnswersPercent} ${statisticOptions.percent}</div>
              <div class="stats__info" class="sprint-longest__words-serie">${statisticInfo.optional.sprint.maxLine} ${statisticOptions.words}</div>
            </div>
          </div>
        </div>
  
        <div class="statistics-container">
          <div class="game-title">
              <h3 class="game-title">${statisticOptions.gameNames[1]}</h3>
            </div>
            <div class="stats-block__wrap">
            <img class="stats-sticker__img" src="./assets/pie.png"> 
            <div class="stats__description-block">
              <div class="stats__description">${statisticOptions.tableOptions[0]}</div> 
              <div class="stats__description">${statisticOptions.tableOptions[1]}</div> 
              <div class="stats__description">${statisticOptions.tableOptions[2]}</div> 
            </div>
            <div class="stats__info-block">
              <div class="stats__info" class="audiochallenge-new__words-count">${audiochallengeNewWords} ${statisticOptions.words}</div>
              <div class="stats__info" class="audiochallenge-right__words-count">${audiochallengeRightAnswersPercent} ${statisticOptions.percent}</div>
              <div class="stats__info" class="audiochallenge-longest__words-serie">${statisticInfo.optional.audiochallenge.maxLine} ${statisticOptions.words}</div>
            </div>
          </div>
        </div>
  
      <div class="statistics-container">
        <div class="game-title">
          <h3 class="game-title">${statisticOptions.tableOptions[4]}</h3>
        </div>
      <div class="stats-block__wrap">
      <img class="stats-sticker__img" src="./assets/search.png"> 
        <div class="stats__description-block">
          <div class="stats__description">${statisticOptions.tableOptions[0]}</div> 
          <div class="stats__description">${statisticOptions.tableOptions[1]}</div> 
          <div class="stats__description">${statisticOptions.tableOptions[3]}</div> 
        </div>
        <div class="stats__info-block">
          <div class="stats__info" class="everyday-new__words-count">${totalNewWords} ${statisticOptions.words}</div>
          <div class="stats__info" class="everyday-learn__words-count">${totalRightPercent} ${statisticOptions.percent}</div>
          <div class="stats__info" class="everyday-right__words-count">${statisticInfo.learnedWords} ${statisticOptions.words}</div>
        </div>
      </div>
      </div>
      </div>
    `;
    if (main) { main.innerHTML = content; } 
  }
}

import { GameWord, sprintGame } from '../constants/sprint';
import '../sprint-game/sprint-game.css';
import { setStatistic } from '../utilits/utilits';

export let timerId: NodeJS.Timer;

async function getWords(): Promise<IWord[]> {
    const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${sprintGame.group}&page=${sprintGame.page}`);
    const words: IWord[] = await response.json();
    return words;
  }

// export async function renderSprintPage(): Promise<void> {
//     const content: string = `
//     <div class="game-sprint-title-container">
//         <h3 class="game-sprint-page-title">SPRINT</h3>
//     </div>
//     <div class="game-sprint-describe-container">
//         <h3 class="game-sprint-describe">In this game you must choose rihgt answer.
//         Click at that button you think right or press key left or right
//         for choosing answer</h3>
//     </div>
//     <div class="game-sprint-difficult-container">
//         <h4 class="sprint-difficult-subtitle">Choose the difficult of the game:</h4>
//         <div class="difficult-buttons-container">
//             <button class="btn difficult-btn choosen-btn" id="sprint-difficult-btn-1">1</button>
//             <button class="btn difficult-btn" id="sprint-difficult-btn-2">2</button>
//             <button class="btn difficult-btn" id="sprint-difficult-btn-3">3</button>
//             <button class="btn difficult-btn" id="sprint-difficult-btn-4">4</button>
//             <button class="btn difficult-btn" id="sprint-difficult-btn-5">5</button>
//             <button class="btn difficult-btn" id="sprint-difficult-btn-6">6</button>
//         </div>
//     </div>
//     <button class="btn sprint-start-btn">Let's start!</button>
//     `;
//     const footer = document.querySelector('.footer') as HTMLElement;
//     const main = document.querySelector('.main') as HTMLElement;
//     footer.classList.add('disabled');
//     main.innerHTML = content;
//     await chooseDifficult();
//     await startGameSprint();
// }

// async function chooseDifficult(): Promise<void> {
//     const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.difficult-btn');
//     const buttonContainer: HTMLElement | null = document.querySelector('.difficult-buttons-container');
//     buttonContainer?.addEventListener('click', async (e: Event) => {
//         const target = e.target as HTMLElement;
//         buttons.forEach((el, i) => {
//             el.classList.remove('choosen-btn')
//         })
//         target.classList.add('choosen-btn');
//         sprintGame.difficult = +target.id.slice(target.id.length - 1);
//     }) 
// TODO Оставить получение через датасет, убрать форич    
// }

export async function startGameSprint(): Promise<void> {
    await resetSprintGame();
    const content: string = `
    <div class="timer-sprint"></div>
    <div class="sprint-game-area">
        <div class="sprint-difficult-info-container">
            <div class="sprint-score">${sprintGame.gameOptions[0]}<span class="score-window">0</span></div>
            <div class="pop-up-window-score"></div>
            <p class="sprint-difficult-info">Difficulty: ${sprintGame.difficult + 1}</p>               
        </div>  
        <div class="question-area"></div>  
        <div class="answer-btn">
            <button class="right-btn" id="right-answer">\<----RIGHT</button>
            <button class="wrong-btn" id="wrong-answer">WRONG----\></button>
        </div> 
                                 
    </div>
    `;
    const main = document.querySelector('.main') as HTMLElement;
    main.innerHTML = content;
    await formGameWords();
    timer(60);
    const btnAnswer = document.querySelector('.answer-btn') as HTMLElement;   
    btnAnswer.addEventListener('click', async (e: Event): Promise<void> => {
    await verifyAnswer(e)});       
}

async function verifyAnswer(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    if (target.id === sprintGame.gameOptions[1]) {
        if (sprintGame.gameWords[sprintGame.count - 1].right) { 
            getSprintScore();
            renderQuestion(); 
        } else {
            sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
            sprintGame.answerSeries = 0;
            renderQuestion();
        }
    } else if (target.id === sprintGame.gameOptions[2]) {
        if (!sprintGame.gameWords[sprintGame.count - 1].right) {
            getSprintScore();
            renderQuestion();
        } else {
            sprintGame.gameWords[sprintGame.count - 1].userAnswer = false;
            sprintGame.answerSeries = 0;
            renderQuestion();
        }
    }
}

function timer(value: number): void {
    timerId = setInterval(() => {
        if (value === 0) {
            clearInterval(timerId);       
            getResults();
        }
        const timerWindow = document.querySelector('.timer-sprint') as HTMLElement;
        timerWindow.innerHTML = String(value).padStart(2, '0');
        value--;
    }, 1000);
}

function getSprintScore():void {
    switch (sprintGame.answerSeries) {
        case 3: 
            sprintGame.score += sprintGame.advanceScore[0];
            showWinMessage('nice!', sprintGame.advanceScore[0]);
            break;
        case 6:
            sprintGame.score += sprintGame.advanceScore[1];
            showWinMessage('good!', sprintGame.advanceScore[1]);
            break;
        case 9:
            sprintGame.score += sprintGame.advanceScore[2];
            showWinMessage('very good!', sprintGame.advanceScore[2]);
            break;
        case 12:
            sprintGame.score += sprintGame.advanceScore[3];
            showWinMessage('amazing!', sprintGame.advanceScore[3]);
            break;
        case 15:
            sprintGame.score += sprintGame.advanceScore[4];
            showWinMessage('excellent!', sprintGame.advanceScore[4]);
            break;
        case 18:
            sprintGame.score += sprintGame.advanceScore[5];
            showWinMessage('impressive!', sprintGame.advanceScore[5]);
            break;
        case 20:
            sprintGame.score += sprintGame.advanceScore[6];
            showWinMessage('godlike!', sprintGame.advanceScore[6]);
            break;  
    }
    sprintGame.score += sprintGame.advanceScore[0];
    sprintGame.answerSeries++;
    if (sprintGame.answerSeries > sprintGame.seriesTotalStatistics) {
        sprintGame.seriesTotalStatistics = sprintGame.answerSeries
    }
    const scoreWindow = document.querySelector('.score-window') as HTMLElement;
    scoreWindow.innerHTML = sprintGame.score.toString();
    console.log( sprintGame.answerSeries, sprintGame.seriesTotalStatistics);
}

function showWinMessage(message: string, addingScore: number): void {
    const content: string = `
        <div class="win-message-container">
            <p class="win-message">${message}</p>
            <p class="adding-score">+${addingScore}</p>
        </div>
    `;
    const popUpWindow = document.querySelector('.pop-up-window-score') as HTMLElement;
    popUpWindow.innerHTML = content;
}

async function formGameWords(): Promise<void> {
    sprintGame.group = sprintGame.difficult;
    const arr = await getWords();
    arr.forEach((elem, index) => {
        const gameWord: GameWord = {question: elem.word, answer: elem.wordTranslate, right: true, rightAnswer: elem.wordTranslate, userAnswer: true}
        sprintGame.gameWords[index] = gameWord;      
    });
    await formRandomWords(); 
}

async function formRandomWords() {
    sprintGame.gameWords.forEach(async (el, index) => {
        if (index % 2 !== 0) {
            const temporary = await getRandomAnswer();
            el.answer = temporary.answer;
            el.right = temporary.right;
        }        
    })
    await shuffle(sprintGame.gameWords);
    await renderQuestion();
}

async function getRandomAnswer(): Promise<{answer: string, right: boolean}> {
    sprintGame.group = Math.round(Math.random() * 5);
    sprintGame.page = Math.round(Math.random() * 29);
    const randomAnswer = await getWords();
    const temp: {answer: string, right: boolean} = {answer: '', right: false};
    temp.answer = randomAnswer[Math.round(Math.random() * 19)].wordTranslate;
    temp.right = false;
    return temp;
}

async function renderQuestion(): Promise<void> {
    if (sprintGame.count === 20) { 
        getResults();
        return;
    }   
    setTimeout( () => {
        const content = `
        <div class="sprint-question">${sprintGame.gameWords[sprintGame.count].question}</div>
        <div class="sprint-meaning">this means?</div>
        <div class="sprint-answer">${sprintGame.gameWords[sprintGame.count].answer}</div>
        `;
        const gameArea = document.querySelector('.question-area') as HTMLElement;
        gameArea.innerHTML = content;
        sprintGame.count++; 
    }, 350);    
}

 async function shuffle(array: Array<GameWord>): Promise<void> {
    array.sort(() => Math.random() - 0.5);
}

function getResults(): void {
    if (sprintGame.answerSeries === 19) {
        sprintGame.seriesTotalStatistics += sprintGame.answerSeries;
    }
    clearInterval(timerId);
    sprintGame.gameWords.length = sprintGame.count - 1;
    const main = document.querySelector('.main') as HTMLElement;
    let rightAnswers: string = '';
    let wrongAnswers: string = '';
    sprintGame.gameWords.forEach((el,index) => {
        if (el.userAnswer) {
            rightAnswers += `<li>${el.question} - ${el.rightAnswer}</li>`;
        } else if (!el.userAnswer) {
            wrongAnswers += `<li>${el.question} - ${el.rightAnswer}</li>`;
        }
    })
    const content: string = `
        <div class="sprint-results-area">
            <p class="sprint-results">GAME OVER! Your score is: ${sprintGame.score}</p>
            <div class="area-results">
                <p class="answer-subtitle-right">Right answers:</p>
                <ol class="right-answers-result"></ol>
                <p class="answer-subtitle-wrong">Wrong answers:</p>
                <ol class="wrong-answers-result"></ol>
            </div>          
        </div>
        <button class="try-again-sprint">Try again?</button>
    `; 
    main.innerHTML = content;
    const rightAnswersResult = document.querySelector('.right-answers-result') as HTMLElement;
    const wrongAnswersResult = document.querySelector('.wrong-answers-result') as HTMLElement;
    const areaResult = document.querySelector('.area-results') as HTMLElement;
    if (sprintGame.count === 1) {
        areaResult.innerHTML = 'You dont answer any question';
    } else {
        rightAnswersResult.innerHTML = rightAnswers;
        wrongAnswersResult.innerHTML = wrongAnswers;      
    }
    setStatistic();//Количество новых слов, самая длинная серия правильных ответов, кол-во правильных ответов.
    const tryAgainBtn = document.querySelector('.try-again-sprint') as HTMLButtonElement;
    tryAgainBtn.addEventListener('click', () => {     
        startGameSprint();
    });
}

async function resetSprintGame(): Promise<void> {
    sprintGame.count = 0;
    sprintGame.score = 0;
    sprintGame.answerSeries = 0;
    sprintGame.group = sprintGame.difficult;
    sprintGame.page = 0;
}
